---
title: Marker：把 PDF 手册批量转成 Markdown
date: 2026-10-30
tags: [Marker, PDF, 文档转换, 工具]
description: 用 datalab-to/marker 在 Windows + CPU 环境下把 PDF 手册高保真转成 Markdown，含代理、模型下载和踩坑记录。
---

# Marker：把 PDF 手册批量转成 Markdown

芯片手册、协议文档、论文这些资料，往往只有 PDF。丢给大模型之前，得先变成 Markdown，否则表格散架、公式乱码、多栏串行。

[Marker](https://github.com/datalab-to/marker)（`marker-pdf` v2.0.0）就是干这个的：把 PDF、图片、PPTX、DOCX、XLSX、HTML、EPUB 转成 Markdown / JSON / HTML / Chunks。

---

## 一、工具介绍

> - **项目地址**：<https://github.com/datalab-to/marker>
> - **pip 包名**：`marker-pdf`（本文对应 v2.0.0）
> - **许可**：代码 Apache 2.0 可商用；模型权重为 OpenRAIL-M，研究 / 个人 / 融资或营收 500 万美元以下免费，超出需单独授权

### 解决什么问题

`PyPDF2`、`pdfplumber` 这类工具只能按内容流抽文字，版面信息全丢。Marker 用 **版面分析模型 + OCR + 后处理管线** 重建结构：

- 表格 / 表单 / 公式 / 行内数学 / 链接 / 引用 / 代码块 的结构化还原
- 图片抽取并保存为独立文件
- 自动剥离页眉页脚、页码等噪声
- 多语言（OCR 走 surya 多语种模型）

### 典型使用场景

| 场景 | 说明 |
|---|---|
| RAG / 知识库 | `--output_format chunks` 直接输出可切块喂向量库的内容 |
| 语料清洗 | 批量把论文、财报、手册转成干净 Markdown |
| 表格抽取 | `TableConverter` 只抽取表格，用于数据分析 / 入库 |
| 文档结构化 | JSON 输出保留 block 层级（`children`、`block_type`），可程序化遍历 |
| 扫描件数字化 | `--force_ocr` 处理没有文本层的扫描 PDF |
| 批量处理 | `marker /folder --workers N` 支持多机分片 |

### 源码结构

```
marker/
├── converters/   # 转换管线：pdf（全文）、table（仅表格）、ocr
├── builders/     # 版面 / OCR / 文本层的构建
├── processors/   # 20+ 后处理模块：表格重建、公式、代码块、参考文献、页眉页脚移除、LLM 增强
├── renderers/    # 输出渲染：markdown / json / html / chunk
├── providers/    # PDF、图片等输入源适配
└── services/     # LLM 服务：Gemini / OpenAI / Claude / Azure / Ollama
```

---

## 二、环境搭建

以 **Windows + 纯 CPU + 公司代理** 为例，Linux / macOS 除虚拟环境路径外完全一致。前提：Python **3.10–3.12**，无需 GPU。

### 1. 设置代理（可选）

先设代理，后面的 clone 和 pip 都依赖它（只对当前终端有效，开新窗口要重设）：

```powershell
$env:HTTP_PROXY  = 'http://<代理地址>:<端口>'
$env:HTTPS_PROXY = 'http://<代理地址>:<端口>'
```

### 2. 克隆仓库并建独立环境

```powershell
git clone https://github.com/datalab-to/marker.git d:\code\marker
cd d:\code\marker
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -U pip
```

以下命令都在 `d:\code\marker` 目录下执行，`.\.venv\...` 是相对路径。

### 3. 先单独装 CPU 版 torch

不要直接 `pip install -e .`，否则可能拉到带 CUDA 的包（2 GB+）。

```powershell
.\.venv\Scripts\python.exe -m pip install torch --index-url https://download.pytorch.org/whl/cpu
```

实测装到 `torch 2.14.1+cpu` / `2.15.0+cpu` 都正常（项目只约束 `torch>=2.7,<3`，不必锁版本），下载约 130 MB。自检：

```powershell
.\.venv\Scripts\python.exe -c "import torch; print(torch.__version__, torch.cuda.is_available())"
```

### 4. 安装 marker 本体

```powershell
.\.venv\Scripts\python.exe -m pip install -e "d:\code\marker"
```

会连带装 `surya-ocr 0.22.1`、`transformers 5.20.2`、`pdftext`、`pypdfium2`、`scikit-learn` 等，总下载约 400–500 MB。

要处理 PDF 以外的格式再加 extras：

```powershell
.\.venv\Scripts\python.exe -m pip install -e "d:\code\marker[full]"
```

::: tip
`[full]` 含 `weasyprint`，Windows 上需要 GTK 运行库；装不上就先跳过，PDF 转换不受影响。
:::

### 5. 下载版面模型并指定本地路径（关键坑）

`fast` 模式依赖一个 rf-detr 版面检测模型，默认从 HuggingFace 拉：

```
hf://datalab-to/surya_layout2          # rfdetr_layout.pth + config.json
hf://datalab-to/surya_layout2/order    # order_ar.pt + config.json（阅读顺序头）
```

问题在于：**huggingface.co 经代理返回 503**，Python 端改走 `hf-mirror.com` 又会 `httpx.RemoteProtocolError`。可靠做法是手工从镜像下载到本地，再用环境变量指过去。

```powershell
$ProgressPreference = 'SilentlyContinue'   # 关键：PS 5.1 的进度条会让 IWR 慢到离谱
$p    = 'http://<代理地址>:<端口>'
$base = 'https://hf-mirror.com/datalab-to/surya_layout2/resolve/main'
New-Item -ItemType Directory -Force -Path d:\code\marker\models\surya_layout2\order | Out-Null

Invoke-WebRequest "$base/config.json"       -Proxy $p -OutFile d:\code\marker\models\surya_layout2\config.json
Invoke-WebRequest "$base/order/config.json" -Proxy $p -OutFile d:\code\marker\models\surya_layout2\order\config.json
Invoke-WebRequest "$base/order/order_ar.pt" -Proxy $p -OutFile d:\code\marker\models\surya_layout2\order\order_ar.pt
Invoke-WebRequest "$base/rfdetr_layout.pth" -Proxy $p -OutFile d:\code\marker\models\surya_layout2\rfdetr_layout.pth
```

如果 `Invoke-WebRequest` 仍很慢或中断，改用 curl（必须加 `--ssl-no-revoke`，否则 schannel 会因吊销列表不可达而握手失败）：

```powershell
curl.exe --ssl-no-revoke -x $p -L --retry 3 -o d:\code\marker\models\surya_layout2\rfdetr_layout.pth "$base/rfdetr_layout.pth"
```

四个文件合计约 **135 MB**：

| 文件 | 大小 |
|---|---|
| `rfdetr_layout.pth` | 128.7 MB |
| `order/order_ar.pt` | 6.7 MB |
| `config.json` | 1796 B |
| `order/config.json` | 434 B |

然后用环境变量指向本地目录：

```powershell
$env:FAST_LAYOUT_MODEL_CHECKPOINT = 'D:/code/marker/models/surya_layout2'
$env:FAST_ORDER_MODEL_CHECKPOINT  = 'D:/code/marker/models/surya_layout2/order'
```

这两个变量定义在 `surya/settings.py`，支持 **本地目录 / `hf://` / `s3://`** 三种写法，设成本地目录后就不再联网。

想长期生效（新终端也带上）：

```powershell
[Environment]::SetEnvironmentVariable('FAST_LAYOUT_MODEL_CHECKPOINT','D:/code/marker/models/surya_layout2','User')
[Environment]::SetEnvironmentVariable('FAST_ORDER_MODEL_CHECKPOINT','D:/code/marker/models/surya_layout2/order','User')
```

### 6. 端到端验证

前面几步完成后，先用任意 PDF 转 1 页做冒烟测试：

```powershell
d:\code\marker\.venv\Scripts\marker_single.exe "D:\docs\任意.pdf" --mode fast --disable_ocr --page_range "0" --output_format markdown --output_dir "D:\code\marker\output"
```

出现这类日志就说明链路通了：

```
[INFO] marker: Table processing stats: {'tables_pdftext': 2, 'tables_total': 2}
[INFO] marker: Saved markdown to D:\code\marker\output\任意
[INFO] marker: Total time: 2.64
```

本文整套步骤已在**全新虚拟环境**里复现过一次：torch 2.15.0+cpu、marker-pdf 2.0.0，单页耗时 2.6 s，md 与图片均正常生成。

::: warning
仓库的 `.gitignore` 只忽略了 `.venv`，**没有忽略 `models/` 和 `output/`**。135 MB 的模型建议放在仓库外，或手动补两条忽略规则，避免误提交。
:::

---

## 三、使用说明

### 1. 单文件转换

```powershell
d:\code\marker\.venv\Scripts\marker_single.exe "D:\docs\手册.pdf" --mode fast --disable_ocr --output_format markdown --output_dir "D:\code\marker\output"
```

常用参数：

| 参数 | 说明 |
|---|---|
| `--mode` | `fast`（CPU 默认）/ `balanced`（GPU 默认，质量最高） |
| `--disable_ocr` | 完全关闭 VLM 调用，纯文本层提取 |
| `--output_format` | `markdown` / `json` / `html` / `chunks` |
| `--output_dir` | 输出根目录 |
| `--page_range` | 只处理指定页，如 `"0,5-10,20"` |
| `--force_ocr` | 强制整篇 OCR，扫描件用 |
| `--use_llm` | 用大模型提升表格、公式精度，需配 key |

### 2. 输出结构

```
output\手册\
├── 手册.md                 # 正文
├── 手册_meta.json          # 目录结构、每页统计
└── _page_1_Diagram_5.jpeg  # 抽取的图片，md 内以相对路径引用
```

图片名格式为 `_page_<页码>_<块类型>_<序号>.jpeg`，用 VS Code 或 Typora 直接预览 md 即可看到内嵌效果。

### 3. 批量转换

```powershell
d:\code\marker\.venv\Scripts\marker.exe "D:\pdf目录" --mode fast --disable_ocr --output_dir D:\out --workers 4
```

### 4. Python 调用

```python
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

converter = PdfConverter(
    artifact_dict=create_model_dict(),
    config={"mode": "fast", "disable_ocr": True},
)
rendered = converter("D:/docs/手册.pdf")
text, _, images = text_from_rendered(rendered)
```

> 注意：Python 进程里同样要能读到 `FAST_LAYOUT_*` 两个环境变量（在同一个终端里设过即可），否则 `create_model_dict()` 会去 HuggingFace 下载模型。

### 5. 两种模式对比

| | `balanced` | `fast` |
|---|---|---|
| 版面 | surya VLM | rf-detr（轻量 ONNX / pth） |
| 文本 | 整页 OCR | pdftext 文本层 |
| VLM 调用 | 必须 | 仅公式、坏块的定点修复 |
| 适合 | GPU | CPU / MPS |
| 质量 | 最高 | 数字版文档足够 |

`--disable_ocr` 则在任一模式下完全关掉 VLM，纯文本层提取，扫描页和公式会被跳过。

### 6. 常见问题

| 现象 | 原因 / 解法 |
|---|---|
| `ModuleNotFoundError: No module named 'surya'` | 没装 marker 依赖，回到「环境搭建」第 4 步 |
| 装出来不是文档里的 torch 版本 | 版本正常漂移，满足 `torch>=2.7,<3` 即可，无需降级 |
| `Invoke-WebRequest` 下载 135 MB 极慢 | 先 `$ProgressPreference='SilentlyContinue'`，再不行换 `curl.exe --ssl-no-revoke` |
| `python -m marker.scripts.convert_single` 毫无反应 | 该模块没有 `__main__` 入口，必须用 `.venv\Scripts\marker_single.exe` |
| `httpx.ProxyError: 503` / `RemoteProtocolError` | HF 主站不通，手工下载模型 + 本地 checkpoint |
| `Failed to stop fast_layout (pid xxx): [WinError 87]` | Windows 关子进程的无害告警，可忽略 |
| `curl.exe` 报 `schannel ... 吊销服务器已脱机` | 加 `--ssl-no-revoke`，或改用 `Invoke-WebRequest` |
| 中文路径传给 `python -c` 变成 `浜戣抗...` | PowerShell 传参编码问题；改用脚本文件，或直接让 `marker_single.exe` 收参 |
| `Get-Content xxx.md` 显示乱码 | 文件是 UTF-8，PS 5.1 默认按 GBK 读；加 `-Encoding UTF8` |
| 表格错行、`<None>` 占位 | 纯文本层重建的固有限制，需要 LLM 或 VLM |

### 7. 进阶：OCR 与更高精度

当前配置是纯文本层，扫描件、公式、跨页表格改善不了。上 VLM 有三条路：

- **CPU / Mac**：装 `llama.cpp` 提供 `llama-server`，surya 首次使用自动拉起，模型首次运行自动下载（几百 MB ~ 1 GB+，需代理）。
- **NVIDIA GPU**：装 Docker + NVIDIA Container Toolkit，走 vLLM，`SURYA_INFERENCE_BACKEND=vllm`。
- **最省事**：加 `--use_llm`，接 Gemini（默认 `gemini-3.5-flash`）/ OpenAI / Claude，配好 key 即可：

  ```powershell
  $env:OPENAI_API_KEY = 'sk-...'
  marker_single.exe "手册.pdf" --use_llm --llm_service marker.services.openai.OpenAIService
  ```

  LLM 主要补三块：跨页表格合并、行内数学、表单取值。

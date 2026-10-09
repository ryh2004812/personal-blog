<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 建议 3：终端打字机效果
const lines = [
  { cmd: '$ uname -a', out: 'Linux embedded-workstation 6.1.0 #1 SMP' },
  { cmd: '$ git status', out: 'On branch master\nnothing to commit, working tree clean' },
  { cmd: '$ esptool.py flash firmware.bin', out: 'Flashing @ 0x10000...\nHard resetting via RTS pin...' },
  { cmd: '$ make -j4', out: 'Compiling sources...\nBuild complete. 🎉' }
]

const typed = ref('')
const showCursor = ref(true)
let li = 0
let ci = 0
let timer: number | undefined

function tick() {
  const line = lines[li]
  const full = line.cmd + '\n' + line.out
  if (ci < full.length) {
    typed.value += full[ci]
    ci++
    timer = window.setTimeout(tick, 38)
  } else {
    // 显示完整后停顿，再进入下一行（清空）
    timer = window.setTimeout(() => {
      li = (li + 1) % lines.length
      ci = 0
      typed.value = ''
      tick()
    }, 2200)
  }
}

onMounted(() => {
  tick()
  // 光标闪烁
  window.setInterval(() => (showCursor.value = !showCursor.value), 500)
})
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="term">
    <div class="term__bar">
      <span class="dot dot--r" />
      <span class="dot dot--y" />
      <span class="dot dot--g" />
      <span class="term__title">bash — embedded</span>
    </div>
    <pre class="term__body"><span class="term__text">{{ typed }}<span v-if="showCursor" class="term__cursor">▋</span></span></pre>
  </div>
</template>

<style scoped>
.term {
  width: 360px;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #1e1e2e;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.term__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  background: #2c2c3e;
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.dot--r { background: #ff5f56; }
.dot--y { background: #ffbd2e; }
.dot--g { background: #27c93f; }
.term__title {
  margin-left: 8px;
  font-size: 12px;
  color: #b9b9c9;
}
.term__body {
  margin: 0;
  padding: 16px;
  height: 180px;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.65;
  color: #d4d4e8;
  white-space: pre-wrap;
  word-break: break-word;
}
.term__cursor {
  color: #27c93f;
}
</style>

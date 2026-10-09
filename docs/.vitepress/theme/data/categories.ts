export interface Category {
  key: string
  label: string
  desc: string
  accent: string
}

export const CATEGORIES: Record<string, Category> = {
  embedded: {
    key: 'embedded',
    label: '嵌入式',
    desc: 'ESP32、STM32、RTOS 与低功耗蓝牙等硬件侧的实践记录',
    accent: '#3fb984'
  },
  other: {
    key: 'other',
    label: '其他',
    desc: '常用命令、常用工具等零散但高频查阅的内容',
    accent: '#6a8cff'
  },
  opensource: {
    key: 'opensource',
    label: '开源项目',
    desc: '自己维护的开源项目与造轮子的过程',
    accent: '#c47bff'
  }
}

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES)

/** 从文章 URL 推断所属专栏，例如 /embedded/ble-basics -> embedded */
export function categoryOf(url: string): string {
  const seg = url.replace(/^\//, '').split('/')[0]
  return CATEGORIES[seg] ? seg : ''
}

import { defineConfig } from 'vitepress'
import { CATEGORIES } from './theme/data/categories'

// ====== 站点信息：改成你自己的 ======
const SITE = {
  name: 'Ren Yihao',
  slogan: '技术在实践中留下痕迹',
  description: '记录嵌入式、软件开发与开源实践的个人博客',
  github: 'https://github.com/renyihao',
  gitee: 'https://gitee.com/ren2004'
}
// ===================================

export default defineConfig({
  title: `${SITE.name} 的个人博客`,
  description: SITE.description,
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcExclude: ['**/README.md'],

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#6a8cff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: `${SITE.name} 的个人博客` }],
    ['meta', { property: 'og:description', content: SITE.description }]
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: `${SITE.name}`,
    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    nav: [
      { text: '首页', link: '/' },
      {
        text: CATEGORIES.embedded.label,
        items: [
          { text: 'STM32', link: '/embedded/STM32/' },
          { text: 'ESP32', link: '/embedded/ESP32/' },
          { text: 'RTOS', link: '/embedded/RTOS/' },
          { text: 'Linux', link: '/embedded/Linux/' },
          { text: 'Hardware', link: '/embedded/Hardware/' }
        ]
      },
      {
        text: CATEGORIES.other.label,
        items: [
          { text: '常用命令', link: '/other/commands/' },
          { text: '常用工具', link: '/other/tools/' }
        ]
      },
      {
        text: CATEGORIES.opensource.label,
        items: [
          { text: '项目一', link: '/opensource/project1/' },
          { text: '项目二', link: '/opensource/project2/' }
        ]
      },
      { text: '归档', link: '/archive' },
      { text: '标签', link: '/tags' },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      // 子栏目页面：侧边栏只显示本栏目内容（更长的前缀优先匹配）
      '/embedded/STM32/': [
        {
          text: 'STM32',
          items: [
            { text: 'VSCode + CMake + GCC ARM 搭建 STM32 开发环境', link: '/embedded/STM32/VSCode + CMake + GCC ARM 搭建STM32开发环境' },
            { text: '移植 LVGL 8.3', link: '/embedded/STM32/移植LVGL8.3' },
            { text: 'LVGL v9.3 PC 模拟器环境搭建', link: '/embedded/STM32/LVGL模拟器环境搭建' }
          ]
        }
      ],
      '/embedded/ESP32/': [{ text: 'ESP32', items: [] }],
      '/embedded/RTOS/': [{ text: 'RTOS', items: [] }],
      '/embedded/Linux/': [{ text: 'Linux', items: [] }],
      '/embedded/Hardware/': [{ text: 'Hardware', items: [] }],
      '/other/commands/': [
        {
          text: '常用命令',
          items: [
            { text: 'Git 常用命令速查', link: '/other/commands/git-commands' }
          ]
        }
      ],
      '/other/tools/': [{ text: '常用工具', items: [] }],
      // 栏目首页：显示本栏目下的子栏目入口
      '/embedded/': [
        {
          text: CATEGORIES.embedded.label,
          items: [
            { text: 'STM32', link: '/embedded/STM32/' },
            { text: 'ESP32', link: '/embedded/ESP32/' },
            { text: 'RTOS', link: '/embedded/RTOS/' },
            { text: 'Linux', link: '/embedded/Linux/' },
            { text: 'Hardware', link: '/embedded/Hardware/' }
          ]
        }
      ],
      '/other/': [
        {
          text: CATEGORIES.other.label,
          items: [
            { text: '常用命令', link: '/other/commands/' },
            { text: '常用工具', link: '/other/tools/' }
          ]
        }
      ],
      '/opensource/': [
        {
          text: CATEGORIES.opensource.label,
          items: [
            { text: '项目一', link: '/opensource/project1/' },
            { text: '项目二', link: '/opensource/project2/' }
          ]
        }
      ],
      '/': [
        {
          text: '导航',
          items: [
            { text: '归档', link: '/archive' },
            { text: '标签', link: '/tags' },
            { text: '关于', link: '/about' }
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: SITE.github },
      // Gitee 用内联 SVG：simple-icons 官方图标数据，不依赖 iconify CDN
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>' }, link: SITE.gitee }
    ],

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

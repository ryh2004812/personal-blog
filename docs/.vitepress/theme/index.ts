import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import RecentUpdates from './components/RecentUpdates.vue'
import LastUpdated from './components/LastUpdated.vue'
import PostList from './components/PostList.vue'
import PostArchive from './components/PostArchive.vue'
import TagCloud from './components/TagCloud.vue'
import TerminalTyping from './components/TerminalTyping.vue'
import SiteFooter from './components/SiteFooter.vue'
import './style.css'

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(TerminalTyping),
      'home-features-after': () => h(RecentUpdates),
      'doc-footer-before': () => h(LastUpdated),
      'layout-bottom': () => h(SiteFooter)
    })
  },

  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('PostArchive', PostArchive)
    app.component('TagCloud', TagCloud)
    app.component('TerminalTyping', TerminalTyping)
    app.component('SiteFooter', SiteFooter)
  }
} satisfies Theme

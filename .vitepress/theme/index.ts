import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'
import SolutionsIndex from './components/SolutionsIndex.vue'
import ProductMatrix from './components/ProductMatrix.vue'
import SiteFooter from './components/SiteFooter.vue'
import LanguageSwitch from './components/LanguageSwitch.vue'
import HomeQuickEntries from './components/HomeQuickEntries.vue'
import FilterToolbar from './components/FilterToolbar.vue'
import ProductQuickLinks from './components/ProductQuickLinks.vue'
import ProductStatusBar from './components/ProductStatusBar.vue'
import Updated from './components/Updated.vue'
import Term from './components/Term.vue'
import AboutHero from './components/AboutHero.vue'
import { h } from 'vue'
import LayoutOverride from './LayoutOverride.vue'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    if (typeof DefaultTheme.enhanceApp === 'function') {
      DefaultTheme.enhanceApp(ctx)
    }
    // Register all custom components
    ctx.app.component('SolutionsIndex', SolutionsIndex)
    ctx.app.component('ProductMatrix', ProductMatrix)
    ctx.app.component('SiteFooter', SiteFooter)
    ctx.app.component('LanguageSwitch', LanguageSwitch)
    ctx.app.component('HomeQuickEntries', HomeQuickEntries)
    ctx.app.component('FilterToolbar', FilterToolbar)
    ctx.app.component('ProductQuickLinks', ProductQuickLinks)
    ctx.app.component('ProductStatusBar', ProductStatusBar)
    ctx.app.component('Updated', Updated)
    ctx.app.component('Term', Term)
  ctx.app.component('AboutHero', AboutHero)
  },
  Layout: () => h(LayoutOverride)
}

export default theme

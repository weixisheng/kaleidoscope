import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import asyncRoutes from './modules/async-routes'
import presetRoutes from './modules/preset-routes'

// 合并所有路由
const routes: RouteRecordRaw[] = [
  // ...asyncRoutes, 
  ...presetRoutes
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  // 设置页面标题
  const title = to.meta?.title as string
  if (title) {
    document.title = `${title} - 万花筒设计`
  }
  next()
})

export default router

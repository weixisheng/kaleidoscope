import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入应用组件
import App from './App.vue'
import router from './router'

// 创建应用实例
const app = createApp(App)

// 注册Pinia状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Element Plus并配置中文语言
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化应用
const initApp = async () => {
  try {
    // 挂载应用
    app.mount('#app')
  
  } catch (error) {
    console.error('应用初始化失败:', error)
    // 即使认证初始化失败，也要挂载应用
    app.mount('#app')
  }
}

// 启动应用
initApp()
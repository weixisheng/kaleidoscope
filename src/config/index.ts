/**
 * 全局配置入口
 * 
 * @author 米多团队
 */

export * from './api'

// 应用配置
export const APP_CONFIG = {
  // 应用名称
  name: '米多总后台',
  
  // 应用版本
  version: '1.0.0',
  
  // 主题色
  primaryColor: '#1675d1',
  
  // 布局配置
  layout: {
    sidebarWidth: '200px',
    headerHeight: '60px'
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 20,
    pageSizes: [10, 20, 50, 100]
  }
}
import type { Component } from 'vue'
import type { ButtonProps } from 'element-plus'

// 按钮配置接口
export interface IButtonConfig {
  // 按钮唯一标识，用于事件回调
  name: string
  // 按钮显示文字
  text: string
  // 按钮图标：支持Element Plus图标名称字符串或图标组件
  // 字符串示例: 'Plus', 'Edit', 'Delete', 'Setting' 等
  // 组件示例: markRaw(Plus), markRaw(Edit) 等
  icon?: string | Component
  // 按钮类型，影响按钮的颜色和样式
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  // Element Plus Button 组件的其他属性
  attrs?: Partial<ButtonProps>
  // 是否显示该按钮，默认为 true
  show?: boolean
  // 权限标识，用于权限控制（需要集成权限系统）
  permission?: string
}

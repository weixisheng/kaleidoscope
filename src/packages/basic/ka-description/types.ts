export interface KaDescriptionProps {
  /** 描述文本内容 */
  text?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 字体颜色 */
  color?: string
  /** 内边距 */
  padding?: string
  /** 边框圆角 */
  borderRadius?: string
  /** 字体大小 */
  fontSize?: string
  /** 行高 */
  lineHeight?: string | number
}

export interface KaDescriptionSlots {
  /** 默认插槽，用于自定义内容 */
  default?: () => any
}
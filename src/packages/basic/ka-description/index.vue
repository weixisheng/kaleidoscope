<!--
  组件名称: KaDescription
  功能描述: 通用描述文本组件，支持自定义样式和插槽内容，用于显示说明性文本信息
  分类: 展示组件
  导入路径: @/packages/basic/ka-description/index.vue
  
  属性定义:
  - text: string - 描述文本内容，当使用插槽时此属性被忽略
  - backgroundColor: string - 背景颜色，默认'#f8f8f8'
  - color: string - 字体颜色，默认'#333'
  - padding: string - 内边距，默认'12px 16px'
  - borderRadius: string - 边框圆角，默认'4px'
  - fontSize: string - 字体大小，默认'14px'
  - lineHeight: string | number - 行高，默认1.5
  
  插槽定义:
  - default: 默认插槽，用于自定义内容，优先级高于text属性
  
  使用示例:
  基础用法:
  <ka-description text="这是一段描述文本" />
  
  自定义样式:
  <ka-description 
    text="警告信息"
    background-color="#fff3cd"
    color="#856404"
    padding="16px 20px"
    border-radius="8px"
  />
  
  插槽用法:
  <ka-description background-color="#e3f2fd" color="#1565c0">
    <h4>标题</h4>
    <p>这里可以放置任意的 HTML 内容</p>
  </ka-description>
  
  预设主题样式:
  信息样式: background-color="#e3f2fd" color="#1565c0"
  成功样式: background-color="#d4edda" color="#155724"
  警告样式: background-color="#fff3cd" color="#856404"
  错误样式: background-color="#f8d7da" color="#721c24"
  
  AI生成指引: 这是一个灵活的描述文本组件，适用于表单说明、功能介绍、状态提示等场景。支持通过属性或插槽传入内容，可自定义各种样式属性。当内容为空时自动隐藏，具有良好的响应式表现和用户体验。
-->

<template>
    <div class="ka-description" :style="descriptionStyle">
        <slot>
            {{ text }}
        </slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KaDescriptionProps } from './types'

defineOptions({
    name: 'KaDescription'
})

const props = withDefaults(defineProps<KaDescriptionProps>(), {
    text: '',
    backgroundColor: '#f8f8f8',
    color: '#333',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: 1.5
})

// 计算样式
const descriptionStyle = computed(() => ({
    backgroundColor: props.backgroundColor,
    color: props.color,
    padding: props.padding,
    borderRadius: props.borderRadius,
    fontSize: props.fontSize,
    lineHeight: props.lineHeight
}))
</script>

<style scoped lang="scss">
.ka-description {
    display: block;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;

    &:empty {
        display: none;
    }

    // 当内容为空时隐藏
    &:not(:has(*)):empty {
        display: none;
    }
}
</style>
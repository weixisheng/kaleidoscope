<!--
  组件名称: KaButtonGroup
  功能描述: 通用按钮群组件，默认包含新增按钮，支持自定义按钮配置和灵活的图标系统
  分类: 操作组件
  导入路径: @/packages/basic/ka-button-group/index.vue
  
  属性定义:
  - buttons: IButtonConfig[] - 按钮配置数组
    - name: string - 按钮唯一标识
    - text: string - 按钮文字
    - icon: string | Component - 按钮图标（支持所有Element Plus图标名称或图标组件）
    - type: ButtonType - 按钮类型
    - attrs: ButtonProps - 按钮属性
    - show: boolean - 是否显示
    - permission: string - 权限标识
  - showAdd: boolean - 是否显示默认新增按钮，默认true
  - addText: string - 新增按钮文字，默认'新增'
  - addIcon: string | Component - 新增按钮图标（支持所有Element Plus图标）
  - align: 'left' | 'right' | 'center' - 按钮对齐方式，默认left
  
  图标系统:
  - 支持所有Element Plus图标，只需传入图标名称字符串
  - 支持直接传入图标组件，获得更好的类型安全
  - 自动错误处理，图标不存在时给出警告并正常显示按钮
  - 混合使用字符串图标名称和图标组件
  
  事件定义:
  - buttonClick: (name: string, button: IButtonConfig) => void - 按钮点击事件
  
  使用示例:
  基础用法:
  <ka-button-group @button-click="handleButtonClick" />
  
  字符串图标:
  <ka-button-group 
    :buttons="[
      { name: 'add', text: '新增', icon: 'Plus', type: 'primary' },
      { name: 'export', text: '导出', icon: 'Download', type: 'default' },
      { name: 'setting', text: '设置', icon: 'Setting', type: 'default' }
    ]"
    @button-click="handleButtonClick"
  />
  
  组件图标:
  <ka-button-group 
    :buttons="[
      { name: 'star', text: '收藏', icon: markRaw(Star), type: 'warning' },
      { name: 'heart', text: '喜欢', icon: markRaw(Heart), type: 'danger' }
    ]"
    @button-click="handleButtonClick"
  />
  
  AI生成指引: 这是一个功能强大且灵活的按钮群组件，支持所有Element Plus图标，具有完善的错误处理机制。默认提供新增按钮，支持完全自定义配置，适用于各种操作场景，特别是列表页面的操作按钮区域。
-->

<template>
    <div class="ka-button-group" :class="alignClass">
        <!-- 默认新增按钮 -->
        <el-button v-if="showAdd && !hasCustomAddButton" :icon="addIconComponent" type="primary"
            @click="handleButtonClick('add', defaultAddButton)">
            {{ addText }}
        </el-button>

        <!-- 自定义按钮 -->
        <template v-for="button in visibleButtons" :key="button.name">
            <el-button v-if="checkPermission(button)" :icon="getButtonIcon(button)" v-bind="button.attrs"
                :type="button.type || 'default'" @click="handleButtonClick(button.name, button)">
                {{ button.text }}
            </el-button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Component, computed, markRaw } from 'vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import type { IButtonConfig } from './types'

// 动态创建图标映射表，包含所有 Element Plus 图标
const iconMap = new Map<string, Component>()

// 初始化图标映射表
Object.keys(ElementPlusIcons).forEach(iconName => {
    const iconComponent = (ElementPlusIcons as any)[iconName]
    if (iconComponent) {
        iconMap.set(iconName, markRaw(iconComponent))
    }
})

defineOptions({
    name: 'KaButtonGroup'
})

// 定义属性
const props = withDefaults(defineProps<{
    buttons?: IButtonConfig[] // 自定义按钮配置
    showAdd?: boolean // 是否显示默认新增按钮
    addText?: string // 新增按钮文字
    addIcon?: string | Component // 新增按钮图标
    align?: 'left' | 'right' | 'center' // 对齐方式
}>(), {
    buttons: () => [],
    showAdd: true,
    addText: '新增',
    addIcon: 'Plus',
    align: 'left'
})

// 定义事件
const emit = defineEmits<{
    buttonClick: [name: string, button: IButtonConfig]
}>()

// 默认新增按钮配置
const defaultAddButton: IButtonConfig = {
    name: 'add',
    text: props.addText,
    icon: props.addIcon,
    type: 'primary'
}

// 新增按钮图标组件
const addIconComponent = computed(() => {
    if (typeof props.addIcon === 'string') {
        const iconComponent = iconMap.get(props.addIcon)
        if (iconComponent) {
            return iconComponent
        }

        // 如果映射表中没有，给出警告并返回 undefined
        console.warn(`[KaButtonGroup] 新增按钮图标 "${props.addIcon}" 不存在于 Element Plus 图标库中。请检查图标名称是否正确，或直接传入图标组件。`)
        return undefined
    }
    return props.addIcon
})

// 检查是否有自定义的新增按钮
const hasCustomAddButton = computed(() => {
    return props.buttons.some(button => button.name === 'add')
})

// 可见的按钮列表
const visibleButtons = computed(() => {
    return props.buttons.filter(button => button.show !== false)
})

// 对齐样式类
const alignClass = computed(() => {
    return `button-group-${props.align}`
})

// 获取按钮图标
function getButtonIcon(button: IButtonConfig) {
    if (!button.icon) return undefined

    // 如果是字符串，尝试从图标映射表中获取
    if (typeof button.icon === 'string') {
        const iconComponent = iconMap.get(button.icon)
        if (iconComponent) {
            return iconComponent
        }

        // 如果映射表中没有，给出警告并返回 undefined
        console.warn(`[KaButtonGroup] 图标 "${button.icon}" 不存在于 Element Plus 图标库中。请检查图标名称是否正确，或直接传入图标组件。`)
        return undefined
    }

    // 如果是组件，直接返回
    return button.icon
}

// 检查权限（这里可以集成实际的权限系统）
function checkPermission(button: IButtonConfig): boolean {
    if (!button.permission) return true

    // 这里可以集成实际的权限检查逻辑
    // 例如：return hasPermission(button.permission)
    return true
}

// 处理按钮点击
function handleButtonClick(name: string, button: IButtonConfig) {
    emit('buttonClick', name, button)
}
</script>

<style lang="scss" scoped>
.ka-button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    // 左对齐（默认）
    &.button-group-left {
        justify-content: flex-start;
    }

    // 右对齐
    &.button-group-right {
        justify-content: flex-end;
    }

    // 居中对齐
    &.button-group-center {
        justify-content: center;
    }

    // 响应式处理
    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 8px;

        :deep(.el-button) {
            flex: 1;
            min-width: 80px;
        }
    }
}

// 按钮间距调整
.ka-button-group :deep(.el-button) {
    margin: 0;
}

// 按钮组在卡片中的样式调整
.el-card .ka-button-group {
    margin-bottom: 0;
}
</style>
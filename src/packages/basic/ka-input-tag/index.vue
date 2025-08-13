<!--
  组件名称: KaInputTag
  功能描述: 可编辑的标签输入组件，支持添加、删除标签，带有滚动条和自定义配置
  分类: 表单组件
  导入路径: @/packages/basic/ka-input-tag/index.vue
  
  属性定义:
  - config: Object - 配置对象
    - buttonAttrs: Record<string, any> - 添加按钮的属性配置
      - btnText: string - 按钮文本，默认为 "+ New Tag"
    - inputAttrs: Record<string, any> - 输入框的属性配置
    - tagAttrs: Record<string, any> - 标签的属性配置
  - v-model: string[] - 双向绑定的标签数组
  
  使用示例:
  基础用法:
  <ka-input-tag v-model="tags" />
  
  自定义配置:
  <ka-input-tag 
    v-model="tags" 
    :config="{
      buttonAttrs: { btnText: '添加标签', type: 'primary', size: 'small' },
      tagAttrs: { type: 'success', effect: 'dark' }
    }" 
  />
  
  AI生成指引: 这是一个标签输入组件，用于动态添加和删除标签。支持点击按钮添加新标签，回车确认输入，点击标签关闭按钮删除标签。可通过config属性自定义按钮、输入框和标签的样式。
-->

<template>
    <el-scrollbar>
        <div class="tag-container">
            <el-tag v-for="tag in tags" :key="tag" closable :disable-transitions="false" v-bind="config.tagAttrs"
                @close="handleClose(tag)">
                {{ tag }}
            </el-tag>
            <el-input v-if="inputVisible" ref="inputRef" v-model.trim="inputValue" style="min-width: 100px"
                @keyup.enter.stop.prevent="handleInputConfirm" @blur.stop.prevent="handleInputConfirm" />
            <el-button v-else v-bind="config.buttonAttrs" @click="showInput">
                {{ config.buttonAttrs.btnText ? config.buttonAttrs.btnText : "+ New Tag" }}
            </el-button>
        </div>
    </el-scrollbar>
</template>
<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { InputInstance } from "element-plus";

defineOptions({
    name: "KaInputTag",
});

const inputValue = ref("");
const inputVisible = ref(false);
const inputRef = ref<InputInstance>();

// 定义 model，用于与父组件的 v-model绑定
const tags = defineModel<string[]>();

defineProps({
    config: {
        type: Object as () => {
            buttonAttrs: Record<string, any>;
            inputAttrs: Record<string, any>;
            tagAttrs: Record<string, any>;
        },
        default: () => ({
            buttonAttrs: {},
            inputAttrs: {},
            tagAttrs: {},
        }),
    },
});

const handleClose = (tag: string) => {
    if (tags.value) {
        const newTags = tags.value.filter((t) => t !== tag);
        tags.value = [...newTags];
    }
};

const showInput = () => {
    inputVisible.value = true;
    nextTick(() => inputRef.value?.focus());
};

const handleInputConfirm = () => {
    if (inputValue.value) {
        const newTags = [...(tags.value || []), inputValue.value];
        tags.value = newTags;
    }
    inputVisible.value = false;
    inputValue.value = "";
};
</script>

<style lang="scss" scoped>
.tag-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap; // 不换行，让滚动条处理溢出
    min-height: 32px; // 确保最小高度与其他表单控件一致
    white-space: nowrap; // 防止内容换行
}
/* 
// 设置滚动条容器的样式
:deep(.el-scrollbar) {
    width: 100%;
    max-width: 300px; // 设置最大宽度，超出时显示滚动条
}

:deep(.el-scrollbar__view) {
    display: flex;
    align-items: center;
    min-width: max-content; // 确保内容不被压缩
}

:deep(.el-scrollbar__bar.is-horizontal) {
    height: 6px; // 设置水平滚动条高度
    bottom: 0;
}

:deep(.el-scrollbar__thumb) {
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 3px;
}

:deep(.el-scrollbar__thumb:hover) {
    background-color: rgba(144, 147, 153, 0.5);
} */
</style>
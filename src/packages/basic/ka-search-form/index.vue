<!--
  组件名称: KaSearchForm
  功能描述: 通用搜索表单组件，支持多种表单控件、展开收起、网格布局、自定义配置
  分类: 表单组件
  导入路径: @/packages/basic/ka-search-form/index.vue
  
  属性定义:
  - searchConfig: ISearchConfig - 搜索表单配置对象
    - formItems: IFormItem[] - 表单项配置数组
      - prop: string - 字段名
      - label: string - 标签文本
      - type: ISearchComponent - 组件类型 (input/select/cascader/date-picker等)
      - attrs: Record<string, any> - 组件属性
      - events: Record<string, Function> - 组件事件
      - options: Array - 选项数据(select类型使用)
      - tips: string | Object - 提示信息
      - initialValue: any - 初始值
      - initFn: Function - 初始化函数
    - form: IForm - 表单属性配置
    - cardAttrs: Record<string, any> - 卡片属性配置
    - isExpandable: boolean - 是否可展开收起，默认true
    - showNumber: number - 默认显示的表单项数量，默认3
    - grid: boolean | 'right' - 是否使用网格布局
    - colon: boolean - 标签是否显示冒号
  
  事件定义:
  - queryClick: (queryParams: IObject) => void - 搜索按钮点击事件
  - resetClick: (queryParams: IObject) => void - 重置按钮点击事件
  
  暴露方法:
  - getQueryParams: () => IObject - 获取查询参数
  - toggleVisible: () => void - 切换组件显示/隐藏
  
  使用示例:
  基础用法:
  <ka-search-form 
    :search-config="searchConfig" 
    @query-click="handleQuery"
    @reset-click="handleReset"
  />
  
  配置示例:
  const searchConfig = {
    formItems: [
      { prop: 'name', label: '姓名', type: 'input' },
      { prop: 'status', label: '状态', type: 'select', options: [...] },
      { prop: 'date', label: '日期', type: 'date-picker' }
    ],
    isExpandable: true,
    showNumber: 3,
    grid: true
  }
  
  AI生成指引: 这是一个通用的搜索表单组件，支持多种表单控件类型，具有展开收起功能，支持网格和内联布局。可配置表单项、样式、事件等，适用于各种列表页面的搜索功能。
-->

<template>
    <div v-show="visible">
        <el-card v-bind="cardAttrs">
            <el-form ref="queryFormRef" :model="queryParams" v-bind="formAttrs" :class="isGrid">
                <template v-for="(item, index) in formItems" :key="item.prop">
                    <el-form-item v-show="isExpand ? true : index < showNumber" :label="item?.label" :prop="item.prop">
                        <!-- Label -->
                        <template #label>
                            <span class="label-content">
                                {{ item?.label || "" }}
                                <el-tooltip v-if="item?.tips" v-bind="getTooltipProps(item.tips)">
                                    <QuestionFilled class="question-icon" />
                                </el-tooltip>
                                <span v-if="searchConfig.colon" class="colon">:</span>
                            </span>
                        </template>

                        <el-cascader v-if="item.type === 'cascader'" v-model.trim="queryParams[item.prop]"
                            v-bind="{ style: { width: '100%' }, ...item.attrs }" v-on="item.events || {}" />
                        <component :is="componentMap.get(item.type)" v-else v-model.trim="queryParams[item.prop]"
                            v-bind="{ style: { width: '100%' }, ...item.attrs }" v-on="item.events || {}">
                            <template v-if="item.type === 'select'">
                                <template v-for="opt in item.options" :key="opt.value">
                                    <el-option :label="opt.label" :value="opt.value" />
                                </template>
                            </template>
                        </component>
                    </el-form-item>
                </template>

                <el-form-item :class="{ 'button-group-right': searchConfig?.grid === 'right' }">
                    <el-button icon="search" type="primary" @click="handleQuery">搜索</el-button>
                    <el-button icon="refresh" @click="handleReset">重置</el-button>
                    <!-- 展开/收起 -->
                    <template v-if="isExpandable && formItems.length > showNumber">
                        <el-link class="expand-link" type="primary" underline="never" @click="isExpand = !isExpand">
                            {{ isExpand ? "收起" : "展开" }}
                            <component :is="isExpand ? ArrowUp : ArrowDown" class="expand-icon" />
                        </el-link>
                    </template>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, markRaw, onMounted } from "vue";
import type { IObject, IForm, ISearchConfig, ISearchComponent } from "./types.ts";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import {
    ElInput,
    ElSelect,
    ElCascader,
    ElInputNumber,
    ElDatePicker,
    ElTimePicker,
    ElTimeSelect,
    ElTreeSelect,
    ElInputTag,
} from "element-plus";
import InputTag from "../ka-input-tag/index.vue";

defineOptions({
    name: "KaSearchForm",
});
// 定义接收的属性
const props = defineProps<{ searchConfig: ISearchConfig }>();
// 自定义事件
const emit = defineEmits<{
    queryClick: [queryParams: IObject];
    resetClick: [queryParams: IObject];
}>();
// 组件映射表
const componentMap = new Map<ISearchComponent, any>([
    // @ts-ignore
    ["input", markRaw(ElInput)], // @ts-ignore
    ["select", markRaw(ElSelect)], // @ts-ignore
    ["cascader", markRaw(ElCascader)], // @ts-ignore
    ["input-number", markRaw(ElInputNumber)], // @ts-ignore
    ["date-picker", markRaw(ElDatePicker)], // @ts-ignore
    ["time-picker", markRaw(ElTimePicker)], // @ts-ignore
    ["time-select", markRaw(ElTimeSelect)], // @ts-ignore
    ["tree-select", markRaw(ElTreeSelect)], // @ts-ignore
    ["input-tag", markRaw(ElInputTag)], // @ts-ignore
    ["custom-tag", markRaw(InputTag)],
]);

// 存储表单实例
const queryFormRef = ref<FormInstance>();
// 存储查询参数
const queryParams = reactive<IObject>({});
// 是否显示
const visible = ref(true);
// 响应式的formItems
const formItems = reactive(props.searchConfig?.formItems ?? []);
// 是否可展开/收缩
const isExpandable = ref(props.searchConfig?.isExpandable ?? true);
// 是否已展开
const isExpand = ref(false);
// 表单项展示数量，若可展开，超出展示数量的表单项隐藏
const showNumber = computed(() =>
    isExpandable.value ? (props.searchConfig?.showNumber ?? 3) : formItems.length
);
// 卡片组件自定义属性（阴影、自定义边距样式等）
const cardAttrs = computed<IObject>(() => {
    return { shadow: "never", style: { "margin-bottom": "12px" }, ...props.searchConfig?.cardAttrs };
});
// 表单组件自定义属性（label位置、宽度、对齐方式等）
const formAttrs = computed<IForm>(() => {
    return { inline: true, ...props.searchConfig?.form };
});
// 是否使用自适应网格布局
const isGrid = computed(() =>
    props.searchConfig?.grid
        ? "form-grid"
        : "form-flex"
);

// 获取tooltip提示框属性
const getTooltipProps = (tips: string | IObject) => {
    return typeof tips === "string" ? { content: tips } : tips;
};
// 查询/重置操作
const handleQuery = () => emit("queryClick", queryParams);
const handleReset = () => {
    queryFormRef.value?.resetFields();
    emit("resetClick", queryParams);
};

onMounted(() => {
    formItems.forEach((item) => {
        if (item?.initFn) {
            item.initFn(item);
        }
        if (["input-tag", "custom-tag", "cascader"].includes(item?.type ?? "")) {
            queryParams[item.prop] = Array.isArray(item.initialValue) ? item.initialValue : [];
        } else if (item.type === "input-number") {
            queryParams[item.prop] = item.initialValue ?? null;
        } else {
            queryParams[item.prop] = item.initialValue ?? "";
        }
    });
});
// 暴露的属性和方法
defineExpose({
    // 获取分页数据
    getQueryParams: () => queryParams,
    // 显示/隐藏 SearchForm
    toggleVisible: () => (visible.value = !visible.value),
});
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
    text-align: left;
}

.el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    align-items: flex-start; // 让表单项顶部对齐
}

// 确保label始终在顶部对齐
:deep(.el-form-item__label) {
    line-height: 32px; // 与输入框高度一致
    padding-top: 0;
    margin-bottom: 0;
}

// 确保表单内容区域的对齐
:deep(.el-form-item__content) {
    line-height: normal;
}

// 标签内容样式
.label-content {
    display: flex;
    align-items: center;
}

.question-icon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    margin-right: 4px;
}

.colon {
    margin-left: 2px;
}

// 网格布局
.form-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    align-items: start; // 确保网格项顶部对齐

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1280px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: 1536px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @media (min-width: 1920px) {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media (min-width: 2560px) {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}

// 弹性布局
.form-flex {
    display: flex;
    flex-wrap: wrap;
    column-gap: 32px;
    row-gap: 16px;
    align-items: flex-start; // 确保所有表单项顶部对齐
}

// 按钮组右对齐
.button-group-right {
    grid-column: auto / -1;
    justify-self: end;
}

// 展开收起链接
.expand-link {
    margin-left: 12px;
}

.expand-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
}

// 表单控件宽度控制
// :deep(.el-select) {
//     width: 240px !important;
// }

// 标签输入组件宽度限制
:deep(.el-form-item__content) {

    // 在弹性布局中，为标签输入组件设置合适的宽度
    .form-flex & {
        min-width: 200px;
        max-width: 300px;
        flex: 0 1 auto; // 不允许无限增长
    }

    // 在网格布局中，确保不会溢出网格单元
    .form-grid & {
        max-width: 100%;
        overflow: hidden;
    }
}

// 确保标签输入组件的滚动条正常工作
:deep(.el-form-item__content .el-scrollbar) {
    width: 100%;
}
</style>
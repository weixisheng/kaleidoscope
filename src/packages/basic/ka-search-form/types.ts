import type { FormProps, CardProps } from "element-plus";
import type { CSSProperties } from "vue";

export type IObject = Record<string, any>;

// 搜索表单支持的组件类型
export type ISearchComponent =
    | "input"
    | "select"
    | "input-number"
    | "cascader"
    | "tree-select"
    | "date-picker"
    | "time-picker"
    | "time-select"
    | "input-tag"
    | "custom-tag";

// 表单项配置
export type IFormItems = Array<{
    // 组件类型
    type: ISearchComponent;
    // 标签提示
    tips?: string | IObject;
    // 标签文本
    label: string;
    // 键名
    prop: string;
    // 组件属性
    attrs?: IObject;
    // 组件可选项(适用于select组件)
    options?: Array<{ label: string; value: any;[key: string]: any }>;
    // 初始值
    initialValue?: any;
    // 组件事件
    events?: Record<string, (...args: any) => void>;
    // 初始化数据函数
    initFn?: (item: IObject) => void;
}>;

// 搜索表单配置
export interface ISearchConfig {
    // 标签冒号(默认：false)
    colon?: boolean;
    // 表单项(默认：[])
    formItems?: IFormItems;
    // 是否开启展开和收缩(默认：true)
    isExpandable?: boolean;
    // 默认展示的表单项数量(默认：3)
    showNumber?: number;
    // 卡片属性
    cardAttrs?: Partial<CardProps> & { style?: CSSProperties };
    // form组件属性
    form?: IForm;
    // 自适应网格布局
    grid?: boolean | "left" | "right";
}

// 表单属性类型
export type IForm = Partial<Omit<FormProps, "model" | "rules">>;

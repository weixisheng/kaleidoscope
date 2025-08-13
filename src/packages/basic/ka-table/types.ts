import type { PaginationProps, ButtonProps } from "element-plus";
import type { CSSProperties } from "vue";

export type IObject = Record<string, any>;

// 分页请求参数类型
export interface IPageRequest {
  pageName: string;
  limitName: string;
}

// 数据解析结果类型
export interface IParseDataResult {
  total: number;
  list: IObject[];
  [key: string]: any;
}

// 表格实例类型
export interface ITableInstance {
  fetchPageData: (queryParams?: IObject, isRestart?: boolean) => void;
  getSelectionData: () => IObject[];
  handleRefresh: (isRestart?: boolean) => void;
}

// 操作按钮类型
export type IOperateButton = {
  // 按钮唯一标识，用于事件回调
  name: string;
  // 按钮显示文本，支持函数动态生成
  text?: string | ((row: IObject) => string);
  // 按钮属性配置，继承 Element Plus Button 组件属性
  attrs?: Partial<ButtonProps> & { style?: CSSProperties };
  // 条件渲染函数，返回 false 时不显示该按钮
  render?: (row: IObject) => boolean;
  // 动态参数生成函数，用于传递额外参数到事件回调
  params?: (row: IObject) => Record<string, any>;
};

// 操作数据接口
export interface IOperateData {
  name: string;
  row: IObject;
  column: IObject;
  $index: number;
  params?: Record<string, any>; // 动态参数
}

// 表格配置接口
export interface ITableConfig<T = any> {
  // Element Plus Table 组件属性配置
  table?: Record<string, any>;
  // 分页组件位置，默认右对齐
  pagePosition?: "left" | "right";
  // 分页配置：false-不显示分页，object-分页属性配置
  pagination?:
    | boolean
    | Partial<
        Omit<
          PaginationProps,
          "v-model:page-size" | "v-model:current-page" | "total" | "currentPage"
        >
      >;
  // 数据请求函数，必须返回 Promise
  indexAction: (queryParams: T) => Promise<any>;
  // 分页请求参数配置，自定义分页参数名
  request?: IPageRequest;
  // 数据解析函数，用于处理接口返回的数据格式
  parseData?: (res: any) => IParseDataResult;
  // 数据主键字段名，默认为 'id'
  pk?: string;
  // table组件列属性
  cols: Array<{
    // 列类型
    type?: "default" | "selection" | "index" | "expand";
    // 列标题
    label?: string;
    // 列字段名
    prop?: string;
    // 列宽度
    width?: string | number;
    // 列内容对齐方式，默认居中
    align?: "left" | "center" | "right";
    // 列表头对齐方式，默认居中
    headerAlign?: "left" | "center" | "right";
    // 列的 key，用于优化渲染
    columnKey?: string;
    // 是否保留选中状态（selection类型使用）
    reserveSelection?: boolean;
    // 列是否显示
    show?: boolean;
    // 模板类型：text-文本 date-日期 price-价格 tool-操作 custom-自定义
    template?: "text" | "date" | 'price' | "tool" | "custom";
    // date模板相关参数：日期格式化字符串
    dateFormat?: string;
    // price模板相关参数
    priceFormat?: string;
    // tool模板相关参数：操作按钮配置
    operat?: Array<string | IOperateButton>;
    // 插槽名(适用于自定义模板)
    slotName?: string;
    // 其他 Element Plus 表格列属性
    [key: string]: any;
    // 初始化数据函数，在列配置时调用
    initFn?: (item: IObject) => void;
  }>;
}

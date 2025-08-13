<!--
  组件名称: KaTable
  功能描述: 通用表格组件，专注于数据展示和分页功能，支持列对齐、自定义模板、操作列等功能
  分类: 数据展示组件
  导入路径: @/packages/basic/ka-table/index.vue
  
  属性定义:
  - tableConfig: ITableConfig - 表格配置对象
    - table: TableProps - Element Plus 表格属性
    - pagination: boolean | PaginationProps - 分页配置
    - pagePosition: 'left' | 'right' - 分页位置，默认右对齐
    - indexAction: Function - 数据请求函数
    - parseData: Function - 数据解析函数
    - cols: Array - 表格列配置
      - align: 'left' | 'center' | 'right' - 列内容对齐方式，默认居中
      - headerAlign: 'left' | 'center' | 'right' - 列表头对齐方式，默认居中
      - template: 'text' | 'date' | 'tool' | 'custom' - 列模板类型
      - operat: Array - 操作列按钮配置（tool模板使用）
      - slotName: string - 自定义插槽名（custom模板使用）
    - pk: string - 主键字段名，默认'id'
  
  事件定义:
  - operateClick: (data: IOperateData) => void - 操作列按钮点击事件
  
  暴露方法:
  - fetchPageData: (queryParams?: IObject, isRestart?: boolean) => void - 获取分页数据
  - getSelectionData: () => IObject[] - 获取选中数据
  - handleRefresh: (isRestart?: boolean) => void - 刷新数据
  
  使用示例:
  基础用法:
  <ka-table 
    :table-config="tableConfig"
    @operate-click="handleOperate"
  >
    <template #status="{ row }">
      <el-tag :type="row.status ? 'success' : 'danger'">
        {{ row.status ? '正常' : '禁用' }}
      </el-tag>
    </template>
  </ka-table>
  
  配置示例:
  const tableConfig = {
    indexAction: fetchTableData,
    cols: [
      { prop: 'id', label: 'ID', width: 80 }, // 默认居中对齐
      { prop: 'name', label: '姓名', align: 'left' }, // 左对齐
      { prop: 'amount', label: '金额', align: 'right' }, // 右对齐
      { prop: 'status', label: '状态', template: 'custom', slotName: 'status' },
      { prop: 'createTime', label: '创建时间', template: 'date', dateFormat: 'YYYY-MM-DD' },
      { label: '操作', template: 'tool', operat: ['edit', 'delete'] }
    ]
  }
  
  对齐功能:
  - 所有列默认居中对齐，保证视觉统一
  - 通过 align 属性可覆盖内容对齐方式
  - 通过 headerAlign 属性可单独设置表头对齐方式
  - 支持 left、center、right 三种对齐方式
  
  样式特性:
  - 表头统一背景色 #f5f7fa，文字颜色 #333
  - 完全兼容固定列（左固定、右固定）的表头样式
  - 表头文字字重为 500，提升视觉层次
  
  AI生成指引: 这是一个功能完善的表格组件，专注于数据展示和分页功能。默认居中对齐保证视觉统一，统一的表头样式提升界面品质，完全兼容固定列场景。操作列使用下拉菜单展示，支持自定义模板和插槽。适用于各种数据展示场景，特别适合需要统一视觉风格的管理后台。
-->

<template>
    <div class="ka-table">
        <!-- 列表 -->
        <el-table ref="tableRef" v-loading="loading" v-bind="tableConfig.table" :data="pageData" :row-key="pk"
            class="table-content" @selection-change="handleSelectionChange">
            <template v-for="col in cols" :key="col.prop || col.type">
                <el-table-column v-if="col.show" v-bind="col">
                    <!-- 对于特殊类型的列（selection, index, expand），不需要自定义内容 -->
                    <template v-if="!['selection', 'index', 'expand'].includes(col.type || '')" #default="scope">
                        <!-- 格式化时间 -->
                        <template v-if="col.template === 'date'">
                            <template v-if="col.prop">
                                {{
                                    scope.row[col.prop]
                                        ? useDateFormat(scope.row[col.prop], col.dateFormat ?? "YYYY-MM-DD HH:mm:ss")
                                            .value
                                        : ""
                                }}
                            </template>
                        </template>
                        <!-- 格式化为价格 -->
                        <template v-else-if="col.template === 'price'">
                            <template v-if="col.prop">
                                {{ `${col.priceFormat ?? "￥"}${scope.row[col.prop]}` }}
                            </template>
                        </template>
                        <!-- 列操作栏 -->
                        <template v-else-if="col.template === 'tool'">
                            <el-dropdown @command="(command: string) => {
                                const cmdData = JSON.parse(command);
                                handleOperate({
                                    name: cmdData.name,
                                    row: scope.row,
                                    column: scope.column,
                                    $index: scope.$index,
                                    params: cmdData.params
                                });
                            }">
                                <el-button>
                                    操作
                                    <el-icon class="el-icon--right">
                                        <ArrowDown />
                                    </el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <template v-for="(btn, index) in getOperateButtons(col.operat || [])"
                                            :key="index">
                                            <el-dropdown-item v-if="btn.render === undefined || btn.render(scope.row)"
                                                :command="JSON.stringify({ name: btn.name, params: btn.params?.(scope.row) })">
                                                {{ typeof btn.text === 'function' ? btn.text(scope.row) : btn.text }}
                                            </el-dropdown-item>
                                        </template>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                        <!-- 自定义 -->
                        <template v-else-if="col.template === 'custom'">
                            <slot :name="col.slotName ?? col.prop" :prop="col.prop" v-bind="scope" />
                        </template>
                        <!-- 默认文本显示 -->
                        <template v-else>
                            <template v-if="col.prop">
                                {{ scope.row[col.prop] }}
                            </template>
                        </template>
                    </template>
                </el-table-column>
            </template>
        </el-table>

        <!-- 分页 -->
        <div v-if="showPagination" class="table-pagination">
            <el-pagination v-bind="pagination" :class="{ 'pagination-left': tableConfig?.pagePosition === 'left' }"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import { type TableInstance } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import type {
    ITableConfig,
    IObject,
    IOperateData,
    IOperateButton,
    IPageRequest,
} from "./types";

defineOptions({
    name: "KaTable",
});

// 定义接收的属性
const props = defineProps<{ tableConfig: ITableConfig }>();
// 定义自定义事件
const emit = defineEmits<{
    operateClick: [data: IOperateData];
}>();

// 主键
const pk = props.tableConfig.pk ?? "id";

// 默认操作按钮配置
const defaultOperateButtons: Record<string, IOperateButton> = {
    view: { name: "view", text: "查看" },
    edit: { name: "edit", text: "编辑" },
    delete: { name: "delete", text: "删除" },
};

// 获取操作按钮配置
function getOperateButtons(operat: Array<string | IOperateButton>) {
    return operat.map((item) => {
        if (typeof item === "string") {
            return defaultOperateButtons[item] || { name: item, text: item };
        }
        return item;
    });
}

// 表格列
const cols = ref(
    props.tableConfig.cols.map((col) => {
        if (col.initFn) {
            col.initFn(col);
        }
        if (col.show === undefined) {
            col.show = true;
        }
        if (col.prop !== undefined && col.columnKey === undefined) {
            col.columnKey = col.prop;
        }
        if (col.type === "selection" && col.reserveSelection === undefined) {
            col.reserveSelection = true;
        }
        // 设置默认居中对齐，支持传参覆盖
        if (col.align === undefined) {
            col.align = 'center';
        }
        if (col.headerAlign === undefined) {
            col.headerAlign = 'center';
        }
        return col;
    })
);

// 加载状态
const loading = ref(false);
// 列表数据
const pageData = ref<IObject[]>([]);
// 显示分页
const showPagination = props.tableConfig.pagination !== false;
// 分页配置
const defaultPagination = {
    background: true,
    layout: "total, sizes, prev, pager, next, jumper",
    pageSize: 10,
    pageSizes: [10, 20, 30, 50],
    total: 0,
    currentPage: 1,
};
const pagination = reactive(
    typeof props.tableConfig.pagination === "object"
        ? { ...defaultPagination, ...props.tableConfig.pagination }
        : defaultPagination
);
// 分页相关的请求参数
const request: IPageRequest = props.tableConfig.request ?? {
    pageName: "pageNum",
    limitName: "pageSize",
};

const tableRef = ref<TableInstance>();

// 行选中
const selectionData = ref<IObject[]>([]);
function handleSelectionChange(selection: any[]) {
    selectionData.value = selection;
}

// 获取行选中
function getSelectionData() {
    return selectionData.value;
}

// 刷新
function handleRefresh(isRestart = false) {
    fetchPageData(lastFormData, isRestart);
}

// 操作列
function handleOperate(data: IOperateData) {
    emit("operateClick", data);
}

// 分页切换
function handleSizeChange(value: number) {
    pagination.pageSize = value;
    handleRefresh();
}
function handleCurrentChange(value: number) {
    pagination.currentPage = value;
    handleRefresh();
}

// 获取分页数据
let lastFormData = {};
function fetchPageData(formData: IObject = {}, isRestart = false) {
    loading.value = true;
    lastFormData = formData;
    if (isRestart) {
        pagination.currentPage = 1;
    }
    props.tableConfig
        .indexAction(
            showPagination
                ? {
                    [request.pageName]: pagination.currentPage,
                    [request.limitName]: pagination.pageSize,
                    ...formData,
                }
                : formData
        )
        .then((data) => {
            if (showPagination) {
                if (props.tableConfig.parseData) {
                    data = props.tableConfig.parseData(data);
                }
                pagination.total = data.total;
                pageData.value = data.list;
            } else {
                pageData.value = data;
            }
        })
        .finally(() => {
            loading.value = false;
        });
}
fetchPageData();


// 暴露的属性和方法
defineExpose({ fetchPageData, getSelectionData, handleRefresh });
</script>

<style lang="scss" scoped>
.ka-table {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.table-content {
    flex: 1;
    min-height: 0;
}

.table-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end; // 默认右对齐

    .pagination-left {
        margin-right: auto; // 左对齐时推到左侧
    }
}

// 表头样式 - 兼容所有列类型（普通列、固定列）
:deep(.el-table) {
    // 使用通用选择器，确保覆盖所有表头单元格
    th.el-table__cell,
    .el-table__fixed th.el-table__cell,
    .el-table__fixed-right th.el-table__cell {
        background-color: #f5f7fa !important;
        color: #333 !important;

        .cell {
            color: #333 !important;
            font-weight: bold;
        }
    }
}
</style>
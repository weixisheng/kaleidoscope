<template>
    <div class="customer-detail-page">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <img src="@/static/LOGO.svg" alt="公司Logo" class="company-logo" />
                <h1 class="page-title">总后台客户详情</h1>
            </div>
            <div class="header-right">
                <el-button type="danger" icon="SwitchButton" @click="handleLogout">
                    退出登录
                </el-button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <ka-search-form :search-config="searchConfig" @query-click="handleQueryClick" @reset-click="handleResetClick" />

        <!-- 操作按钮区域 -->
        <ka-button-group :buttons="buttonConfig" add-text="新增标签" @button-click="handleButtonClick" />

        <!-- 表格区域 -->
        <ka-table ref="tableRef" :table-config="tableConfig" @operate-click="handleOperate">
            <!-- 标签名称自定义列 -->
            <template #tagName="{ row }">
                <el-link type="primary" @click="handleViewDetail(row)">
                    {{ row.tagName }}
                </el-link>
            </template>

            <!-- 关联客户数自定义列 -->
            <template #customerCount="{ row }">
                <el-link type="success" @click="handleViewCustomers(row)">
                    {{ row.customerCount }}人
                </el-link>
            </template>

            <!-- 状态自定义列 -->
            <template #status="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                    {{ row.status === 1 ? '正常' : '禁用' }}
                </el-tag>
            </template>
        </ka-table>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import KaSearchForm from '@/packages/basic/ka-search-form/index.vue'
import KaTable from '@/packages/basic/ka-table/index.vue'
import KaButtonGroup from '@/packages/basic/ka-button-group/index.vue'
import useTable from '@/packages/basic/ka-table/use-table'
import type { ISearchConfig } from '@/packages/basic/ka-search-form/types'
import type { ITableConfig, IOperateData } from '@/packages/basic/ka-table/types'
import type { IButtonConfig } from '@/packages/basic/ka-button-group/types'

// 使用table hooks
const { tableRef, handleQueryClick, handleResetClick, handleRefreshClick, getSelectionData } = useTable()

// 搜索表单配置
const searchConfig = reactive<ISearchConfig>({
    formItems: [
        {
            prop: 'tagName',
            label: '标签名称',
            type: 'input',
            attrs: {
                placeholder: '请输入标签名称',
                clearable: true
            }
        },
        {
            prop: 'creator',
            label: '创建人',
            type: 'input',
            attrs: {
                placeholder: '请输入创建人',
                clearable: true
            }
        },
        {
            prop: 'status',
            label: '状态',
            type: 'select',
            attrs: {
                placeholder: '请选择状态',
                clearable: true
            },
            options: [
                { label: '正常', value: 1 },
                { label: '禁用', value: 0 }
            ]
        },
        {
            prop: 'dateRange',
            label: '创建时间',
            type: 'date-picker',
            attrs: {
                type: 'daterange',
                'range-separator': '至',
                'start-placeholder': '开始日期',
                'end-placeholder': '结束日期',
                'value-format': 'YYYY-MM-DD'
            }
        }
    ],
    isExpandable: true,
    showNumber: 3
})

// 按钮配置
const buttonConfig = ref<IButtonConfig[]>([
    {
        name: 'batchDelete',
        text: '批量删除',
        icon: 'Delete',
        type: 'danger',
        attrs: { plain: true }
    },
    {
        name: 'refresh',
        text: '刷新',
        icon: 'Refresh',
        type: 'default'
    },
    {
        name: 'export',
        text: '导出',
        icon: 'Download',
        type: 'default'
    }
])

// 表格配置
const tableConfig = reactive<ITableConfig>({
    indexAction: fetchTableData,
    parseData: (res: any) => {
        return {
            list: res.data.list,
            total: res.data.total
        }
    },
    cols: [
        { type: 'selection', width: 55 },
        { type: 'index', label: '序号', width: 80 },
        {
            prop: 'tagName',
            label: '标签名称',
            template: 'custom',
            slotName: 'tagName',
            align: 'left'
        },
        {
            prop: 'description',
            label: '标签说明',
            align: 'left',
            'show-overflow-tooltip': true
        },
        {
            prop: 'customerCount',
            label: '关联客户数',
            template: 'custom',
            slotName: 'customerCount',
            width: 120
        },
        {
            prop: 'creator',
            label: '创建人',
            width: 100
        },
        {
            prop: 'createTime',
            label: '创建时间',
            template: 'date',
            width: 180
        },
        {
            prop: 'status',
            label: '状态',
            template: 'custom',
            slotName: 'status',
            width: 80
        },
        {
            label: '操作',
            template: 'tool',
            width: 120,
            operat: [
                { name: 'edit', text: '编辑' },
                { name: 'delete', text: '删除' }
            ]
        }
    ],
    table: {
        // border: true,
        stripe: true
    },
    pagination: {
        pageSizes: [10, 20, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
    }
})

// 模拟数据请求函数
async function fetchTableData(params: any = {}): Promise<any> {
    // 模拟API请求
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = {
                list: [
                    {
                        id: 1,
                        tagName: 'VIP客户',
                        description: '高价值客户群体，消费金额超过10万',
                        customerCount: 156,
                        creator: '张三',
                        createTime: '2024-01-15 10:30:00',
                        status: 1
                    },
                    {
                        id: 2,
                        tagName: '新用户',
                        description: '注册时间在30天内的新客户',
                        customerCount: 89,
                        creator: '李四',
                        createTime: '2024-01-20 14:20:00',
                        status: 1
                    },
                    {
                        id: 3,
                        tagName: '流失客户',
                        description: '超过90天未消费的客户',
                        customerCount: 234,
                        creator: '王五',
                        createTime: '2024-01-10 09:15:00',
                        status: 0
                    }
                ],
                total: 3
            }
            resolve({
                code: 200,
                data: mockData,
                message: 'success'
            })
        }, 500)
    })
}

// 按钮点击处理
function handleButtonClick(name: string) {
    switch (name) {
        case 'add':
            handleAddTag()
            break
        case 'batchDelete':
            handleBatchDelete()
            break
        case 'refresh':
            handleRefreshClick()
            break
        case 'export':
            handleExport()
            break
    }
}

// 新增标签
function handleAddTag() {
    ElMessage.info('打开新增标签弹窗')
}

// 批量删除
function handleBatchDelete() {
    const selections = getSelectionData()
    if (selections.length === 0) {
        ElMessage.warning('请先选择要删除的数据')
        return
    }

    ElMessageBox.confirm(
        `确定要删除选中的 ${selections.length} 条数据吗？`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        ElMessage.success('删除成功')
        handleRefreshClick()
    })
}

// 导出
function handleExport() {
    ElMessage.info('开始导出数据...')
}

// 操作列点击处理
function handleOperate(data: IOperateData) {
    const { name, row } = data
    switch (name) {
        case 'edit':
            handleEdit(row)
            break
        case 'delete':
            handleDelete(row)
            break
    }
}

// 编辑
function handleEdit(row: Record<string, any>) {
    ElMessage.info(`编辑标签: ${row.tagName}`)
}

// 删除
function handleDelete(row: Record<string, any>) {
    ElMessageBox.confirm(
        `确定要删除标签"${row.tagName}"吗？`,
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        ElMessage.success('删除成功')
        handleRefreshClick()
    })
}

// 查看标签详情
function handleViewDetail(row: Record<string, any>) {
    ElMessage.info(`查看标签详情: ${row.tagName}`)
}

// 查看关联客户
function handleViewCustomers(row: Record<string, any>) {
    ElMessage.info(`查看关联客户列表: ${row.tagName}`)
}

// 退出登录
function handleLogout() {
    ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success('已退出登录')
        // 这里可以添加实际的登出逻辑
    })
}

// 页面初始化
onMounted(() => {
    // 组件会自动调用fetchTableData获取数据
})
</script>

<style scoped>
.customer-detail-page {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 16px 24px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.company-logo {
    height: 40px;
    width: auto;
}

.page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
}

.header-right {
    display: flex;
    align-items: center;
}
</style>
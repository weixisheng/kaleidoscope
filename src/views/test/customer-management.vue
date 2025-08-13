<template>
    <div class="customer-management">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="logo">
                <img src="@/static/logo.svg" alt="公司Logo" class="logo-img" />
            </div>
            <div class="header-actions">
                <el-button type="danger" @click="handleLogout">退出登录</el-button>
            </div>
        </div>

        <!-- 搜索表单 -->
        <ka-search-form :search-config="searchConfig" @query-click="handleQueryClick" @reset-click="handleResetClick" />

        <!-- 操作按钮组 -->
        <ka-button-group :buttons="buttonConfig" add-text="新增标签" add-icon="Plus" @button-click="handleButtonClick" />

        <!-- 数据表格 -->
        <ka-table ref="tableRef" :table-config="tableConfig" @operate-click="handleOperateClick">
            <!-- 标签名称插槽 -->
            <template #tagName="{ row }">
                <el-link type="primary" @click="handleTagDetail(row)">
                    {{ row.tagName }}
                </el-link>
            </template>

            <!-- 关联客户数插槽 -->
            <template #customerCount="{ row }">
                <el-link type="success" @click="handleCustomerList(row)">
                    {{ row.customerCount }}
                </el-link>
            </template>
        </ka-table>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import KaSearchForm from '@/packages/basic/ka-search-form/index.vue'
import KaTable from '@/packages/basic/ka-table/index.vue'
import KaButtonGroup from '@/packages/basic/ka-button-group/index.vue'
import useTable from '@/packages/basic/ka-table/use-table'
import type { ISearchConfig } from '@/packages/basic/ka-search-form/types'
import type { ITableConfig, IOperateData } from '@/packages/basic/ka-table/types'
import type { IButtonConfig } from '@/packages/basic/ka-button-group/types'

// 使用表格组合式函数
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
        }
    ],
    isExpandable: false,
    showNumber: 1,
    grid: false
})

// 按钮配置
const buttonConfig = ref<IButtonConfig[]>([
    {
        name: 'batchDelete',
        text: '批量删除',
        icon: 'Delete',
        type: 'danger',
        show: true
    },
    {
        name: 'refresh',
        text: '刷新',
        icon: 'Refresh',
        type: 'default',
        show: true
    }
])

// 表格配置
const tableConfig = reactive<ITableConfig>({
    indexAction: fetchCustomerData,
    table: {
        // border: true,
        stripe: true,
        'header-cell-style': { textAlign: 'center' },
        'cell-style': { textAlign: 'center' }
    },
    pagination: {
        pageSizes: [10, 20, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
    },
    cols: [
        { type: 'selection', width: 55 },
        { prop: 'tagName', label: '标签名称', template: 'custom', slotName: 'tagName', minWidth: 120 },
        { prop: 'tagDescription', label: '标签说明', minWidth: 200 },
        { prop: 'customerCount', label: '关联客户数', template: 'custom', slotName: 'customerCount', width: 120 },
        { prop: 'creator', label: '创建人', width: 100 },
        { prop: 'createTime', label: '创建时间', template: 'date', width: 160 },
        {
            label: '操作',
            template: 'tool',
            width: 120,
            fixed: 'right',
            operat: [
                {
                    name: 'edit',
                    text: '编辑'
                },
                {
                    name: 'delete',
                    text: '删除'
                }
            ]
        }
    ]
})

// 模拟数据请求函数
async function fetchCustomerData(params: any): Promise<any> {
    // 模拟API请求
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = {
                total: 100,
                list: Array.from({ length: params.pageSize || 10 }, (_, index) => ({
                    id: (params.pageNum - 1) * params.pageSize + index + 1,
                    tagName: `客户标签${(params.pageNum - 1) * params.pageSize + index + 1}`,
                    tagDescription: `这是客户标签${(params.pageNum - 1) * params.pageSize + index + 1}的详细说明`,
                    customerCount: Math.floor(Math.random() * 100) + 1,
                    creator: `用户${index + 1}`,
                    createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString()
                }))
            }
            resolve(mockData)
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
    }
}

// 新增标签
function handleAddTag() {
    ElMessage.info('打开新增标签弹窗')
    // TODO: 实现新增标签功能
}

// 批量删除
function handleBatchDelete() {
    const selectedData = getSelectionData()
    if (selectedData.length === 0) {
        ElMessage.warning('请先选择要删除的数据')
        return
    }

    ElMessageBox.confirm(
        `确定要删除选中的 ${selectedData.length} 条数据吗？`,
        '批量删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // TODO: 实现批量删除逻辑
        ElMessage.success('删除成功')
        handleRefreshClick()
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 标签详情
function handleTagDetail(row: Record<string, any>) {
    ElMessage.info(`查看标签详情: ${row.tagName}`)
    // TODO: 跳转到标签详情页面
}

// 客户列表
function handleCustomerList(row: Record<string, any>) {
    ElMessage.info(`查看关联客户列表: ${row.tagName}`)
    // TODO: 跳转到客户列表页面
}

// 表格操作列点击
function handleOperateClick(data: IOperateData) {
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
    // TODO: 实现编辑功能
}

// 删除
function handleDelete(row: Record<string, any>) {
    ElMessageBox.confirm(
        `确定要删除标签 "${row.tagName}" 吗？`,
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // TODO: 实现删除逻辑
        ElMessage.success('删除成功')
        handleRefreshClick()
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}



// 退出登录
function handleLogout() {
    ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // TODO: 实现退出登录逻辑
        ElMessage.success('已退出登录')
    })
}
</script>

<style scoped>
.customer-management {
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

.logo-img {
    height: 40px;
    width: auto;
}

.header-actions {
    display: flex;
    align-items: center;
}
</style>
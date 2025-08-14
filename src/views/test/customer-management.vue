<template>
    <div class="customer-management">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <img src="@/static/LOGO.svg" alt="公司Logo" class="logo" />
            </div>
            <div class="header-right">
                <el-dropdown @command="handleCommand">
                    <span class="user-info">
                        <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        <span class="username">管理员</span>
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="settings">个人设置</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <!-- 搜索表单 -->
        <ka-search-form :search-config="searchConfig" @query-click="handleQueryClick" @reset-click="handleResetClick" />

        <!-- 操作按钮组 -->
        <ka-button-group :buttons="buttonConfig" add-text="新增标签" add-icon="Plus" @button-click="handleButtonClick" />

        <!-- 数据表格 -->
        <ka-table ref="tableRef" :table-config="tableConfig" @operate-click="handleOperateClick">
            <!-- 标签名称插槽 - 纯展示tag -->
            <template #tagName="{ row }">
                <el-tag type="primary">{{ row.tagName }}</el-tag>
            </template>

            <!-- 关联客户数插槽 - 可点击 -->
            <template #customerCount="{ row }">
                <el-button 
                    type="primary" 
                    link 
                    @click="handleViewCustomers(row)"
                >
                    {{ row.customerCount }}
                </el-button>
            </template>
        </ka-table>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
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
    pagination: {
        pageSizes: [10, 20, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
    },
    cols: [
        { type: 'selection', width: 55 },
        { prop: 'tagName', label: '标签名称', template: 'custom', slotName: 'tagName', width: 150 },
        { prop: 'description', label: '标签说明', template: 'text', align: 'left' },
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
    console.log('请求参数:', params)
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = [
        {
            id: 1,
            tagName: 'VIP客户',
            description: '高价值客户，享受专属服务',
            customerCount: 156,
            creator: '张三',
            createTime: '2024-01-15 10:30:00'
        },
        {
            id: 2,
            tagName: '新客户',
            description: '近期注册的新用户',
            customerCount: 89,
            creator: '李四',
            createTime: '2024-01-14 14:20:00'
        },
        {
            id: 3,
            tagName: '活跃用户',
            description: '近30天内有活跃行为的用户',
            customerCount: 234,
            creator: '王五',
            createTime: '2024-01-13 09:15:00'
        },
        {
            id: 4,
            tagName: '潜在客户',
            description: '有购买意向但未下单的客户',
            customerCount: 67,
            creator: '赵六',
            createTime: '2024-01-12 16:45:00'
        },
        {
            id: 5,
            tagName: '流失客户',
            description: '超过90天未活跃的客户',
            customerCount: 45,
            creator: '孙七',
            createTime: '2024-01-11 11:30:00'
        }
    ]
    
    // 模拟搜索过滤
    let filteredData = mockData
    if (params.tagName) {
        filteredData = mockData.filter(item => 
            item.tagName.includes(params.tagName)
        )
    }
    
    // 模拟分页
    const pageSize = params.pageSize || 10
    const currentPage = params.currentPage || 1
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const pageData = filteredData.slice(start, end)
    
    return {
        total: filteredData.length,
        list: pageData
    }
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

// 查看关联客户
function handleViewCustomers(row: any) {
    ElMessage.info(`查看标签"${row.tagName}"的关联客户列表`)
    // 这里可以跳转到客户列表页面或打开弹窗
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



// 头部下拉菜单处理
function handleCommand(command: string) {
    switch (command) {
        case 'settings':
            ElMessage.info('个人设置功能待实现')
            break
        case 'logout':
            handleLogout()
            break
    }
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
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left .logo {
    height: 40px;
    width: auto;
}

.header-right .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.3s;
}

.header-right .user-info:hover {
    background-color: #f5f5f5;
}

.username {
    margin-left: 8px;
    margin-right: 4px;
    font-size: 14px;
    color: #333;
}
</style>
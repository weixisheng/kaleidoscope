# 添加新菜单示例

## 场景：添加"报表管理"模块

假设我们要添加一个新的"报表管理"模块，包含"销售报表"和"财务报表"两个子功能。

### 1. 在路由配置中添加新路由

编辑 `src/router/index.ts`，在 `layoutRoutes[0].children` 数组中添加：

```typescript
// 报表管理
{
  path: '/report',
  name: 'Report',
  component: () => import('@/views/report/index.vue'),
  redirect: '/report/sales',
  meta: {
    title: '报表管理',
    icon: 'DataAnalysis',
    menuKey: 'report_manage',
    order: 6  // 排在最后
  },
  children: [
    {
      path: '/report/sales',
      name: 'ReportSales',
      component: () => import('@/views/report/sales.vue'),
      meta: {
        title: '销售报表',
        order: 1
      }
    },
    {
      path: '/report/finance',
      name: 'ReportFinance',
      component: () => import('@/views/report/finance.vue'),
      meta: {
        title: '财务报表',
        order: 2
      }
    }
  ]
}
```

### 2. 选择页面组件方式

#### 使用 Mock 页面（推荐）

对于开发阶段，可以直接使用 Mock 页面：

```typescript
{
  path: '/report/sales',
  name: 'ReportSales',
  component: () => import('@/views/mock/index.vue'),  // 使用 Mock 页面
  meta: {
    title: '销售报表',
    order: 1
  }
}
```

Mock 页面会自动显示路由标题和开发状态，无需创建具体的页面组件。

#### 创建具体页面（生产环境）

如果需要实现具体功能，再创建对应的页面组件：

```vue
<!-- src/views/report/sales.vue -->
<template>
  <div class="page-container">
    <div class="page-header">
      <h2>销售报表</h2>
      <p>查看销售数据统计</p>
    </div>
    
    <div class="page-content">
      <el-card>
        <!-- 具体的报表内容 -->
        <p>销售报表功能实现...</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 销售报表页面逻辑
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
// 其他样式...
</style>
```

### 3. 结果

完成以上步骤后：

1. **菜单会自动显示**：在左侧一级菜单中会出现"报表管理"选项
2. **子菜单自动生成**：点击"报表管理"后，中间会显示"销售报表"和"财务报表"子菜单
3. **路由正常工作**：点击子菜单可以正常跳转到对应页面
4. **面包屑自动更新**：顶部会显示当前页面标题

### 4. 无需修改的文件

- ✅ `src/layouts/DefaultLayoutRefactored.vue` - 布局组件无需修改
- ✅ `src/utils/routerMenuUtils.ts` - 工具函数无需修改
- ✅ 任何菜单配置文件 - 因为已经移除了硬编码配置
- ✅ 开发阶段无需创建页面组件 - 直接使用 Mock 页面即可

### 5. 高级用法

#### 隐藏菜单项
```typescript
meta: {
  title: '内部页面',
  hidden: true  // 不在菜单中显示
}
```

#### 自定义菜单标识
```typescript
meta: {
  title: '特殊模块',
  menuKey: 'special_module_key'  // 自定义菜单key
}
```

#### 菜单排序
```typescript
meta: {
  title: '重要模块',
  order: 1  // 数字越小越靠前
}
```

这样，整个菜单系统就完全基于路由配置了，新增功能只需要添加路由和对应的页面组件即可。
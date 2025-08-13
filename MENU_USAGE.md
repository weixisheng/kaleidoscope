# 基于路由的菜单系统使用说明

## 概述

重构后的布局组件 `DefaultLayoutRefactored.vue` 现在完全基于路由配置自动生成菜单，无需手动维护菜单数据。

## 当前页面结构

- **Dashboard**: `src/views/dashboard/index.vue` - 工作台页面
- **Preview**: `src/views/preview/index.vue` - 预览页面（隐藏菜单）
- **Mock页面**: `src/views/mock/index.vue` - 通用占位页面，显示路由标题和开发状态

除了 Dashboard 和 Preview 之外的所有路由都指向 Mock 页面，Mock 页面会自动显示当前路由的标题和相关信息。

## 菜单生成规则

### 一级菜单

- 顶层路由（`/` 路由的直接子路由）自动成为一级菜单
- 通过路由的 `meta.order` 控制菜单顺序
- 通过路由的 `meta.icon` 设置菜单图标
- 通过路由的 `meta.hidden` 隐藏菜单项

### 二级菜单

- 如果一级菜单路由有子路由，子路由自动成为二级菜单
- 多个子路由会创建菜单组
- 单个子路由直接作为菜单项

## 路由配置示例

```typescript
{
  path: '/customer',
  name: 'Customer',
  component: () => import('@/views/customer/index.vue'),
  redirect: '/customer/list',
  meta: {
    title: '客户管理',        // 菜单标题
    icon: 'User',           // 菜单图标
    menuKey: 'customer_manage', // 菜单唯一标识
    order: 2,               // 菜单排序
    hidden: false           // 是否隐藏（可选）
  },
  children: [
    {
      path: '/customer/list',
      name: 'CustomerList',
      component: () => import('@/views/customer/list.vue'),
      meta: {
        title: '客户列表',
        order: 1
      }
    },
    {
      path: '/customer/level',
      name: 'CustomerLevel',
      component: () => import('@/views/customer/level.vue'),
      meta: {
        title: '客户等级',
        order: 2
      }
    }
  ]
}
```

## 新增菜单步骤

1. **在路由配置中添加新路由**

   ```typescript
   // 在 src/router/index.ts 中添加
   {
     path: '/new-module',
     name: 'NewModule',
     component: () => import('@/views/new-module/index.vue'),
     meta: {
       title: '新模块',
       icon: 'Setting',
       order: 6
     },
     children: [
       {
         path: '/new-module/feature1',
         name: 'Feature1',
         component: () => import('@/views/new-module/feature1.vue'),
         meta: {
           title: '功能1',
           order: 1
         }
       }
     ]
   }
   ```

2. **创建对应的 Vue 组件**

   - 创建 `src/views/new-module/index.vue`（模块容器）
   - 创建 `src/views/new-module/feature1.vue`（具体页面）

3. **菜单会自动显示**
   - 无需修改布局组件
   - 菜单会根据路由配置自动生成和排序

## Meta 字段说明

| 字段    | 类型    | 必填 | 说明                            |
| ------- | ------- | ---- | ------------------------------- |
| title   | string  | 是   | 菜单显示名称                    |
| icon    | string  | 否   | 菜单图标（Element Plus 图标名） |
| order   | number  | 否   | 菜单排序，数字越小越靠前        |
| menuKey | string  | 否   | 菜单唯一标识，默认使用路由名称  |
| hidden  | boolean | 否   | 是否隐藏菜单，默认 false        |

## 优势

1. **自动化**：新增路由自动生成菜单，无需手动维护
2. **一致性**：菜单结构与路由结构保持一致
3. **可维护性**：只需维护路由配置，菜单自动同步
4. **灵活性**：通过 meta 字段灵活控制菜单行为

## 注意事项

1. 确保路由的 `meta.title` 字段存在，否则显示为"未命名"
2. 隐藏的路由（`meta.hidden: true`）不会在菜单中显示
3. 菜单排序基于 `meta.order` 字段，未设置时默认为 0
4. 一级菜单需要设置图标，建议使用 Element Plus 图标

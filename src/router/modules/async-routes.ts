
import type { RouteRecordRaw } from 'vue-router'
// 主布局路由 - 包含所有业务页面
const asyncRoutes: RouteRecordRaw[] = [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayoutRefactored.vue'),
      redirect: '/dashboard',
      children: [
        // 工作台
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: {
            title: '工作台',
            icon: 'Monitor',
            menuKey: 'dashboard',
            order: 1,
          },
        },
  
        // 客户管理
        {
          path: '/customer',
          name: 'Customer',
          component: () => import('@/views/mock/index.vue'),
          redirect: '/customer/list',
          meta: {
            title: '客户管理',
            icon: 'User',
            menuKey: 'customer_manage',
            order: 2,
          },
          children: [
            {
              path: '/customer/list',
              name: 'CustomerList',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '客户列表',
                order: 1,
              },
            },
            {
              path: '/customer/level',
              name: 'CustomerLevel',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '客户等级',
                order: 2,
              },
            },
            {
              path: '/customer/tag',
              name: 'CustomerTag',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '标签管理',
                order: 3,
              },
            },
          ],
        },
  
        // 产品管理
        {
          path: '/product',
          name: 'Product',
          component: () => import('@/views/mock/index.vue'),
          redirect: '/product/list',
          meta: {
            title: '产品管理',
            icon: 'Goods',
            menuKey: 'product_manage',
            order: 3,
          },
          children: [
            {
              path: '/product/list',
              name: 'ProductList',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '产品列表',
                order: 1,
              },
            },
            {
              path: '/product/recycle',
              name: 'ProductRecycle',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '回收站',
                order: 2,
              },
            },
          ],
        },
  
        // 系统管理
        {
          path: '/system',
          name: 'System',
          component: () => import('@/views/mock/index.vue'),
          redirect: '/system/organization',
          meta: {
            title: '系统管理',
            icon: 'Setting',
            menuKey: 'system_manage',
            order: 4,
          },
          children: [
            {
              path: '/system/organization',
              name: 'SystemOrganization',
              component: () => import('@/views/mock/index.vue'),
              meta: {
                title: '组织架构',
                order: 1,
              },
            },
          ],
        }
      ],
    },
  ]

  export default asyncRoutes
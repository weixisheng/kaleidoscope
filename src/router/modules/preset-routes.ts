export default [
  {
    path: '/',
    name: 'Test',
    redirect: '/test/customer-detail',
    meta: {
      title: '测试页面',
      icon: 'TestTube',
    },
    children: [
      {
        path: '/test/customer-detail',
        name: 'CustomerDetail',
        component: () => import('@/views/test/customer-detail.vue'),
        meta: {
          title: '总后台客户详情',
          icon: 'User',
        },
      },
      {
        path: '/test/customer-management',
        name: 'CustomerManagement',
        component: () => import('@/views/test/customer-management.vue'),
        meta: {
          title: '总后台客户管理列表',
          icon: 'List',
        },
      },
    ],
  },
]

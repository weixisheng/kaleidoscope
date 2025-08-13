export default [
  {
    path: '/',
    redirect: '/test/customer-detail'
  },
  {
    path: '/test/customer-detail',
    name: 'CustomerDetail',
    component: () => import('@/views/test/customer-detail.vue'),
    meta: {
      title: '总后台客户详情',
      icon: 'User'
    }
  },
  {
    path: '/test/customer-management',
    name: 'CustomerManagement',
    component: () => import('@/views/test/customer-management.vue'),
    meta: {
      title: '总后台客户管理列表',
      icon: 'List'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/test/customer-detail'
  }
]

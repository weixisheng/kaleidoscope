export default [
  {
    path: '/',
    redirect: '/test/customer-management'
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
    redirect: '/test/customer-management'
  }
]

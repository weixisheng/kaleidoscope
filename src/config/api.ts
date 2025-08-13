/**
 * API配置文件
 * 统一管理所有后端接口的基础配置
 * 
 * @author 米多团队
 */

// API基础配置
export const API_CONFIG = {
  // 后端服务基础URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9186',
  
  // 超时时间（毫秒）- 1分钟
  TIMEOUT: 60000,
  
  // API版本
  VERSION: 'v1',
  
  // 请求头配置
  HEADERS: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

// 调试环境变量
console.log('环境变量 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('最终API基础地址:', API_CONFIG.BASE_URL)

// API端点路径
export const API_ENDPOINTS = {
  // 客户管理
  CUSTOMER: {
    LIST: '/api/customer/page',
    DETAIL: '/api/customer/detail',
    CREATE: '/api/customer/create',
    UPDATE: '/api/customer/update',
    DELETE: '/api/customer/delete',
    SET_LEVEL: '/api/customer/level',
    SET_TAGS: '/api/customer/tags',
    CHECK_CODE: '/api/customer/check/code',
    CHECK_ACCOUNT: '/api/customer/check/account',
    CHECK_PHONE: '/api/customer/check/phone'
  },
  
  // 客户等级管理
  CUSTOMER_LEVEL: {
    LIST: '/api/customer/level/page',
    ALL: '/api/customer/level/list',
    DETAIL: '/api/customer/level/detail',
    CREATE: '/api/customer/level/create',
    UPDATE: '/api/customer/level/update',
    DELETE: '/api/customer/level/delete',
    BATCH_DELETE: '/api/customer/level/delete/batch',
    CHECK_NAME: '/api/customer/level/check/name'
  },
  
  // 客户标签管理
  CUSTOMER_TAG: {
    LIST: '/api/customer/tag/page',
    ALL: '/api/customer/tag/list',
    DETAIL: '/api/customer/tag/detail',
    CREATE: '/api/customer/tag/create',
    UPDATE: '/api/customer/tag/update',
    DELETE: '/api/customer/tag/delete',
    BATCH_DELETE: '/api/customer/tag/delete/batch',
    CHECK_NAME: '/api/customer/tag/check/name',
    CUSTOMER_TAGS: '/api/customer/tag/customer',
    SET_CUSTOMER_TAGS: '/api/customer/tag/customer/{customerId}/set'
  },
  
  // 产品管理
  PRODUCT: {
    LIST: '/api/v1/products/page',
    DETAIL: '/api/v1/products/detail',
    CREATE: '/api/v1/products/create',
    UPDATE: '/api/v1/products/update',
    DELETE: '/api/v1/products/delete',
    BATCH_DELETE: '/api/v1/products/delete/batch',
    DISABLE: '/api/v1/products/{id}/disable',
    RESTORE: '/api/v1/products/{id}/restore',
    BATCH_DISABLE: '/api/v1/products/batch-disable',
    BATCH_RESTORE: '/api/v1/products/batch-restore',
    CHECK_CODE: '/api/v1/products/check-code',
    CHECK_NAME: '/api/v1/products/check-name',
    COUNT: '/api/v1/products/count'
  },
  
  // 产品回收站
  RECYCLE: {
    LIST: '/api/v1/products/recycle/page',
    RESTORE: '/api/v1/products/recycle/restore',
    DELETE: '/api/v1/products/recycle/delete',
    BATCH_RESTORE: '/api/v1/products/recycle/restore/batch',
    BATCH_DELETE: '/api/v1/products/recycle/delete/batch',
    CHECK_RESTORE: '/api/v1/products/recycle/check-restore'
  },
  
  // 组织架构
  ORGANIZATION: {
    DEPARTMENT_TREE: '/api/v1/departments/tree',
    DEPARTMENT_DETAIL: '/api/v1/departments/detail',
    DEPARTMENT_SEARCH: '/api/v1/departments/search',
    EMPLOYEE_LIST: '/api/v1/employees/page',
    EMPLOYEE_BY_DEPT: '/api/v1/employees/list/dept',
    EMPLOYEE_SEARCH: '/api/v1/employees/search',
    EMPLOYEE_DETAIL: '/api/v1/employees/detail',
    SYNC_MANUAL: '/api/v1/sync/manual',
    SYNC_STATUS: '/api/v1/sync/status'
  },

  // 通用数据
  COMMON: {
    REGIONS: '/api/common/regions',
    INDUSTRIES: '/api/common/industries',
    AGENTS: '/api/common/agents'
  },

  // 认证相关
  AUTH: {
    QRCODE: '/api/auth/qrcode',
    CALLBACK: '/api/auth/callback',
    CHECK_STATUS: '/api/auth/status',
    LOGOUT: '/api/auth/logout',
    USERINFO: '/api/auth/userinfo',
    SMS_SEND: '/api/auth/sms/send',
    SMS_LOGIN: '/api/auth/sms/login',
    SSO_LOGIN: '/api/auth/sso/login',
    SSO_SYSTEMS: '/api/auth/sso/systems'
  }
}

// 完整的API地址构建函数
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// 根据环境获取API配置
export const getApiConfig = () => {
  const isDev = import.meta.env.DEV
  const config = { ...API_CONFIG }
  
  // 开发环境可以使用不同的配置
  if (isDev) {
    console.log('当前API基础地址:', config.BASE_URL)
  }
  
  return config
}
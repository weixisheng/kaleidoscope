// 菜单树响应类型
export interface MenuTreeResponse {
  id: number
  parentId: number
  menuName: string
  menuCode: string
  menuType: number
  routerPath: string
  componentPath: string
  permissionCode?: string
  menuIcon: string
  sortOrder: number
  isVisible: number
  isExternal: number
  externalUrl?: string
  remark?: string
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  children?: MenuTreeResponse[]
}

// 前端菜单项接口定义
export interface PrimaryMenuItem {
  key: string
  title: string
  icon: string
}

export interface SecondaryMenuItem {
  path: string
  title: string
  children?: SecondaryMenuItem[]
}

/**
 * 菜单编码到键的映射
 */
function getMenuKey(menuCode: string): string {
  const keyMap: Record<string, string> = {
    'HOME': 'dashboard',
    'DASHBOARD': 'dashboard',
    'PRODUCT_MANAGE': 'product_manage',
    'PRODUCT': 'product_manage',
    'CRM': 'customer_manage',
    'CUSTOMER': 'customer_manage',
    'CUSTOMER_MANAGE': 'customer_manage',
    'SYSTEM_ARCH': 'system_manage',
    'SYSTEM': 'system_manage',
    'SYSTEM_MANAGE': 'system_manage',
    'SSO': 'sso_manage',
    'SSO_MANAGE': 'sso_manage'
  }
  return keyMap[menuCode] || menuCode.toLowerCase().replace(/_/g, '_')
}

// Element Plus图标映射
const iconMap: Record<string, string> = {
  // 基础图标
  'Monitor': 'Monitor',
  'User': 'User', 
  'Goods': 'Goods',
  'Setting': 'Setting',
  'Connection': 'Connection',
  'Star': 'Star',
  'CollectionTag': 'CollectionTag',
  'Delete': 'Delete',
  'OfficeBuilding': 'OfficeBuilding',
  'List': 'List',
  'Tools': 'Tools',
  'Menu': 'Menu',
  'House': 'House',
  'DataBoard': 'DataBoard',
  'Management': 'Management',
  'Operation': 'Operation',
  
  // 兼容老的图标格式
  'el-icon-monitor': 'Monitor',
  'el-icon-user': 'User',
  'el-icon-goods': 'Goods',
  'el-icon-setting': 'Setting',
  'el-icon-s-operation': 'Setting',
  'el-icon-s-home': 'Monitor',
  'el-icon-menu': 'Menu',
  'el-icon-house': 'House',
  'el-icon-data-board': 'DataBoard',
  'el-icon-management': 'Management',
  'el-icon-operation': 'Operation',
  
  // 中文图标名称兼容
  '首页': 'Monitor',
  '工作台': 'Monitor',
  '产品管理': 'Goods',
  '客户管理': 'User',
  '系统管理': 'Setting',
  '统一认证': 'Connection'
}

/**
 * 将后端菜单树转换为一级菜单
 */
export function convertToPrimaryMenus(menuTree: MenuTreeResponse[]): PrimaryMenuItem[] {
  console.log('开始转换一级菜单，原始数据：', menuTree)
  
  const primaryMenus = menuTree
    .filter(menu => menu.parentId === 0 && menu.isVisible === 1)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(menu => {
      const menuItem = {
        key: getMenuKey(menu.menuCode),
        title: menu.menuName,
        icon: iconMap[menu.menuIcon] || 'Menu'
      }
      console.log('转换菜单项：', {
        原始: menu,
        转换后: menuItem
      })
      return menuItem
    })
  
  console.log('一级菜单转换完成：', primaryMenus)
  return primaryMenus
}

/**
 * 将后端菜单树转换为二三级菜单配置
 */
export function convertToMenuConfig(menuTree: MenuTreeResponse[]): Record<string, SecondaryMenuItem[]> {
  console.log('开始转换二三级菜单配置，原始数据：', menuTree)
  
  const config: Record<string, SecondaryMenuItem[]> = {}
  
  // 获取一级菜单
  const primaryMenus = menuTree.filter(menu => menu.parentId === 0 && menu.isVisible === 1)
  console.log('找到一级菜单：', primaryMenus)
  
  for (const primaryMenu of primaryMenus) {
    const menuKey = getMenuKey(primaryMenu.menuCode)
    console.log(`处理一级菜单：${primaryMenu.menuName}，menuKey：${menuKey}，类型：${primaryMenu.menuType}`)
    
    // 如果是直接菜单（工作台），不需要子菜单
    if (primaryMenu.menuType === 2) {
      config[menuKey] = []
      console.log(`${menuKey} 是直接菜单，无子菜单`)
      continue
    }
    
    // 使用API返回的children字段而不是查找
    if (primaryMenu.children && primaryMenu.children.length > 0) {
      console.log(`${menuKey} 有 ${primaryMenu.children.length} 个子菜单`)
      config[menuKey] = primaryMenu.children
        .filter(child => child.isVisible === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(child => convertToSecondaryMenuItem(child))
      console.log(`${menuKey} 转换后的子菜单：`, config[menuKey])
    } else {
      config[menuKey] = []
      console.log(`${menuKey} 无子菜单`)
    }
  }
  
  console.log('二三级菜单配置转换完成：', config)
  return config
}

/**
 * 将单个菜单项转换为二级菜单项
 */
function convertToSecondaryMenuItem(menu: MenuTreeResponse): SecondaryMenuItem {
  console.log(`转换二级菜单项：${menu.menuName}，类型：${menu.menuType}，路径：${menu.routerPath}`)
  
  const item: SecondaryMenuItem = {
    path: menu.routerPath,
    title: menu.menuName
  }
  
  // 如果是目录类型且有子菜单，使用API返回的children
  if (menu.menuType === 1 && menu.children && menu.children.length > 0) {
    console.log(`${menu.menuName} 有 ${menu.children.length} 个三级子菜单`)
    item.children = menu.children
      .filter(child => child.isVisible === 1)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(child => {
        console.log(`转换三级菜单：${child.menuName}，路径：${child.routerPath}`)
        return {
          path: child.routerPath,
          title: child.menuName
        }
      })
    console.log(`${menu.menuName} 转换后的三级菜单：`, item.children)
  } else {
    console.log(`${menu.menuName} 无三级子菜单或不是目录类型`)
  }
  
  return item
}



/**
 * 根据路由路径查找对应的一级菜单key
 */
export function findPrimaryMenuByPath(path: string, menuConfig: Record<string, SecondaryMenuItem[]>): string {
  // 特殊处理工作台
  if (path === '/dashboard') {
    return 'dashboard'
  }
  
  // 遍历菜单配置查找匹配的路径
  for (const [key, menus] of Object.entries(menuConfig)) {
    for (const menu of menus) {
      if (menu.children) {
        for (const child of menu.children) {
          if (child.path === path) {
            return key
          }
        }
      } else if (menu.path === path) {
        return key
      }
    }
  }
  
  // 如果没找到，根据路径前缀推断
  if (path.startsWith('/customer')) return 'customer_manage'
  if (path.startsWith('/product')) return 'product_manage'
  if (path.startsWith('/system')) return 'system_manage'
  if (path.startsWith('/crm')) return 'customer_manage'
  if (path.startsWith('/sso')) return 'sso_manage'
  
  return 'dashboard'
}

/**
 * 获取菜单组的第一个可用路径
 */
export function getFirstAvailablePath(menuKey: string, menuConfig: Record<string, SecondaryMenuItem[]>): string {
  // 特殊处理工作台
  if (menuKey === 'dashboard') {
    return '/dashboard'
  }
  
  const menus = menuConfig[menuKey]
  if (!menus || menus.length === 0) {
    return '/dashboard'
  }
  
  const firstMenu = menus[0]
  if (firstMenu.children && firstMenu.children.length > 0) {
    return firstMenu.children[0].path
  }
  
  return firstMenu.path || '/dashboard'
}
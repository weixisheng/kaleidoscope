import router from '@/router'

export interface MenuMeta {
  title?: string
  icon?: string
  hidden?: boolean
  order?: number
  menuKey?: string
}

export interface MenuItem {
  key: string
  title: string
  icon?: string
  path: string
  children?: MenuItem[]
  order: number
}

/**
 * 从路由配置生成菜单数据
 */
export function generateMenuFromRoutes(): MenuItem[] {
  const routes = router.getRoutes()

  // 找到主布局路由
  const layoutRoute = routes.find(
    route => route.path === '/' && route.children && route.children.length > 0
  )

  if (!layoutRoute?.children) {
    return []
  }

  // 转换路由为菜单项
  const menuItems: MenuItem[] = []

  layoutRoute.children.forEach(route => {
    const meta = (route.meta || {}) as MenuMeta

    // 跳过隐藏的菜单
    if (meta.hidden) return

    const menuItem: MenuItem = {
      key:
        meta.menuKey || (route.name as string) || route.path.replace('/', ''),
      title: meta.title || (route.name as string) || '未命名',
      icon: meta.icon || 'Document',
      path: route.path,
      order: meta.order || 0,
      children: [],
    }

    // 处理子路由 - 如果有子路由且不是重定向路由，则作为菜单组处理
    if (route.children && route.children.length > 0) {
      const validChildren = route.children.filter(childRoute => {
        const childMeta = (childRoute.meta || {}) as MenuMeta
        return !childMeta.hidden
      })

      if (validChildren.length > 0) {
        // 如果有多个子路由，创建菜单组
        if (validChildren.length > 1) {
          menuItem.children = [
            {
              key: `${menuItem.key}_group`,
              title: menuItem.title,
              path: route.path,
              order: 0,
              children: validChildren
                .map(childRoute => {
                  const childMeta = (childRoute.meta || {}) as MenuMeta
                  return {
                    key:
                      childMeta.menuKey ||
                      (childRoute.name as string) ||
                      childRoute.path,
                    title:
                      childMeta.title ||
                      (childRoute.name as string) ||
                      '未命名',
                    path: childRoute.path,
                    order: childMeta.order || 0,
                  }
                })
                .sort((a, b) => a.order - b.order),
            },
          ]
        } else {
          // 只有一个子路由，直接作为菜单项
          const childRoute = validChildren[0]
          const childMeta = (childRoute.meta || {}) as MenuMeta
          menuItem.children = [
            {
              key:
                childMeta.menuKey ||
                (childRoute.name as string) ||
                childRoute.path,
              title: childMeta.title || (childRoute.name as string) || '未命名',
              path: childRoute.path,
              order: childMeta.order || 0,
            },
          ]
        }
      }
    }

    menuItems.push(menuItem)
  })

  // 对菜单排序
  return menuItems.sort((a, b) => a.order - b.order)
}

/**
 * 根据路径查找对应的一级菜单key
 */
export function findPrimaryMenuKeyByPath(
  path: string,
  menuItems: MenuItem[]
): string {
  for (const menu of menuItems) {
    // 直接匹配
    if (menu.path === path) {
      return menu.key
    }

    // 匹配子菜单
    if (menu.children) {
      for (const child of menu.children) {
        if (child.path === path) {
          return menu.key
        }
        // 检查子菜单的子项
        if (child.children) {
          for (const grandChild of child.children) {
            if (grandChild.path === path) {
              return menu.key
            }
          }
        }
      }
    }

    // 路径前缀匹配
    if (path.startsWith(menu.path + '/')) {
      return menu.key
    }
  }

  return menuItems[0]?.key || 'dashboard'
}

/**
 * 获取菜单的第一个可用路径
 */
export function getFirstAvailablePath(
  menuKey: string,
  menuItems: MenuItem[]
): string {
  const menu = menuItems.find(m => m.key === menuKey)

  if (!menu) {
    return '/'
  }

  // 如果有子菜单，返回第一个子菜单路径
  if (menu.children && menu.children.length > 0) {
    return menu.children[0].path
  }

  // 否则返回菜单本身的路径
  return menu.path
}

/**
 * 根据菜单key获取子菜单
 */
export function getSecondaryMenus(
  menuKey: string,
  menuItems: MenuItem[]
): MenuItem[] {
  const menu = menuItems.find(m => m.key === menuKey)
  return menu?.children || []
}

/**
 * 根据路径查找菜单标题
 */
export function findMenuTitleByPath(
  path: string,
  menuItems: MenuItem[]
): string {
  for (const menu of menuItems) {
    if (menu.path === path) {
      return menu.title
    }

    if (menu.children) {
      for (const child of menu.children) {
        if (child.path === path) {
          return child.title
        }
        // 检查子菜单的子项
        if (child.children) {
          for (const grandChild of child.children) {
            if (grandChild.path === path) {
              return grandChild.title
            }
          }
        }
      }
    }
  }

  return '工作台'
}

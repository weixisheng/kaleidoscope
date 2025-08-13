<template>
  <div class="layout-container">
    <div class="layout-wrapper">
      <!-- 左侧一级菜单 -->
      <div :class="['left-sidebar', { collapsed: isCollapse }]">
        <!-- Logo区域 -->
        <div class="logo-area">
          <div class="logo-icon">
            <i class="iconfont mdicon-logo"></i>
          </div>
          <span v-if="!isCollapse" class="logo-text">万花筒总后台</span>
        </div>

        <!-- 一级菜单 -->
        <div class="primary-menu">
          <!-- 菜单加载中 -->
          <div v-if="menuLoading" class="menu-loading">
            <el-icon class="loading-icon">
              <Loading />
            </el-icon>
            <span v-if="!isCollapse" class="loading-text">加载中...</span>
          </div>

          <!-- 菜单加载失败 -->
          <div v-else-if="menuError" class="menu-error">
            <el-icon class="error-icon">
              <Warning />
            </el-icon>
            <span v-if="!isCollapse" class="error-text">菜单加载失败</span>
            <el-button v-if="!isCollapse" type="text" size="small" @click="initMenus" class="retry-btn">
              重试
            </el-button>
          </div>

          <!-- Element Plus 一级菜单 -->
          <el-menu
            v-else
            :default-active="currentPrimaryMenu"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="primary-el-menu"
            @select="selectPrimaryMenu"
          >
            <el-menu-item
              v-for="menu in primaryMenus"
              :key="menu.key"
              :index="menu.key"
            >
              <el-icon>
                <component :is="menu.icon" />
              </el-icon>
              <template #title>{{ menu.title }}</template>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 展开收起按钮 -->
        <div class="toggle-btn" @click="toggleSidebar">
          <el-icon>
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
        </div>
      </div>

      <!-- 中间二三级菜单 -->
      <div v-if="!menuLoading && !menuError && currentSecondaryMenus.length > 0"
        :class="['middle-sidebar', { collapsed: isMiddleCollapsed }]">
        <!-- 顶部标题 -->
        <div class="menu-header">
          <span v-if="!isMiddleCollapsed" class="header-title">{{ currentPrimaryMenuTitle }}</span>
          <div class="header-toggle" @click="toggleMiddleSidebar">
            <el-icon class="header-icon">
              <Expand v-if="isMiddleCollapsed" />
              <Fold v-else />
            </el-icon>
          </div>
        </div>

        <!-- Element Plus 二三级菜单 -->
        <div v-if="!isMiddleCollapsed" class="secondary-menu">
          <el-menu
            :default-active="$route.path"
            :default-openeds="expandedMenus"
            class="secondary-el-menu"
            router
            @open="handleMenuOpen"
            @close="handleMenuClose"
          >
            <template v-for="menu in currentSecondaryMenus" :key="menu.path">
              <!-- 有子菜单的菜单组 -->
              <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
                <template #title>{{ menu.title }}</template>
                <el-menu-item
                  v-for="child in menu.children"
                  :key="child.path"
                  :index="child.path"
                >
                  {{ child.title }}
                </el-menu-item>
              </el-sub-menu>
              
              <!-- 单独的菜单项 -->
              <el-menu-item v-else :index="menu.path">
                {{ menu.title }}
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="right-content">
        <!-- 顶部区域 -->
        <div class="content-header">
          <!-- 当前菜单 -->
          <div class="current-menu">
            {{ currentMenuTitle }}
          </div>

          <!-- 个人信息 -->
          <div class="user-area">
            <el-dropdown @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="32" class="user-avatar">
                  <el-icon>
                    <User />
                  </el-icon>
                </el-avatar>
                <span class="username">{{ '管理员' }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人设置</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="main-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Expand,
  Fold,
  Loading,
  Warning
} from '@element-plus/icons-vue'
import {
  generateMenuFromRoutes,
  findPrimaryMenuKeyByPath,
  getFirstAvailablePath,
  getSecondaryMenus,
  findMenuTitleByPath,
  type MenuItem
} from '@/utils/routerMenuUtils'

const route = useRoute()
const router = useRouter()

// 侧边栏状态
const isCollapse = ref(false)
const isMiddleCollapsed = ref(false)
const currentPrimaryMenu = ref('dashboard')
const expandedMenus = ref<string[]>([])

// 菜单数据
const menuItems = ref<MenuItem[]>([])

// 菜单加载状态
const menuLoading = ref(false)
const menuError = ref(false)

// 计算一级菜单
const primaryMenus = computed(() => {
  return menuItems.value.map(item => ({
    key: item.key,
    title: item.title,
    icon: item.icon || 'Document'
  }))
})

// 计算当前二三级菜单
const currentSecondaryMenus = computed(() => {
  return getSecondaryMenus(currentPrimaryMenu.value, menuItems.value)
})

// 计算当前一级菜单标题
const currentPrimaryMenuTitle = computed(() => {
  const menu = menuItems.value.find(m => m.key === currentPrimaryMenu.value)
  return menu?.title || ''
})

// 计算当前菜单标题
const currentMenuTitle = computed(() => {
  return findMenuTitleByPath(route.path, menuItems.value)
})

// 初始化菜单数据
const initMenus = async () => {
  try {
    menuLoading.value = true
    menuError.value = false

    // 从路由配置生成菜单
    menuItems.value = generateMenuFromRoutes()
    
    // 根据当前路由设置活跃菜单
    const menuKey = findPrimaryMenuKeyByPath(route.path, menuItems.value)
    currentPrimaryMenu.value = menuKey
    setDefaultExpandedMenus(menuKey)
  } catch (error) {
    console.error('菜单初始化失败:', error)
    menuError.value = true
  } finally {
    menuLoading.value = false
  }
}

// 设置默认展开的菜单组
const setDefaultExpandedMenus = (menuKey: string) => {
  const secondaryMenus = getSecondaryMenus(menuKey, menuItems.value)
  if (secondaryMenus.length > 0) {
    // 清空现有展开项
    expandedMenus.value = []
    // 如果当前路由在某个菜单组下，展开该菜单组
    for (const menu of secondaryMenus) {
      if (menu.children && menu.children.length > 0) {
        const hasActiveChild = menu.children.some(child => child.path === route.path)
        if (hasActiveChild) {
          expandedMenus.value.push(menu.path)
        }
      }
    }
  }
}

// 选择一级菜单
const selectPrimaryMenu = (menuKey: string) => {
  currentPrimaryMenu.value = menuKey

  // 获取第一个可用路径
  const firstPath = getFirstAvailablePath(menuKey, menuItems.value)

  // 如果有子菜单组，确保展开第一个有子菜单的组
  const secondaryMenus = getSecondaryMenus(menuKey, menuItems.value)
  if (secondaryMenus.length > 0) {
    const firstMenuWithChildren = secondaryMenus.find(menu => menu.children && menu.children.length > 0)
    if (firstMenuWithChildren && !expandedMenus.value.includes(firstMenuWithChildren.path)) {
      expandedMenus.value.push(firstMenuWithChildren.path)
    }
  }

  // 跳转到对应路径
  router.push(firstPath)
}

// 处理菜单展开
const handleMenuOpen = (key: string) => {
  if (!expandedMenus.value.includes(key)) {
    expandedMenus.value.push(key)
  }
}

// 处理菜单收起
const handleMenuClose = (key: string) => {
  const index = expandedMenus.value.indexOf(key)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  }
}

// 切换左侧一级菜单
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 切换中间二三级菜单
const toggleMiddleSidebar = () => {
  isMiddleCollapsed.value = !isMiddleCollapsed.value
}

// 监听路由变化，更新当前活跃菜单
watch(() => route.path, (newPath) => {
  if (menuItems.value.length > 0) {
    const menuKey = findPrimaryMenuKeyByPath(newPath, menuItems.value)
    currentPrimaryMenu.value = menuKey
    setDefaultExpandedMenus(menuKey)
  }
})

// 组件挂载时初始化菜单
onMounted(() => {
  initMenus()
})

// 用户菜单操作
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人设置功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    ElMessage.success('已退出登录')
  } catch {
    // 用户取消退出
  }
}
</script>

<style scoped lang="scss">
// 主色调变量
$primary-color: #1675d1;
$primary-hover: #3a87d6;
$primary-active: #0d5aa7;

.layout-container {
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

.layout-wrapper {
  display: flex;
  height: 100vh;
}

// 左侧一级菜单
.left-sidebar {
  width: 160px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 21, 41, 0.08);

  &.collapsed {
    width: 64px;
  }

  .logo-area {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 16px;

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, $primary-color, #74b9ff);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      margin-right: 8px;
      flex-shrink: 0;

      .iconfont {
        font-size: 18px;
        color: #fff;
      }
    }

    .logo-text {
      font-size: 18px;
      font-weight: bold;
      color: $primary-color;
      white-space: nowrap;
    }
  }

  .primary-menu {
    flex: 1;
    padding: 16px 0;

    // Element Plus 菜单样式覆盖
    .primary-el-menu {
      border: none;
      background: transparent;

      :deep(.el-menu-item) {
        height: 48px;
        line-height: 48px;
        padding: 0 20px !important;
        margin: 0;
        border-left: 3px solid transparent;
        color: #333;
        font-weight: 500;

        .el-icon {
          font-size: 20px;
          color: #666;
          margin-right: 12px;
        }

        &:hover {
          background: #f8f9fa !important;
          color: $primary-color;

          .el-icon {
            color: $primary-color;
          }
        }

        &.is-active {
          background: #f0f7ff !important;
          border-left-color: $primary-color;
          color: $primary-color;
          font-weight: bold;

          .el-icon {
            color: $primary-color;
          }
        }
      }

      // 折叠状态样式
      &.el-menu--collapse {
        :deep(.el-menu-item) {
          padding: 0 20px !important;
          text-align: center;
        }
      }
    }

    // 菜单加载状态
    .menu-loading {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #666;

      .loading-icon {
        font-size: 16px;
        animation: loading-rotate 1s linear infinite;
      }

      .loading-text {
        margin-left: 8px;
        font-size: 14px;
      }
    }

    // 菜单错误状态
    .menu-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 16px;
      color: #f56c6c;

      .error-icon {
        font-size: 16px;
        margin-bottom: 4px;
      }

      .error-text {
        font-size: 12px;
        margin-bottom: 8px;
        text-align: center;
      }

      .retry-btn {
        font-size: 11px;
        padding: 2px 8px;
        color: #1675d1;

        &:hover {
          background: rgba(22, 117, 209, 0.1);
        }
      }
    }
  }

  .toggle-btn {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #e4e7ed;
    cursor: pointer;
    color: #666;
    transition: all 0.3s;

    &:hover {
      background: #f8f9fa;
      color: $primary-color;
    }
  }
}

// 中间二三级菜单
.middle-sidebar {
  width: 160px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  &.collapsed {
    width: 64px;
  }

  .menu-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid #e4e7ed;
    background: #fafafa;

    .header-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.3s ease;

      &:hover {
        background: #f0f7ff;
      }

      .header-icon {
        font-size: 16px;
        color: #666;
        transition: color 0.3s ease;
      }

      &:hover .header-icon {
        color: $primary-color;
      }
    }

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  // 折叠状态下的样式
  &.collapsed {
    .menu-header {
      justify-content: center;
      padding-left: 8px;

      .header-toggle {
        margin-right: 0;
      }

      .header-title {
        opacity: 0;
        width: 0;
        margin: 0;
      }
    }

    .secondary-menu {
      opacity: 0;
      pointer-events: none;
    }
  }

  .secondary-menu {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    opacity: 1;
    transition: opacity 0.3s ease;

    // Element Plus 二级菜单样式覆盖
    .secondary-el-menu {
      border: none;
      background: transparent;

      :deep(.el-menu-item) {
        height: 40px;
        line-height: 40px;
        padding: 0 32px 0 13px !important;
        color: #666;
        font-size: 14px;
        border-left: 3px solid transparent;

        &:hover {
          background: #f8f9fa !important;
          color: $primary-color;
        }

        &.is-active {
          background: #f0f7ff !important;
          color: $primary-color;
          font-weight: bold;
          border-left-color: $primary-color;
        }
      }

      :deep(.el-sub-menu) {
        .el-sub-menu__title {
          height: 44px;
          line-height: 44px;
          padding: 0 16px !important;
          font-size: 16px;
          color: #333;
          font-weight: 500;

          &:hover {
            background: #f8f9fa !important;
          }

          .el-sub-menu__icon-arrow {
            font-size: 12px;
            color: #999;
          }
        }

        .el-menu {
          background: transparent;
        }
      }
    }
  }
}

// 右侧内容区
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  min-width: 0;
  overflow: hidden;

  .content-header {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    flex-shrink: 0;
    min-width: 0;

    .current-menu {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 20px;
      min-width: 0;
    }

    .user-area {
      flex-shrink: 0;

      .user-info {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 20px;
        padding: 8px 16px;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 0;

        .user-avatar {
          background: $primary-color;
          flex-shrink: 0;
        }

        .username {
          margin-left: 8px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
          min-width: 0;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f5f5f5;
    min-width: 0;
    width: 100%;
  }
}

// 菜单加载动画
@keyframes loading-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

// 滚动条样式
:deep(.secondary-menu::-webkit-scrollbar) {
  width: 4px;
}

:deep(.secondary-menu::-webkit-scrollbar-track) {
  background: #f1f1f1;
}

:deep(.secondary-menu::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 2px;
}

:deep(.secondary-menu::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

// 响应式设计保持原有逻辑...
@media (max-width: 1400px) {
  .middle-sidebar {
    width: 200px;

    &.collapsed {
      width: 64px;
    }

    .menu-header .header-title {
      font-size: 14px;
    }
  }
}

@media (max-width: 1200px) {
  .left-sidebar {
    width: 120px;

    &.collapsed {
      width: 64px;
    }
  }

  .middle-sidebar {
    width: 180px;

    &.collapsed {
      width: 64px;
    }
  }

  .right-content .content-header .current-menu {
    font-size: 14px;
  }
}

@media (max-width: 992px) {
  .left-sidebar {
    width: 64px;

    .logo-area .logo-text {
      display: none;
    }
  }

  .middle-sidebar {
    width: 160px;

    &.collapsed {
      width: 64px;
    }
  }
}

@media (max-width: 768px) {
  .layout-wrapper {
    position: relative;
  }

  .left-sidebar {
    position: absolute;
    z-index: 1001;
    height: 100vh;
    left: 0;
    top: 0;
    width: 64px;
    box-shadow: 2px 0 16px rgba(0, 21, 41, 0.15);

    &.collapsed {
      width: 64px;
    }

    .logo-area .logo-text {
      display: none;
    }
  }

  .middle-sidebar {
    position: absolute;
    z-index: 1000;
    left: 64px;
    height: 100vh;
    width: 200px;
    box-shadow: 2px 0 16px rgba(0, 21, 41, 0.15);
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.show {
      transform: translateX(0);
    }
  }

  .right-content {
    width: 100%;
    margin-left: 64px;

    .content-header {
      .current-menu {
        font-size: 14px;
      }

      .user-area .user-info {
        padding: 6px 12px;

        .username {
          max-width: 80px;
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 576px) {
  .right-content {
    margin-left: 0;

    .content-header {
      padding: 0 12px;

      .current-menu {
        font-size: 13px;
      }

      .user-area .user-info {
        padding: 4px 8px;

        .username {
          display: none;
        }
      }
    }

    .main-content {
      padding: 12px;
    }
  }

  .left-sidebar {
    left: -64px;
    transition: left 0.3s ease;

    &.show {
      left: 0;
    }
  }

  .middle-sidebar {
    left: 0;
    width: 240px;

    &.show {
      transform: translateX(0);
    }
  }
}
</style>
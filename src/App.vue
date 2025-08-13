<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用根组件
</script>

<style lang="scss">
@import '@/styles/font.css';
@import '@/styles/main.scss';

// 全局样式重置
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #f5f5f5;
}

input,
button {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#app {
  min-height: 100vh;
}

// Element Plus 样式覆盖
.el-button {
  font-weight: normal;
}

.el-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: none;
}

// 主色调变量
:root {
  --el-color-primary: #1675d1;
  --el-color-primary-light-3: #4d91db;
  --el-color-primary-light-5: #73a9e5;
  --el-color-primary-light-7: #99c1ef;
  --el-color-primary-light-8: #b3d1f4;
  --el-color-primary-light-9: #cce0f9;
  --el-color-primary-dark-2: #1260a8;
}

// 全局响应式样式
* {
  box-sizing: border-box;
}

// 确保所有容器都能正确处理溢出
.el-card,
.el-table,
.el-pagination {
  max-width: 100%;
}

/* 下拉菜单按钮看起来多一条边框，覆盖掉 */
.el-dropdown .el-button:hover,
.el-dropdown .el-button:focus,
.el-button .el-button:focus-visible {
  box-shadow: none !important;
  outline: none !important;
}
</style>
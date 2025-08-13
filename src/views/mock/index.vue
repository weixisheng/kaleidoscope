<template>
  <div class="mock-page-container">
    <div class="mock-content">
      <div class="mock-header">
        <div class="mock-icon">
          <el-icon size="48">
            <Document />
          </el-icon>
        </div>
        <h1 class="mock-title">{{ pageTitle }}</h1>
        <p class="mock-subtitle">{{ pageSubtitle }}</p>
      </div>
      
      <div class="mock-info">
        <el-card class="info-card">
          <template #header>
            <span>页面信息</span>
          </template>
          <div class="info-item">
            <span class="label">当前路由：</span>
            <span class="value">{{ $route.path }}</span>
          </div>
          <div class="info-item">
            <span class="label">路由名称：</span>
            <span class="value">{{ $route.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">页面标题：</span>
            <span class="value">{{ pageTitle }}</span>
          </div>
        </el-card>
        
        <el-card class="status-card">
          <template #header>
            <span>开发状态</span>
          </template>
          <div class="status-content">
            <el-tag type="warning" size="large">开发中</el-tag>
            <p class="status-text">此页面功能正在开发中，敬请期待...</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

const route = useRoute()

// 计算页面标题
const pageTitle = computed(() => {
  return route.meta?.title as string || route.name as string || '页面'
})

// 计算页面副标题
const pageSubtitle = computed(() => {
  const title = pageTitle.value
  return `${title}功能模块`
})
</script>

<style scoped lang="scss">
.mock-page-container {
  min-height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.mock-content {
  max-width: 600px;
  width: 100%;
}

.mock-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;

  .mock-icon {
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .mock-title {
    font-size: 32px;
    font-weight: bold;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .mock-subtitle {
    font-size: 16px;
    margin: 0;
    opacity: 0.9;
  }
}

.mock-info {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.info-card, .status-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  :deep(.el-card__header) {
    background: transparent;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: #666;
  }

  .value {
    color: #333;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: #f8f9fa;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
  }
}

.status-content {
  text-align: center;
  padding: 20px 0;

  .status-text {
    margin: 16px 0 0 0;
    color: #666;
    font-size: 14px;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .mock-page-container {
    padding: 16px;
  }

  .mock-header {
    .mock-title {
      font-size: 24px;
    }

    .mock-subtitle {
      font-size: 14px;
    }
  }

  .mock-info {
    grid-template-columns: 1fr;
  }
}
</style>
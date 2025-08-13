<template>
  <div class="dashboard-container">
    <div class="welcome-card">
      <h1>欢迎使用万花筒总后台</h1>
      <p>这是工作台页面，菜单已基于路由配置自动生成</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">1,234</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">567</div>
          <div class="stat-label">活跃用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">89</div>
          <div class="stat-label">今日新增</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">12</div>
          <div class="stat-label">待处理</div>
        </div>
      </div>
    </div>

    <!-- KaDescription 组件测试 -->
    <div class="component-test-section">
      <h2>KaDescription 组件测试</h2>
      
      <div class="test-item">
        <h3>基础用法</h3>
        <ka-description text="这是一个基础的描述组件，使用默认样式。" />
      </div>
      
      <div class="test-item">
        <h3>自定义样式</h3>
        <ka-description 
          text="这是一个信息提示，使用蓝色主题。"
          background-color="#e3f2fd"
          color="#1565c0"
          padding="16px 20px"
          border-radius="8px"
        />
      </div>
      
      <div class="test-item">
        <h3>插槽用法</h3>
        <ka-description background-color="#f0f9ff" color="#0c4a6e" padding="20px">
          <div>
            <strong>功能特性：</strong>
            <ul style="margin: 8px 0 0 20px;">
              <li>支持自定义背景色和字体颜色</li>
              <li>支持通过 text 属性或插槽传入内容</li>
              <li>响应式设计，自动换行</li>
            </ul>
          </div>
        </ka-description>
      </div>
      
      <div class="test-item">
        <h3>警告样式</h3>
        <ka-description 
          text="⚠️ 这是一个警告信息，请注意相关事项。"
          background-color="#fff3cd"
          color="#856404"
          font-size="15px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KaDescription from '@/packages/basic/ka-description/index.vue'
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;

  h1 {
    color: #333;
    margin-bottom: 8px;
    font-size: 24px;
  }

  p {
    color: #666;
    margin-bottom: 24px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;

  .stat-number {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }
}

.component-test-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 20px;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 8px;
  }

  .test-item {
    margin-bottom: 24px;

    h3 {
      color: #555;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
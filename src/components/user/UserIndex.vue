<template>
  <div>
    <el-card class="user-profile-card" shadow="hover">
    <div class="avatar-container">
      <el-avatar :size="100" :src="avatarUrl" class="user-avatar" />
      <div class="user-name">{{ userName }}</div>
      <el-tag type="warning" effect="light" class="vip-tag">
        VIP{{ userLevel }}
      </el-tag>
    </div>

    <el-button type="primary" plain @click="checkTokenAndOpenDrawer('innerDrawer1')">用户信息</el-button>

    <el-divider />

    <div class="user-stats">
      <el-button type="primary" plain @click="navigateToOrder">我的订单</el-button>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-item" @click="$emit('stat-click', 'unpaid')">
            <div class="stat-value">{{ pendingPaymentCount }}</div>
            <div class="stat-label">待付款</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item" @click="$emit('stat-click', 'unsent')">
            <div class="stat-value">{{ pendingShipmentCount }}</div>
            <div class="stat-label">待发货</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-item" @click="$emit('stat-click', 'shipped')">
            <div class="stat-value">{{ pendingReceiptCount }}</div>
            <div class="stat-label">待收货</div>
          </div>
        </el-col>
      </el-row>
      <el-divider />


      <div class="button-container">
        <!-- 修改点击事件，传入抽屉状态变量名 -->
        <el-button type="primary" plain @click="navigateToCart">我的购物车</el-button>
        <el-button type="primary" plain @click="navigateToFavorites">我的收藏单</el-button>

        <!-- 使用el-popconfirm包裹退出登录按钮 -->
        <el-popconfirm
          width="220"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="确定要退出登录吗？"
          @confirm="handleLogoutConfirm"
          @cancel="handleLogoutCancel"
        >
          <template #reference>
            <el-button type="info" round>退出登录</el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button type="danger" size="small" @click="confirm">确认退出</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </el-card>
  </div>
  <div>

    <div>
      <el-drawer
        v-model="innerDrawer1"
        title="I'm inner Drawer"
        :append-to-body="true"
        size="60%"
        direction="ltr"
      >
        <user-info/>
      </el-drawer>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuserStore } from '@/stores/userStore'
import { logoutApi } from '@/api/logout/LogoutApi';
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import userInfo from './userInfo.vue'

const router = useRouter()
const userStore = useSuserStore()

const innerDrawer1 = ref(false)
const innerDrawer2 = ref(false)

defineProps({
  pendingPaymentCount: {
    type: Number,
    default: 0
  },
  pendingShipmentCount: {
    type: Number,
    default: 0
  },
  pendingReceiptCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['stat-click'])

const avatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const userName = '张用户'
const userLevel = 3

// 订单页面路由跳转
const navigateToOrder = () => {
  checkTokenAndNavigate('/order')
}

// 购物车页面路由跳转
const navigateToCart = () => {
  checkTokenAndNavigate('/buycar')
}

// 收藏夹页面路由跳转
const navigateToFavorites = () => {
  checkTokenAndNavigate('/favorite')
}

// 检查token并导航的辅助函数
const checkTokenAndNavigate = (path: string) => {
  if (!userStore.getToken) {
    ElMessage({
      message: '请先登录',
      type: 'error',
      duration: 3000
    });
    router.push('/login');
  } else {
    router.push(path);
  }
}

// 新增方法：检查token并打开对应抽屉
const checkTokenAndOpenDrawer = (drawerName: 'innerDrawer1' | 'innerDrawer2') => {
  if (!userStore.getToken) {
    ElMessage({
      message: '请先登录',
      type: 'error',
      duration: 3000
    });
    router.push('/login');
  } else {
    // 根据传入的抽屉名称，设置对应的抽屉状态为 true
    if (drawerName === 'innerDrawer1') {
      innerDrawer1.value = true;
    } else {
      innerDrawer2.value = true;
    }
  }
}

// 退出登录确认处理
const handleLogoutConfirm = () => {
  if (userStore.userData && userStore.userData.data && userStore.userData.data.token) {
    const token = userStore.userData.data.token;
    console.log(token);
    logoutApi(token);
    userStore.$patch((state) => {
      state.userData = null;
    });
    localStorage.removeItem('token');

    // 关闭所有抽屉
    innerDrawer1.value = false;
    innerDrawer2.value = false;

    ElMessage({
      message: '退出登录成功',
      type: 'success',
      duration: 3000
    });
    router.push('/login');
  } else {
    ElMessage({
      message: '您尚未登录',
      type: 'info',
      duration: 3000
    });
  }
}

// 退出登录取消处理
const handleLogoutCancel = () => {
  ElMessage({
    message: '已取消退出登录',
    type: 'info',
    duration: 3000
  });
}
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 按钮间距 */
}
.el-button{
  width: 50%;
  display: flex;
  margin-left: 50px;
}
.user-profile-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 20px;
  text-align: center;
}

.avatar-container {
  padding: 20px 0;
}

.user-avatar {
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.vip-tag {
  font-weight: bold;
  letter-spacing: 1px;
}

.user-stats {
  padding: 0 10px;
}

.stat-item {
  cursor: pointer;
  padding: 10px 0;
  transition: all 0.2s;
  border-radius: 8px;
}

.stat-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

</style>

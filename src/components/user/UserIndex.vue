<template>
  <div>
    <div class="button-container">
      <!-- 修改点击事件，传入抽屉状态变量名 -->
      <el-button type="primary" @click="checkTokenAndOpenDrawer('innerDrawer1')">用户信息</el-button>
      <el-button type="primary" @click="checkTokenAndOpenDrawer('innerDrawer2')">用户信息2</el-button>
      <el-button type="primary" plain @click="navigateToOrder">我的订单</el-button>
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
    <div>
      <el-drawer
        v-model="innerDrawer1"
        title="I'm inner Drawer"
        :append-to-body="true"
        size="50%"
        direction="ltr"
      >
        <p>_(:зゝ∠)_</p>
      </el-drawer>
      <el-drawer
        v-model="innerDrawer2"
        title="I'm inner Drawer from Right"
        :append-to-body="true"
        size="50%"
        direction="ltr"
      >
        <p>_(:зゝ∠)_</p>
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

const router = useRouter()
const userStore = useSuserStore()

const innerDrawer1 = ref(false)
const innerDrawer2 = ref(false)

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
</style>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    position="absolute"
  >
    <el-menu-item index="0">
      <img
        @click="returnHome()"
        style="width: 60px; height: 60px; "
        src="../../assets/shopping.png"
        alt="Element logo"
      />
    </el-menu-item>
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!userStore.userData ||!userStore.userData.data.token">
          <a href="#" class="login-link" @click="handleLoginClick">请登录</a>
          <a href="#" class="register-link" @click="handleRegisterClick">免费注册</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else>
          <a class="login-link">您好,{{ userStore.userData.data.name }}</a>
          <a  class="logout-link" @click="logout">退出登录</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a  class="theme-link" @click="themeSelect">主题切换</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>注册会员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="search-container">
      <el-sub-menu index="2">
        <template #title>产品</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="1" @click="checkTokenAndNavigate('/order')"><template #title>订单</template></el-menu-item>
      <el-menu-item index="3" @click="checkTokenAndNavigate('/buycar')">购物车</el-menu-item>
      <el-menu-item index="4" @click="checkTokenAndNavigate('/favorite')">收藏夹</el-menu-item>

      <el-sub-menu index="5">
        <template #title>帮助中心</template>
        <el-menu-item index="5-1" @click="checkTokenAndNavigate('/help/official')">官方客服</el-menu-item>
        <el-menu-item index="5-2" @click="checkTokenAndNavigate('/help/business')">商家客服</el-menu-item>
        <el-menu-item index="5-3" @click="checkTokenAndNavigate('/help/message')">消息中心</el-menu-item>
        <el-menu-item index="5-4" @click="checkTokenAndNavigate('/help/feedback')">意见反馈</el-menu-item>
        <el-menu-item index="5-5" @click="checkTokenAndNavigate('/help/report')">举报中心</el-menu-item>
      </el-sub-menu>
      <!-- 修改用户中心按钮的点击事件 -->
      <el-button type="primary" style="margin-left: 16px" @click="handleUserCenterClick">
        用户中心
      </el-button>
      <el-drawer v-model="drawer" title="用户中心" size="25%" >
        <userPage />
      </el-drawer>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSuserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { LRStore } from '@/stores/LRStore';
import { useRoute } from 'vue-router'
import { ThemeStore } from '@/stores/themeStore';
import userPage from '@/components/user/UserIndex.vue'
const themeStore = ThemeStore();

const router = useRouter()
const route = useRoute()
let activeIndex = ref('1')
const userStore = useSuserStore()
const lrStore = LRStore();

const drawer = ref(false)


const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' | 'primary') => {
  ElMessage({
    message,
    type,
    duration: 3000
  });
};

const handleSelect = (key: string, keyPath: string) => {
  activeIndex = ref(keyPath[keyPath.length - 1])
  if (activeIndex.value === '1') {
    router.push('/')
  }
}

function handleLoginClick(e: Event) {
  e.preventDefault();
  lrStore.toggleToLogin();
  if (route.path!== '/login') {
    router.push('/login');
  }
}

function handleRegisterClick(e: Event) {
  e.preventDefault();
  lrStore.toggleToRegister();
  console.log(lrStore.isLoginPage)
  router.push('/login');
}

const themeSelect = () => {
  themeStore.toggleTheme();
  console.log('themeSelect', themeStore.isBackground1 ? 'background1' : 'background2');

};

function returnHome() {
  router.push('/')
}

const checkTokenAndNavigate = (path: string) => {
  if (!userStore.getToken) {
    showNotification('错误', '请先登录', 'error');
    router.push('/login');
  } else {
    router.push(path);
  }
}


// 退出登录函数
const logout = () => {
  if (userStore.userData && userStore.userData.data && userStore.userData.data.token){
    showNotification('登出成功', '正在退出返回到登陆页面', 'primary');
    userStore.$patch((state) => {
      state.userData = null;
    });
    // 清空本地存储的 token
    localStorage.removeItem('token')
    router.push('/login')
  } else {
    showNotification('登出错误', '登出错误', 'error');
  }
}

// 修改用户中心按钮的点击处理函数
const handleUserCenterClick = () => {
  if (!userStore.getToken) {
    showNotification('错误', '请先登录', 'error');
    router.push('/login');
  } else {
    drawer.value = true;
  }
}
</script>

<style lang="scss" scoped>
@use 'resources/style.scss';

.theme-link {
  color: transparent;
  background: linear-gradient(45deg, #ff7e5f, #feb47b, #56ccf2, #69d2e7);
  -webkit-background-clip: text;
  background-clip: text;
  padding: 5px 0;
  transition: opacity 0.3s;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.theme-link:hover {
  opacity: 0.8;
}

.theme-link:active {
  opacity: 1;
}
.el-draw{
  opacity: 1
}

</style>

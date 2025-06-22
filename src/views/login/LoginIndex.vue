<template>
  <div class="content">
    <div class="introduce">
      <div class="introduce-content">
        <!-- 判断:登录页面OR注册页面-->
        <p v-if="isLoginPage" class="tips animate__animated animate__slideInLeft">
          购物
        </p>
        <p v-else class="tips animate__animated animate__slideInLeft">
          注册账户
        </p>
      </div>
    </div>
    <div class="form-wrapper animate__animated animate__slideInRight">
      <div class="login-form">
        <!-- 判断:登录页面OR注册页面-->
        <h1 v-if="isLoginPage">Login</h1>
        <h1 v-else>Register</h1>
        <span v-if="isLoginPage" class="login-tips">
          Measure the performance of cryptos,get big profits!
        </span>
        <span v-else class="login-tips">
          开始您的加密货币之旅!
        </span>
        <!-- 登录 -->
        <div v-if="isLoginPage" class="login-content">
          <!-- 登录表单 -->
          <div class="other-login">
            <img src="@/assets/WeChat.png" alt="">
            <span>Sign With WeChat</span>
          </div>
          <div class="divider">
            <span class="line"></span>
            <span class="divider-text">Or Sign With Account</span>
            <span class="line"></span>
          </div>
          <div class="form">
            <div class="input-wrapper">
              <span class="input-tips">账号</span>
              <input v-model="uselogin.userName" type="text" class="ipt" placeholder="311***@qq.com">
            </div>
            <div class="input-wrapper">
              <span class="input-tips">密码</span>
              <div style="position: relative;">
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  class="ipt"
                  placeholder="Min. 8 character"
                  v-model="uselogin.password"
                >
                <span
                  style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;"
                  @click="isPasswordVisible = !isPasswordVisible"
                >
                  {{ isPasswordVisible ? 'Hide' : 'Show' }}
                </span>
              </div>
            </div>
            <div class="other-setting">
              <div class="rem-pwd">
                <input type="checkbox">
                <span>Remember me</span>
              </div>
              <span class="forget-pwd">
                Forget password
              </span>
            </div>
            <button class="btn" @click="handleLogin">Login</button></div>

          <span class="register" @click="toggleToRegister">
            {{ isLoginPage ? "Not register yet? Create An Account" : "已有账户? 立即登录" }}
          </span>
        </div>
        <!-- 注册页面 -->
        <div v-else class="register-content">
          <div class="steps-container">
            <!-- 注册表单内容 -->
            <div class="steps-wrapper">
              <el-steps direction="vertical" :active="activeStep+1">
                <el-step  />
                <el-step  />
                <el-step  />
              </el-steps>
            </div>

            <div class="form-content">
              <!-- 第一步 -->
              <div v-if="activeStep === 0">
                <div class="form">
                  <div class="input-wrapper">
                    <span class="input-tips">昵称</span>
                    <input v-model="newUser.account" type="text" class="ipt" placeholder="User6666">
                  </div>
                  <div class="input-wrapper">
                    <span class="input-tips">账号</span>
                    <input v-model="newUser.account" type="text" class="ipt" placeholder="311***@qq.com">
                  </div>
                  <div class="input-wrapper">
                    <span class="input-tips">密码</span>
                    <div style="position: relative;">
                      <input
                        v-model="newUser.password"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        class="ipt"
                        placeholder="Min. 8 character"
                      >
                      <span
                        style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;"
                        @click="isPasswordVisible = !isPasswordVisible"
                      >
                        {{ isPasswordVisible ? 'Hide' : 'Show' }}
                      </span>
                    </div>
                  </div>
                  <button class="btn" @click="nextStep">下一步</button>

                </div>
              </div>
              <!-- 第二步 -->
              <div v-if="activeStep === 1">
                <div class="form">
                  <div class="input-wrapper">
                    <span class="input-tips">电话</span>
                    <input v-model="newUser.phone" type="tel" class="ipt" placeholder="+86 123 4567 8910">
                  </div>
                  <div class="input-wrapper">
                    <span class="input-tips">邮箱</span>
                    <input v-model="newUser.email" type="email" class="ipt" placeholder="example@mail.com">
                  </div>

                  <div class="navigation-buttons">
                    <button class="btnfont" @click="prevStep">上一步</button>
                    <button class="btn" @click="nextStep">下一步</button>
                  </div>
                </div>
              </div>
              <!-- 第三步 -->
              <div class="form">
                <div v-if="activeStep === 2">
                  <div class="demo-fit">
                    <div v-for="fit in fits" :key="fit" class="block">
                      <span class="title">'cover'</span>
                      <el-avatar shape="square" :size="100" :fit="fit" :src="url" />
                    </div>
                  </div>
                  <div class="input-wrapper">
                    <span class="input-tips">收货地址</span>
                    <input v-model="newUser.email" type="email" class="ipt" placeholder="可暂且跳过">
                  </div>
                  <div class="navigation-buttons">
                    <button class="btn prev-btn" @click="prevStep">上一步</button>
                    <button class="btn register-btn" :disabled="!agreeTerms" @click="completeRegistration">完成注册</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 登录按钮 -->
          <span class="login-link" @click="toggleToLogin">
            {{ isLoginPage ? "Not register yet? Create An Account" : "已有账户? 立即登录" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted , watch } from 'vue';import
{ ElNotification } from 'element-plus';
import { type NewUserVO, registerUserApi } from '@/api/register/RegisterApi.ts';
import { type LoginUserVO, loginUserApi } from '@/api/login/LoginApi.ts';
import router from '@/router';
import type { ObjectFitProperty } from 'csstype';
import axios from 'axios'
import { useSuserStore } from '@/stores/userStore';
import { LRStore } from '@/stores/LRStore';

const lrStore = LRStore();


const state = reactive({
  fits: [
    'cover',
  ] as ObjectFitProperty[],
  url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
});
const { fits, url } = toRefs(state);

// 切换登录和注册状态
const isLoginPage = ref(true);
// 是否显示密码
const isPasswordVisible = ref(false);
// 注册步骤
const activeStep = ref(0);
// 是否同意条款
const agreeTerms = ref(false);

const newUser = ref<NewUserVO>({ nickname: '', account: '', password: '', phone: '', email: '' });
const uselogin = ref<LoginUserVO>({ userName: '', password: '' });

// 通知弹窗函数
const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'info' | 'error' | 'primary') => {
  ElNotification({
    title,
    message,
    type,
    duration: 3000,
    position: 'top-right'
  });
};

// 切换到注册页面
function toggleToRegister() {
  isLoginPage.value = false;
  activeStep.value = 0; // 重置注册步骤
  agreeTerms.value = false; // 重置条款同意状态
  newUser.value = { nickname: '', account: '', password: '', phone: '', email: '' };
}

// 切换到登录页面
function toggleToLogin() {
  isLoginPage.value = true;
  newUser.value = {
    nickname: '',
    account: '',
    password: '',
    phone: '',
    email: ''
  };
}

// 下一步
function nextStep() {
  if (activeStep.value < 2) {
    activeStep.value += 1;
  }
}

// 上一步
function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value -= 1;
  }
}

async function completeRegistration() {
  try {
    const result = await registerUserApi(newUser.value);
    console.log('注册成功:', result);
    showNotification('成功', '注册成功，请登录', 'success');
    toggleToLogin();
  } catch (error) {
    console.error('注册失败:', error);
    showNotification('错误', '注册失败，请重试', 'error');
  }
}

async function handleLogin() {
  const { userName, password } = uselogin.value;


  if (!userName || !password) {
    showNotification('警告', '账号或密码不能为空', 'warning');
    return;
  }

  try {
    const result = await loginUserApi(uselogin.value);
    console.log(result);

    if (result.code === 200) {
      localStorage.setItem('token', result.token);
      const userStore = useSuserStore();
      userStore.setUserData(result as any);
      console.log(userStore.userData);
      showNotification('成功', '登录成功，正在跳转...', 'success');
      router.push('/');
    } else if (result.message === '用户名错误！' || result.message === '密码错误！') {
      showNotification('错误', result.message, 'error');
    } else {
      showNotification('错误', '登录失败，请重试', 'error');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        showNotification('错误', '请求超时，请检查网络连接或稍后再试', 'error');
      } else if (error.code === 'ERR_NETWORK') {
        showNotification('错误', '网络错误，请检查网络连接', 'error');
      } else {
        showNotification('错误', '登录失败，请重试', 'error');
      }
    } else {
      showNotification('错误', '登录失败，请重试', 'error');
    }
  }
}
onMounted(() => {
  isLoginPage.value = lrStore.isLoginPage;
  console.log(isLoginPage.value);
});
watch(() => lrStore.isLoginPage, (newValue) => {
  isLoginPage.value = newValue;
  console.log(newValue);
});
</script>

<style lang="scss" >
@use 'resources/style.scss';

@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

</style>

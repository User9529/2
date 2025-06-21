<template>
  <div class="content">
    <div class="introduce">
      <div class="introduce-content">
        <!-- 判断是登录页面还是注册页面，来显示不同的内容 -->
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
        <!-- 判断是登录页面还是注册页面 -->
        <h1 v-if="isLoginPage">Login</h1>
        <h1 v-else>Register</h1>
        <span v-if="isLoginPage" class="login-tips">
          Measure the performance of cryptos,get big profits!
        </span>
        <span v-else class="login-tips">
          开始您的加密货币之旅!
        </span>
        <!-- 登录页面 -->
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
            <!-- 登录表单内容 -->
            <div class="input-wrapper">
              <span class="input-tips">账号</span>
              <input type="text" class="ipt" placeholder="311***@qq.com">
            </div>
            <div class="input-wrapper">
              <span class="input-tips">密码</span>
              <div style="position: relative;">
                <input
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
            <div class="other-setting">
              <div class="rem-pwd">
                <input type="checkbox">
                <span>Remember me</span>
              </div>
              <span class="forget-pwd">
                Forget password
              </span>
            </div>
            <button class="btn">Login</button>
          </div>
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
              <el-step />
              <el-step />
              <el-step />
            </el-steps>
          </div>

          <div class="form-content">
            <!-- 第一步 -->
            <div v-if="activeStep === 0">
              <div class="form">
                <!-- 登录表单内容 -->
                <div class="input-wrapper">
                  <span class="input-tips">账号</span>
                  <input type="text" class="ipt" placeholder="311***@qq.com">
                </div>
                <div class="input-wrapper">
                  <span class="input-tips">密码</span>
                  <div style="position: relative;">
                    <input
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
                <button class="btn next-btn" @click="nextStep">下一步</button>

              </div>
            </div>
            <!-- 第二步 -->
            <div v-if="activeStep === 1">
              <div class="form">
              <div class="input-wrapper">
                <span class="input-tips">电话</span>
                <input type="tel" class="ipt" placeholder="+86 123 4567 8910">
              </div>
              <div class="input-wrapper">
                <span class="input-tips">邮箱</span>
                <input type="email" class="ipt" placeholder="example@mail.com">
              </div>

              <div class="navigation-buttons">
                <button class="btn prev-btn" @click="prevStep">上一步</button>
                <button class="btn next-btn" @click="nextStep">下一步</button>
              </div>
            </div>
          </div>
            <!-- 第三步 -->
            <div class="form">
            <div v-if="activeStep === 2">
              <div class="agreement">
                <input type="checkbox" v-model="agreeTerms">
                <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私政策</a></span>
              </div>
              <div class="navigation-buttons">
                <button class="btn prev-btn" @click="prevStep">上一步</button>
                <button class="btn register-btn" :disabled="!agreeTerms" @click="completeRegistration">完成注册</button>
              </div>
            </div>
          </div>
        </div>
          <!-- 返回登录按钮 -->
          <span class="login-link" @click="toggleToLogin">
            {{ isLoginPage ? "Not register yet? Create An Account" : "已有账户? 立即登录" }}
          </span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
// 切换登录和注册状态
const isLoginPage = ref(true);
// 是否显示密码
const isPasswordVisible = ref(false);
// 注册步骤
const activeStep = ref(0);
// 是否同意条款
const agreeTerms = ref(false);

// 切换到注册页面
function toggleToRegister() {
  isLoginPage.value = false;
  activeStep.value = 0; // 重置注册步骤
  agreeTerms.value = false; // 重置条款同意状态
  // 这里可以添加重置注册表单的逻辑
}

// 切换到登录页面
function toggleToLogin() {
  isLoginPage.value = true;
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

// 完成注册
function completeRegistration() {
  if (agreeTerms.value) {
    console.log('完成注册流程');
    // 这里添加实际的注册逻辑
  }
}

</script>

<style lang="scss" >

@use 'resources/style.scss';

@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';



</style>

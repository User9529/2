// stores/LRStore.ts
import { defineStore } from 'pinia';

export const LRStore = defineStore('lr', {
  state: () => ({
    isLoginPage: true,
    redirectPath: '/' // 新增：保存登录后要跳转的路径
  }),
  actions: {
    toggleToLogin() {
      this.isLoginPage = true;
    },
    toggleToRegister() {
      this.isLoginPage = false;
    },
    setRedirectPath(path: string) { // 新增：设置重定向路径
      this.redirectPath = path;
    },
    clearRedirectPath() { // 新增：清除重定向路径
      this.redirectPath = '/';
    }
  }
});

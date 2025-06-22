import { defineStore } from 'pinia';

export const LRStore = defineStore('auth', {
  state: () => ({
    isLoginPage: true,
  }),
  actions: {
    toggleToRegister() {
      this.isLoginPage = false;
    },
    toggleToLogin() {
      this.isLoginPage = true;
    },
  },
});

import { defineStore } from 'pinia';

export const ThemeStore = defineStore('theme', {
  state: () => ({
    isBackground1: false,
  }),
  actions: {
    toggleTheme() {
      this.isBackground1 = !this.isBackground1;
    },
  },
});

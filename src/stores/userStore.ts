import { defineStore } from 'pinia';

interface userResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    username: string;
    token: string;
  };
}

/**
 * 存储用户中包括token的信息,以便使用token判断
 **/

export const useSuserStore = defineStore('suser', {
  state: () => ({
    // 从localStorage获取初始数据，若无则为null
    userData: localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')!)
      : null as userResponse | null
  }),
  actions: {
    setUserData(data: userResponse) {
      this.userData = data;
      // 保存到localStorage
      localStorage.setItem('userData', JSON.stringify(data));
    },
    clearUserData() {
      this.userData = null;
      // 清除localStorage中的数据
      localStorage.removeItem('userData');
    }
  },
  getters: {
    getUserInfo: (state) => state.userData?.data,
    getToken: (state) => state.userData?.data.token
  }
});

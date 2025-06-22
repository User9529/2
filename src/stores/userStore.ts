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
 *
 * 存储用户中包括token的信息,以便使用token判断
 *
 **/

export const useSuserStore = defineStore('suser', {
  state: () => ({
    userData: null as userResponse | null
  }),
  actions: {
    setUserData(data: userResponse) {
      this.userData = data;
    },
    clearUserData() {
      this.userData = null;
    }
  },
  getters: {
    getUserInfo: (state) => state.userData?.data,
    getToken: (state) => state.userData?.data.token
  }
});

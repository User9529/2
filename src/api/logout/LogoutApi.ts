// src/api/login/LogoutApi.ts
import axios from 'axios';

const LOGOUT_API_URL = 'http://localhost:8081/tCustomer/logout'; // 替换为实际的后端登出接口地址

export const logoutApi = async (token: string) => {
  try {
    const response = await axios.post(LOGOUT_API_URL, { token }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

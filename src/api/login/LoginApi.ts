import axios from 'axios';
import qs from 'qs';

// 定义登录所需的用户信息接口
export interface LoginUserVO {
  userName: string;
  password: string;
}

// 定义登录 API 的 URL
const LOGIN_API_URL = 'http://localhost:8081/tCustomer/login';
// 定义登录函数
export const loginUserApi = async (user: LoginUserVO) => {
  try {
    const data = qs.stringify(user);
    // 发送 POST 请求到登录 API，并设置Content-Type
    const response = await axios.post<{ token: string }>(LOGIN_API_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

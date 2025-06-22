import axios from 'axios';

export interface NewUserVO {
  name: string;
  userName: string;
  password: string;
  address: string;
}

const REGISTER_API_URL = 'http://127.0.0.1:8081/tCustomer/register';

export const registerUserApi = async (user: NewUserVO) => {
  try {
    console.log(user)
    const response = await axios.post<{ token: string }>(REGISTER_API_URL, user, {
      headers: {
        'Content-Type': 'application/json' // 设置请求头为 JSON 格式
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

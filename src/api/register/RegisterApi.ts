import axios from 'axios';

export interface NewUserVO {
  nickname: string;
  account: string;
  password: string;
  phone: string;
  email: string;
}

const REGISTER_API_URL = 'http://127.0.0.1:8080/user/register';

export const registerUserApi = async (user: NewUserVO) => {
  try {
    console.log(user)
    const response = await axios.post<NewUserVO>(REGISTER_API_URL, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

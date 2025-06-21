// 基础响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 登录响应数据
export interface LoginResponseData {
  id: number;
  name: string;
  username: string;
  token: string;
}

// 用户信息
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

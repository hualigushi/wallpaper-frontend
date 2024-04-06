import axios, { AxiosInstance } from 'axios';

// 配置新建一个 axios 实例
const axiosInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 导出 axios 实例
export default axiosInstance;

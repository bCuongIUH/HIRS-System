// 📁 src/api/axiosInstance.js
import axios from "axios"

const API_URL = "http://localhost:5000/api" // ⚙️ chỉnh đúng port BE

// Tạo instance riêng biệt
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// ✅ Interceptor: tự thêm token cho mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance

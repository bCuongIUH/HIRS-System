import axios from "axios"

// Cấu hình axios
const API_URL = "http://localhost:5000/api"

// Cấu hình axios với credentials
axios.defaults.withCredentials = true

// Hàm thiết lập token cho các request
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

// Khởi tạo token từ localStorage khi trang được tải
const token = localStorage.getItem("token")
if (token) {
  setAuthToken(token)
}

// Tạo instance axios với cấu hình chung
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userId")
      localStorage.removeItem("isAuthenticated")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api

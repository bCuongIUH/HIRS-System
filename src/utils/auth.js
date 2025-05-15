import axios from "axios"

// Cấu hình axios
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Hàm đăng nhập
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })

    if (response.data.success && response.data.token) {
      // Lấy thông tin người dùng
      const userResponse = await getUserProfile(response.data.token)

      return {
        success: true,
        token: response.data.token,
        user: userResponse,
      }
    } else {
      throw new Error("Đăng nhập thất bại")
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại."
    throw new Error(errorMessage)
  }
}

// Hàm lấy thông tin người dùng hiện tại
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error("Không thể lấy thông tin người dùng")
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin người dùng")
  }
}

// Hàm đăng xuất
export const logoutUser = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userRole")
  localStorage.removeItem("userName")
  localStorage.removeItem("userId")
  localStorage.removeItem("isAuthenticated")
}

// Hàm kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

// Hàm kiểm tra xem người dùng có phải là admin không
export const isAdmin = () => {
  return localStorage.getItem("userRole") === "admin"
}

// Hàm thiết lập token cho các request
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

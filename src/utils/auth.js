
import axios from "axios"

const API_URL = "http://localhost:5000/api" // ⚙️ chỉnh port nếu BE khác

// Tự động gửi cookie khi cần
axios.defaults.withCredentials = true

// ===============================
// 🔹 LOGIN
// ===============================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })

    if (response.data.success && response.data.token) {
      const { token, user } = response.data

      // ✅ Lưu thông tin vào localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", user.role)
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isAuthenticated", "true")

      // ✅ Gán token cho axios
      setAuthToken(token)

      return { success: true, token, user }
    } else {
      throw new Error("Đăng nhập thất bại.")
    }
  } catch (error) {
    console.error("Login error:", error.response || error)
    throw new Error(error.response?.data?.error || "Đăng nhập thất bại.")
  }
}

// ===============================
// 🔹 LẤY THÔNG TIN USER
// ===============================
export const getUserProfile = async (token) => {
  const useToken = token || localStorage.getItem("token")
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${useToken}` },
  })
  return response.data.data
}

// ===============================
// 🔹 LOGOUT
// ===============================
export const logoutUser = async () => {
  try {
    await axios.get(`${API_URL}/auth/logout`)
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    localStorage.clear()
    delete axios.defaults.headers.common["Authorization"]
  }
}

// ===============================
// 🔹 KIỂM TRA LOGIN
// ===============================
export const isAuthenticated = () => !!localStorage.getItem("token")
export const isAdmin = () => localStorage.getItem("userRole") === "admin"
export const isEmployee = () => localStorage.getItem("userRole") === "employee"

// ===============================
// 🔹 SET TOKEN CHO AXIOS
// ===============================
export const setAuthToken = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  else delete axios.defaults.headers.common["Authorization"]
}

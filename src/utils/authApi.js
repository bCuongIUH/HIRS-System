import axios from "axios"

const API_URL = "/api/auth"

// Đăng nhập
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  return response.data
}

// Đăng xuất
export const logout = async () => {
  const response = await axios.get(`${API_URL}/logout`)
  return response.data
}

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`)
  return response.data
}

// Cập nhật thông tin người dùng
export const updateUserDetails = async (userData) => {
  const response = await axios.put(`${API_URL}/updatedetails`, userData)
  return response.data
}

// Cập nhật mật khẩu
export const updatePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/updatepassword`, passwordData)
  return response.data
}

// Quên mật khẩu
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgotpassword`, { email })
  return response.data
}

// Đặt lại mật khẩu
export const resetPassword = async (resetToken, password) => {
  const response = await axios.put(`${API_URL}/resetpassword/${resetToken}`, { password })
  return response.data
}

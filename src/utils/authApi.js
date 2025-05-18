import api from "./api"

// Hàm gửi yêu cầu đặt lại mật khẩu
export const forgotPassword = async (email) => {
  try {
    console.log("Sending forgot password request for email:", email)
    const response = await api.post("/auth/forgotpassword", { email })
    console.log("Forgot password response:", response.data)
    return response.data
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.error || "Không thể gửi yêu cầu đặt lại mật khẩu")
  }
}

// Hàm đặt lại mật khẩu
export const resetPassword = async (resettoken, password) => {
  try {
    console.log("Sending reset password request with token:", resettoken)
    const response = await api.put(`/auth/resetpassword/${resettoken}`, { password })
    console.log("Reset password response:", response.data)
    return response.data
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.error || "Không thể đặt lại mật khẩu")
  }
}

// Hàm cập nhật mật khẩu
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/auth/updatepassword", { currentPassword, newPassword })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Không thể cập nhật mật khẩu")
  }
}

// Hàm đăng nhập
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Đăng nhập thất bại")
  }
}

// Hàm đăng xuất
export const logout = async () => {
  try {
    const response = await api.get("/auth/logout")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Đăng xuất thất bại")
  }
}

// Hàm lấy thông tin người dùng hiện tại
export const getMe = async () => {
  try {
    const response = await api.get("/auth/me")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Không thể lấy thông tin người dùng")
  }
}

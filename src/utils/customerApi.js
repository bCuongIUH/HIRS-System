import api from "./api"
// 👉 Thêm interceptor để gắn token vào tất cả request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// Lấy danh sách khách hàng
export const getCustomers = async (params = {}) => {
  try {
    const response = await api.get("/customer", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách khách hàng")
  }
}

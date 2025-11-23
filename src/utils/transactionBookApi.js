import api from "./api"
// 👉 Thêm interceptor để gắn token vào tất cả request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// Lấy danh sách giao dịch
export const getAllTransaction = async (params = {}) => {
  try {
    const response = await api.get("/transactionBook", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách giao dịch")
  }
}

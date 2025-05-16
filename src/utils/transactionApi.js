import api from "./api"

// Lấy danh sách giao dịch/thông báo
export const getTransactions = async (params = {}) => {
  try {
    const response = await api.get("/transactions", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách thông báo")
  }
}

// Lấy các thông báo gần đây
export const getRecentTransactions = async () => {
  try {
    const response = await api.get("/transactions/recent")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông báo gần đây")
  }
}

// Đánh dấu thông báo đã đọc
export const markAsRead = async (id) => {
  try {
    const response = await api.put(`/transactions/${id}/read`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi đánh dấu thông báo đã đọc")
  }
}

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async () => {
  try {
    const response = await api.put("/transactions/read-all")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi đánh dấu tất cả thông báo đã đọc")
  }
}

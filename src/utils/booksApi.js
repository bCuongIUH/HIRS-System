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
export const getBooks = async (params = {}) => {
  try {
    const response = await api.get("/books", { params });  // Gọi API /books
    return response.data;  // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách sách");
  }
};
export const getStatisticsTop = async (params = {}) => {
  try {
    const response = await api.get("/statistics/top", { params });
    return response.data;  // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách sách");
  }
};

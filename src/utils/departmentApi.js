import api from "./api"

// Lấy danh sách phòng ban
export const getDepartments = async (params = {}) => {
  try {
    const response = await api.get("/departments", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách phòng ban")
  }
}

// Lấy thông tin chi tiết phòng ban
export const getDepartment = async (id) => {
  try {
    const response = await api.get(`/departments/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin phòng ban")
  }
}

// Thêm phòng ban mới
export const addDepartment = async (departmentData) => {
  try {
    const response = await api.post("/departments", departmentData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi thêm phòng ban mới")
  }
}

// Cập nhật thông tin phòng ban
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await api.put(`/departments/${id}`, departmentData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi cập nhật thông tin phòng ban")
  }
}

// Xóa phòng ban
export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi xóa phòng ban")
  }
}

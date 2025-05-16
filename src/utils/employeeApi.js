import api from "./api"

// Lấy danh sách nhân viên
export const getEmployees = async (params = {}) => {
  try {
    const response = await api.get("/employees", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách nhân viên")
  }
}

// Lấy thông tin chi tiết nhân viên
export const getEmployee = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin nhân viên")
  }
}

// Thêm nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employees", employeeData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi thêm nhân viên mới")
  }
}

// Cập nhật thông tin nhân viên
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi cập nhật thông tin nhân viên")
  }
}

// Xóa nhân viên
export const deleteEmployee = async (id, options = {}) => {
  try {
    const response = await api.delete(`/employees/${id}`, { data: options })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi xóa nhân viên")
  }
}

// Lấy nhân viên theo phòng ban
export const getEmployeesByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/employees/department/${departmentId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy nhân viên theo phòng ban")
  }
}

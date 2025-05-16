import api from "./api"

// Lấy danh sách bảng lương
export const getPayrolls = async (params = {}) => {
  try {
    const response = await api.get("/payrolls", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách bảng lương")
  }
}

// Lấy thông tin chi tiết bảng lương
export const getPayroll = async (id) => {
  try {
    const response = await api.get(`/payrolls/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin bảng lương")
  }
}

// Tính lương cho nhân viên
export const calculatePayroll = async (payrollData) => {
  try {
    const response = await api.post("/payrolls/calculate", payrollData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi tính lương")
  }
}

// Phê duyệt bảng lương
export const approvePayroll = async (id) => {
  try {
    const response = await api.put(`/payrolls/${id}/approve`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi phê duyệt bảng lương")
  }
}

// Thanh toán bảng lương
export const payPayroll = async (id, paymentData) => {
  try {
    const response = await api.put(`/payrolls/${id}/pay`, paymentData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi thanh toán bảng lương")
  }
}

// Hủy bảng lương
export const cancelPayroll = async (id) => {
  try {
    const response = await api.put(`/payrolls/${id}/cancel`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi hủy bảng lương")
  }
}

// Lấy thống kê bảng lương
export const getPayrollStats = async () => {
  try {
    const response = await api.get("/payrolls/stats")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thống kê bảng lương")
  }
}

// Lấy bảng lương theo nhân viên
export const getEmployeePayrolls = async (employeeId) => {
  try {
    const response = await api.get(`/payrolls/employee/${employeeId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy bảng lương của nhân viên")
  }
}

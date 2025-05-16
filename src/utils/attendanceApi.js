import api from "./api"

// Lấy thông tin chấm công của nhân viên hiện tại
export const getMyAttendance = async () => {
  try {
    const response = await api.get("/attendance/me")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin chấm công")
  }
}

// Chấm công vào
export const clockIn = async (location = null) => {
  try {
    const response = await api.post("/attendance/clock-in", { location })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi chấm công vào")
  }
}

// Chấm công ra
export const clockOut = async (location = null) => {
  try {
    const response = await api.post("/attendance/clock-out", { location })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi chấm công ra")
  }
}

// Lấy danh sách chấm công (cho admin)
export const getAttendances = async (params = {}) => {
  try {
    const response = await api.get("/attendance", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy danh sách chấm công")
  }
}

// Lấy báo cáo chấm công (cho admin)
export const getAttendanceReport = async (params = {}) => {
  try {
    const response = await api.get("/attendance/report", { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy báo cáo chấm công")
  }
}

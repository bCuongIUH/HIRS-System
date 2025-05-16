import api from "./api"

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStats = async () => {
  try {
    // Lấy số lượng nhân viên
    const employeesResponse = await api.get("/employees", {
      params: {
        limit: 1,
      },
    })
    const totalEmployees = employeesResponse.data.pagination?.total || 0

    // Lấy thống kê bảng lương
    const payrollStatsResponse = await api.get("/payrolls/stats")
    const payrollStats = payrollStatsResponse.data.data

    // Lấy thông báo gần đây
    const transactionsResponse = await api.get("/transactions/recent")
    const recentActivities = transactionsResponse.data.data

    return {
      totalEmployees,
      payrollStats,
      recentActivities,
    }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thống kê dashboard")
  }
}

// Lấy thống kê nhân viên theo phòng ban
export const getEmployeesByDepartment = async () => {
  try {
    const response = await api.get("/departments")
    const departments = response.data.data

    // Lấy số lượng nhân viên cho mỗi phòng ban
    const departmentStats = []
    for (const department of departments) {
      const employeesResponse = await api.get(`/employees/department/${department._id}`)
      departmentStats.push({
        name: department.name,
        total: employeesResponse.data.count,
      })
    }

    return departmentStats
  } catch (error) {
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thống kê nhân viên theo phòng ban")
  }
}

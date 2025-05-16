"use client"

import { useState, useEffect } from "react"
import { Calendar, Filter, Download, Clock, User, Building } from "lucide-react"
import { getAttendanceReport } from "../utils/attendanceApi"
import { getDepartments } from "../utils/departmentApi"
import { getEmployees } from "../utils/employeeApi"

function Attendance() {
  const [attendances, setAttendances] = useState([])
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    department: "",
    employee: "",
    status: "",
  })

  // Lấy dữ liệu chấm công, phòng ban và nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Lấy danh sách phòng ban
        const departmentsResponse = await getDepartments()
        setDepartments(departmentsResponse.data)

        // Lấy danh sách nhân viên
        const employeesResponse = await getEmployees()
        setEmployees(employeesResponse.data)

        // Lấy dữ liệu chấm công
        await fetchAttendances()
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Lấy dữ liệu chấm công theo bộ lọc
  const fetchAttendances = async () => {
    try {
      setIsLoading(true)
      const response = await getAttendanceReport(filters)
      setAttendances(response.data)
    } catch (error) {
      console.error("Error fetching attendances:", error)
      setError("Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý áp dụng bộ lọc
  const handleApplyFilters = (e) => {
    e.preventDefault()
    fetchAttendances()
  }

  // Xử lý xuất báo cáo
  const handleExportReport = () => {
    // Tạo dữ liệu CSV
    const headers = ["Ngày", "Nhân viên", "Phòng ban", "Giờ vào", "Giờ ra", "Tổng giờ", "Trạng thái"]

    const csvData = attendances.map((item) => {
      const employee = item.employee
      return [
        new Date(item.date).toLocaleDateString("vi-VN"),
        `${employee.firstName} ${employee.lastName}`,
        employee.department?.name || "",
        item.timeIn ? new Date(item.timeIn).toLocaleTimeString() : "",
        item.timeOut ? new Date(item.timeOut).toLocaleTimeString() : "",
        item.totalHours || "",
        getStatusText(item.status),
      ]
    })

    // Thêm header vào đầu
    csvData.unshift(headers)

    // Chuyển đổi thành chuỗi CSV
    const csvString = csvData.map((row) => row.join(",")).join("\n")

    // Tạo blob và tải xuống
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format thời gian
  const formatTime = (date) => {
    if (!date) return "--:--:--"
    return new Date(date).toLocaleTimeString()
  }

  // Format ngày
  const formatDate = (date) => {
    if (!date) return "--/--/----"
    return new Date(date).toLocaleDateString("vi-VN")
  }

  // Lấy text trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case "present":
        return "Đúng giờ"
      case "late":
        return "Đi muộn"
      case "early_leave":
        return "Về sớm"
      case "absent":
        return "Vắng mặt"
      case "incomplete":
        return "Chưa hoàn thành"
      default:
        return "Không xác định"
    }
  }

  // Hiển thị trạng thái chấm công
  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Đúng giờ</span>
      case "late":
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Đi muộn</span>
      case "early_leave":
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Về sớm</span>
      case "absent":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Vắng mặt</span>
      case "incomplete":
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Chưa hoàn thành</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Không xác định</span>
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý Chấm công</h1>
        <button
          onClick={handleExportReport}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          Bộ lọc
        </h2>
        <form onSubmit={handleApplyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả phòng ban</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                Nhân viên
              </label>
              <select
                id="employee"
                name="employee"
                value={filters.employee}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả nhân viên</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="present">Đúng giờ</option>
                <option value="late">Đi muộn</option>
                <option value="early_leave">Về sớm</option>
                <option value="absent">Vắng mặt</option>
                <option value="incomplete">Chưa hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </form>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : attendances.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Không có dữ liệu chấm công</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nhân viên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phòng ban
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giờ vào
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giờ ra
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng giờ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.employee.firstName} {item.employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{item.employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">{item.employee.department?.name || "--"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {item.timeIn ? formatTime(item.timeIn) : "--:--:--"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {item.timeOut ? formatTime(item.timeOut) : "--:--:--"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalHours ? `${item.totalHours} giờ` : "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusLabel(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Attendance

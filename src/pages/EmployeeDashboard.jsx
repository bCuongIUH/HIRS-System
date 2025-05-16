"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, LogOut, Calendar, CheckCircle, AlertTriangle, Info } from "lucide-react"

function EmployeeDashboard() {
  const [attendance, setAttendance] = useState(null)
  const [recentAttendances, setRecentAttendances] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      navigate("/employee/login")
    } else if (userRole === "admin") {
      navigate("/dashboard")
    }
  }, [navigate])

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Giả lập dữ liệu chấm công
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu
    const today = new Date()

    // Giả lập dữ liệu chấm công hôm nay
    const mockAttendance = {
      _id: "att123",
      date: today,
      timeIn: localStorage.getItem("timeIn") ? new Date(localStorage.getItem("timeIn")) : null,
      timeOut: localStorage.getItem("timeOut") ? new Date(localStorage.getItem("timeOut")) : null,
      totalHours: localStorage.getItem("totalHours") || null,
      status: localStorage.getItem("status") || "incomplete",
    }

    setAttendance(mockAttendance)

    // Giả lập dữ liệu chấm công gần đây
    const mockRecentAttendances = [
      {
        _id: "att122",
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Hôm qua
        timeIn: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8:00 AM hôm qua
        timeOut: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5:00 PM hôm qua
        totalHours: 9,
        status: "present",
      },
      {
        _id: "att121",
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
        timeIn: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 8.5 * 60 * 60 * 1000), // 8:30 AM
        timeOut: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5:00 PM
        totalHours: 8.5,
        status: "late",
      },
      {
        _id: "att120",
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
        timeIn: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8:00 AM
        timeOut: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 4:00 PM
        totalHours: 8,
        status: "early_leave",
      },
    ]

    setRecentAttendances(mockRecentAttendances)
  }, [])

  // Xử lý chấm công vào
  const handleClockIn = async () => {
    try {
      setIsLoading(true)

      // Giả lập API chấm công vào
      // Trong thực tế, bạn sẽ gọi API để lưu dữ liệu
      const now = new Date()
      const workStartTime = new Date(now)
      workStartTime.setHours(8, 0, 0, 0) // 8:00 AM

      // Xác định trạng thái (đúng giờ hay đi muộn)
      const status = now > workStartTime ? "late" : "present"

      // Lưu vào localStorage (giả lập database)
      localStorage.setItem("timeIn", now.toString())
      localStorage.setItem("status", status)

      // Cập nhật state
      setAttendance({
        ...attendance,
        timeIn: now,
        status: status,
      })

      setMessage({
        type: "success",
        text: "Chấm công vào thành công!",
      })

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error clocking in:", error)
      setMessage({
        type: "error",
        text: "Lỗi khi chấm công vào. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý chấm công ra
  const handleClockOut = async () => {
    try {
      setIsLoading(true)

      // Giả lập API chấm công ra
      // Trong thực tế, bạn sẽ gọi API để lưu dữ liệu
      const now = new Date()
      const timeIn = new Date(localStorage.getItem("timeIn"))
      const workEndTime = new Date(now)
      workEndTime.setHours(17, 0, 0, 0) // 5:00 PM

      // Tính tổng giờ làm việc
      const totalHours = ((now - timeIn) / (1000 * 60 * 60)).toFixed(1)

      // Xác định trạng thái (về sớm hay đúng giờ)
      let status = localStorage.getItem("status")
      if (now < workEndTime) {
        status = "early_leave"
      }

      // Lưu vào localStorage (giả lập database)
      localStorage.setItem("timeOut", now.toString())
      localStorage.setItem("totalHours", totalHours)
      localStorage.setItem("status", status)

      // Cập nhật state
      setAttendance({
        ...attendance,
        timeOut: now,
        totalHours: totalHours,
        status: status,
      })

      setMessage({
        type: "success",
        text: "Chấm công ra thành công!",
      })

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error clocking out:", error)
      setMessage({
        type: "error",
        text: "Lỗi khi chấm công ra. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    navigate("/employee/login")
  }

  // Format thời gian
  const formatTime = (date) => {
    if (!date) return "--:--:--"
    const d = new Date(date)
    return d.toLocaleTimeString()
  }

  // Format ngày
  const formatDate = (date) => {
    if (!date) return "--/--/----"
    const d = new Date(date)
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Hiển thị trạng thái chấm công
  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return <span className="text-green-600">Đúng giờ</span>
      case "late":
        return <span className="text-yellow-600">Đi muộn</span>
      case "early_leave":
        return <span className="text-orange-600">Về sớm</span>
      case "absent":
        return <span className="text-red-600">Vắng mặt</span>
      case "incomplete":
        return <span className="text-gray-600">Chưa hoàn thành</span>
      default:
        return <span className="text-gray-600">Không xác định</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">Hệ thống Chấm công</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-gray-900">
            <LogOut className="h-5 w-5 mr-1" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Thông báo */}
        {message && (
          <div
            className={`mb-6 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            } px-4 py-3 rounded-lg flex items-center`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Thông tin nhân viên */}
        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{localStorage.getItem("userName") || "Nhân viên"}</h2>
              <p className="text-gray-500">{localStorage.getItem("userEmail") || ""}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-600">{currentTime.toLocaleTimeString()}</div>
              <div className="text-gray-500">
                {currentTime.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Chấm công */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Thẻ chấm công */}
          <div className="bg-white rounded-lg border shadow-sm p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Chấm công hôm nay</h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Giờ vào</div>
                    <div className="text-2xl font-bold">
                      {attendance?.timeIn ? formatTime(attendance.timeIn) : "--:--:--"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Giờ ra</div>
                    <div className="text-2xl font-bold">
                      {attendance?.timeOut ? formatTime(attendance.timeOut) : "--:--:--"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Tổng giờ làm việc</div>
                    <div className="text-2xl font-bold">
                      {attendance?.totalHours ? `${attendance.totalHours} giờ` : "--"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Trạng thái</div>
                    <div className="text-2xl font-bold">{attendance ? getStatusLabel(attendance.status) : "--"}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleClockIn}
                    disabled={isLoading || (attendance && attendance.timeIn)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Chấm công vào
                  </button>
                  <button
                    onClick={handleClockOut}
                    disabled={isLoading || !attendance || !attendance.timeIn || attendance.timeOut}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Chấm công ra
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Thông tin hữu ích */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Giờ làm việc</h3>
                  <p className="text-sm text-gray-500">8:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Đi muộn</h3>
                  <p className="text-sm text-gray-500">Sau 8:00 sáng</p>
                </div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Về sớm</h3>
                  <p className="text-sm text-gray-500">Trước 17:00 chiều</p>
                </div>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Hỗ trợ</h3>
                  <p className="text-sm text-gray-500">Liên hệ phòng nhân sự: hr@company.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử chấm công */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Lịch sử chấm công gần đây</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recentAttendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Không có dữ liệu chấm công gần đây</p>
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
                  {recentAttendances.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.timeIn ? formatTime(item.timeIn) : "--:--:--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.timeOut ? formatTime(item.timeOut) : "--:--:--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalHours ? `${item.totalHours} giờ` : "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusLabel(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 HRIS System. Bản quyền thuộc về Công ty TNHH Cuong Dev.
        </div>
      </footer>
    </div>
  )
}

export default EmployeeDashboard

"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Payroll from "./pages/Payroll"
import PayrollCalculate from "./pages/PayrollCalculate"
import Departments from "./pages/Departments"
import Settings from "./pages/Settings"
import Login from "./pages/Login"

// Bảo vệ route yêu cầu xác thực
const RequireAuth = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập, lưu lại đường dẫn hiện tại
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    // Bạn có thể thêm logic kiểm tra token hết hạn ở đây
  }, [])

  return (
    <Router>
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Route mặc định chuyển hướng đến dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Các route được bảo vệ */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="payroll/calculate" element={<PayrollCalculate />} />
          <Route path="departments" element={<Departments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

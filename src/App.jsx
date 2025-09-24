"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
// import Payroll from "./pages/Payroll"
import PayrollCalculate from "./pages/PayrollCalculate"
import Departments from "./pages/Departments"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
// import EmployeeLogin from "./pages/EmployeeLogin"
// import EmployeeDashboard from "./pages/EmployeeDashboard"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import { setAuthToken } from "./utils/auth"
import AddBookPage from "./pages/AddBookPage"
import WarehousePage from "./pages/WarehousePage"
import CustomerPage from "./pages/CustomerPage"
import Customers from "./pages/CustomerPage"
import Inventory from "./pages/Inventory"
import ImportGoods from "./pages/ImportGoods"
import DetailOrders from "./pages/DetailOrders"
import RevenueDashboard from "./pages/ThongKe"

// Bảo vệ route yêu cầu xác thực cho Admin
const RequireAuth = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const userRole = localStorage.getItem("userRole")

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập, lưu lại đường dẫn hiện tại
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Kiểm tra quyền admin (nếu cần)
  if (userRole !== "admin" && userRole !== "hr") {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Bảo vệ route yêu cầu xác thực cho Nhân viên
const RequireEmployee = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  const userRole = localStorage.getItem("userRole")

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập nhân viên
    return <Navigate to="/employee/login" state={{ from: location }} replace />
  }

  // Cho phép cả admin và employee truy cập
  return children
}

// Component hiển thị khi không có quyền truy cập
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
        <p className="text-gray-600 mb-6">Bạn không có quyền truy cập vào trang này.</p>
        <div className="flex justify-center space-x-4">
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Đăng nhập lại
          </a>
          <a href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  // Thiết lập token cho axios khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={<Login />} />
    
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Route quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:resettoken" element={<ResetPassword />} />

        {/* Route mặc định chuyển hướng đến dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

       

        {/* Các route được bảo vệ cho admin */}
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
          <Route path="addBookPage" element={<AddBookPage />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="import-goods" element={<ImportGoods />} />
          <Route path="orders" element={<DetailOrders />} />
          <Route path="departments" element={<Departments />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="thong-ke" element={<RevenueDashboard />} />
        </Route>

        {/* Route không tồn tại */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App

import { Navigate, useLocation } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"

// Component bảo vệ route, chỉ cho phép người dùng đã đăng nhập truy cập
export const ProtectedRoute = ({ children, requireAdmin = false, requireEmployee = false }) => {
  const location = useLocation()
  const authenticated = isAuthenticated()
  const userRole = localStorage.getItem("userRole")

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!authenticated) {
    return <Navigate to={requireEmployee ? "/employee/login" : "/login"} state={{ from: location }} replace />
  }

  // Nếu yêu cầu quyền admin
  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />
  }

  // Nếu yêu cầu quyền nhân viên
  if (requireEmployee && userRole !== "employee") {
    return <Navigate to="/unauthorized" replace />
  }

  // Nếu đã đăng nhập và có đủ quyền, hiển thị nội dung
  return children
}

export default ProtectedRoute

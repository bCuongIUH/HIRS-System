// import { Navigate, useLocation } from "react-router-dom"
// import { isAuthenticated, isAdmin } from "../utils/auth"

// // Component bảo vệ route, chỉ cho phép người dùng đã đăng nhập truy cập
// export const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   const location = useLocation()
//   const authenticated = isAuthenticated()
//   const admin = isAdmin()

//   // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
//   if (!authenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />
//   }

//   // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
//   if (requireAdmin && !admin) {
//     return <Navigate to="/unauthorized" replace />
//   }

//   // Nếu đã đăng nhập và có đủ quyền, hiển thị nội dung
//   return children
// }

// export default ProtectedRoute

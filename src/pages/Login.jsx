"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Building, Lock, Mail, AlertCircle } from "lucide-react"
import { loginUser } from "../utils/auth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Lấy đường dẫn chuyển hướng sau khi đăng nhập (nếu có)
  const from = location.state?.from?.pathname || "/dashboard"

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (token && userRole === "admin") {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate form
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    try {
      // Gọi API đăng nhập
      const response = await loginUser(email, password)

      console.log("Login response:", response) // Debug: Kiểm tra response

      // Kiểm tra response và user object
      if (!response || !response.user) {
        throw new Error("Không nhận được thông tin người dùng từ server")
      }

      // Kiểm tra role, chỉ cho phép admin truy cập
    if (!response.user.role || !["admin", "employee"].includes(response.user.role)) {
    setError("Bạn không có quyền truy cập vào hệ thống này")
    setIsLoading(false)
      return
  }


      // Lưu thông tin đăng nhập
      localStorage.setItem("token", response.token)
      localStorage.setItem("userRole", response.user.role)
      localStorage.setItem("userName", response.user.name || "Admin")
      localStorage.setItem("userEmail", response.user.email || "")
      localStorage.setItem("userId", response.user.id || "")
      localStorage.setItem("isAuthenticated", "true")

      // Chuyển hướng đến trang dashboard
      navigate("/dashboard", { replace: true })
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Banner bên trái */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between">
        <div className="p-12">
          <div className="flex items-center text-white">
            <Building className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">KT.BookStore</span>
          </div>
        </div>
        <div className="p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Hệ thống Quản lý Book</h1>
          <p className="text-lg opacity-80">
            Giải pháp toàn diện giúp doanh nghiệp, quản lý bán sách hiệu quả.
          </p>
        </div>
        <div className="p-12 text-blue-100 text-sm">© 2025 KT.BookStore.</div>
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center lg:hidden mb-6">
              <Building className="h-8 w-8 mr-2 text-blue-600" />
              <span className="text-2xl font-bold">KT.BookStore</span>
            </div>
            <h1 className="text-3xl font-bold">Đăng nhập</h1>
            <p className="text-gray-500 mt-2">Nhập thông tin đăng nhập để truy cập hệ thống</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Liên hệ quản trị viên
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

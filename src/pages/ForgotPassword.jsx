"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { forgotPassword } from "../utils/authApi"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate email
    if (!email) {
      setError("Vui lòng nhập email của bạn")
      setIsLoading(false)
      return
    }

    try {
      console.log("Submitting forgot password form with email:", email)
      // Gọi API quên mật khẩu
      const response = await forgotPassword(email)

      console.log("Forgot password response:", response)
      if (response.success) {
        setSuccess(true)
      } else {
        throw new Error("Không thể gửi yêu cầu đặt lại mật khẩu")
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(err.message || "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.")
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
            <span className="text-2xl font-bold">HRIS System</span>
          </div>
        </div>
        <div className="p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">Quên mật khẩu?</h1>
          <p className="text-lg opacity-80">Đừng lo lắng! Chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.</p>
        </div>
        <div className="p-12 text-blue-100 text-sm">© 2025 HRIS System. Bản quyền thuộc về Công ty Cuong Dev.</div>
      </div>

      {/* Form quên mật khẩu bên phải */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center lg:hidden mb-6">
              <Building className="h-8 w-8 mr-2 text-blue-600" />
              <span className="text-2xl font-bold">HRIS System</span>
            </div>
            <h1 className="text-3xl font-bold">Quên mật khẩu</h1>
            <p className="text-gray-500 mt-2">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-5 rounded-lg flex flex-col items-center">
                <CheckCircle className="h-12 w-12 mb-3 text-green-500" />
                <h3 className="text-lg font-medium mb-2">Yêu cầu đã được gửi!</h3>
                <p className="text-sm">
                  Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp
                  thư của bạn và làm theo hướng dẫn.
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/employee/login")}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại trang đăng nhập
                </button>
              </div>
            </div>
          ) : (
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
                      placeholder="your-email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang xử lý..." : "Gửi yêu cầu đặt lại mật khẩu"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Nhớ mật khẩu?{" "}
              <a href="/employee/login" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

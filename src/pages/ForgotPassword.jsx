"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { forgotPassword } from "../utils/authApi"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Vui lòng nhập email")
      return
    }

    setIsLoading(true)

    try {
      await forgotPassword(email)
      setEmailSent(true)
      toast.success("Email đặt lại mật khẩu đã được gửi")
    } catch (error) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error)
      toast.error(error.response?.data?.error || "Không thể gửi email đặt lại mật khẩu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h1>
          <p className="text-gray-600 mt-2">
            {!emailSent
              ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
              : "Kiểm tra email của bạn để đặt lại mật khẩu"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
              Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.
            </div>
            <button onClick={() => setEmailSent(false)} className="text-blue-600 hover:text-blue-800 font-medium">
              Gửi lại email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

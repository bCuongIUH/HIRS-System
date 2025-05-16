import axios from "axios"

// Cấu hình axios
const API_URL = "http://localhost:5000/api"

// Cấu hình axios với credentials
axios.defaults.withCredentials = true

// Hàm đăng nhập
export const loginUser = async (email, password) => {
  try {
    console.log("Attempting login with:", { email }) // Debug: Log thông tin đăng nhập

    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true, // Quan trọng để nhận cookie từ server
      },
    )

    console.log("Login API response:", response.data) // Debug: Log response từ API

    if (response.data.success && response.data.token) {
      // Thiết lập token cho các request tiếp theo
      setAuthToken(response.data.token)

      // Kiểm tra cấu trúc response
      if (!response.data.user) {
        // Nếu không có user object trong response, thử lấy từ API /me
        try {
          const userResponse = await getUserProfile(response.data.token)
          return {
            success: true,
            token: response.data.token,
            user: userResponse,
          }
        } catch (userError) {
          console.error("Error fetching user profile:", userError)
          // Nếu không lấy được thông tin user, tạo một user object mặc định
          return {
            success: true,
            token: response.data.token,
            user: {
              id: "unknown",
              name: "User",
              email: email,
              role: "employee", // Giả định role là employee nếu đăng nhập thành công
            },
          }
        }
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      }
    } else {
      throw new Error("Đăng nhập thất bại")
    }
  } catch (error) {
    console.error("Login error:", error.response || error)
    const errorMessage = error.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại."
    throw new Error(errorMessage)
  }
}

// Hàm lấy thông tin người dùng hiện tại
export const getUserProfile = async (token) => {
  try {
    const useToken = token || localStorage.getItem("token")
    if (!useToken) {
      throw new Error("Không tìm thấy token")
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${useToken}`,
      },
      withCredentials: true,
    })

    console.log("User profile response:", response.data) // Debug: Log response

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error("Không thể lấy thông tin người dùng")
    }
  } catch (error) {
    console.error("Get user profile error:", error.response || error)
    throw new Error(error.response?.data?.error || "Lỗi khi lấy thông tin người dùng")
  }
}

// Hàm đăng xuất
export const logoutUser = async () => {
  try {
    // Gọi API đăng xuất
    await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    })
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    localStorage.removeItem("isAuthenticated")

    // Xóa token khỏi header
    delete axios.defaults.headers.common["Authorization"]
  }
}

// Hàm kiểm tra xem người dùng đã đăng nhập chưa
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

// Hàm kiểm tra xem người dùng có phải là admin không
export const isAdmin = () => {
  const userRole = localStorage.getItem("userRole")
  return userRole === "admin"
}

// Hàm kiểm tra xem người dùng có phải là nhân viên không
export const isEmployee = () => {
  const userRole = localStorage.getItem("userRole")
  return userRole === "employee"
}

// Hàm thiết lập token cho các request
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

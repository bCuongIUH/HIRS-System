"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, User } from "lucide-react"
import { logoutUser } from "../utils/auth"
import { useNavigate } from "react-router-dom"

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Lấy thông tin người dùng từ localStorage
  const userName = localStorage.getItem("userName") || "Admin"
  const userEmail = localStorage.getItem("userEmail") || "admin@company.com"

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await logoutUser()
    navigate("/login")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {userName.charAt(0)}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="h-px bg-gray-200 my-1"></div>
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100">
              <User className="h-4 w-4" />
              <span>Hồ sơ</span>
            </button>
            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              <span>Cài đặt</span>
            </button>
            <div className="h-px bg-gray-200 my-1"></div>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu

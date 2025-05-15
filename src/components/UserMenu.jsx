"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, User } from "lucide-react"

function UserMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src="https://cdn.mobilecity.vn/mobilecity-vn/images/2024/12/hinh-anh-con-lon-sieu-de-thuong-29.png.webp"
          alt="Avatar"
          className="h-8 w-8 rounded-full"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/12/hinh-anh-con-lon-sieu-de-thuong-29.png.webp"
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">Nguyễn Văn Admin</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
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
              onClick={onLogout}
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

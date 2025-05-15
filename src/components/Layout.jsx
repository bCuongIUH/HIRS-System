"use client"

import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Thêm hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    navigate("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

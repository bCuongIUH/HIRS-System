"use client"

import { NavLink } from "react-router-dom"
import { BarChart3, Users, CalendarClock, Receipt, Calculator, Settings, Building, LogOut, Book, Warehouse, ListOrdered, User2, BarChart2 } from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Nhân viên",
    href: "/employees",
    icon: User2,
  },
   {
    title: "Khách hàng",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Sản phẩm",
    href: "/addBookPage",
    icon: Book,
  },
  {
    title: "Kho hàng",
    href: "/inventory",
    icon: Warehouse,
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    icon: ListOrdered,
  },
  {
    title: "Thống Kê",
    href: "/thong-ke",
    icon: BarChart2,
  },
  // {
  //   title: "Cài đặt",
  //   href: "/settings",
  //   icon: Settings,
  // },
]

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6 text-blue-600" />
              <span className="text-xl">Book Store</span>
            </NavLink>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {sidebarLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={index}
                    to={link.href}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-blue-600 my-1
                      ${isActive ? "bg-gray-100 text-blue-600" : "text-gray-500"}
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-600">
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

"use client"

import { useState } from "react"
import { Bell, Menu, Search, X } from "lucide-react"
import UserMenu from "./UserMenu"

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <button
        className="md:hidden rounded-md border p-2 hover:bg-gray-100"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle Menu</span>
      </button>

      <div className="relative flex-1 md:grow-0 md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Tìm kiếm..."
          className="w-full rounded-lg border border-gray-300 bg-white pl-8 py-2 md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button className="relative rounded-md border p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
            5
          </span>
          <span className="sr-only">Notifications</span>
        </button>
        <UserMenu />
      </div>
    </header>
  )
}

export default Header

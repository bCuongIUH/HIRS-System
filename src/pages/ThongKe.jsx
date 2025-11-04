"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // 📌 Chuyển Date object sang dd/mm/yyyy để hiển thị
  const formatForDisplay = (date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  // 📌 Chuyển dd/mm/yyyy sang YYYY-MM-DD để gửi API
  const formatForApi = (dateStr) => {
    const [day, month, year] = dateStr.split("/")
    return `${year}-${month}-${day}`
  }

  // 📊 Hàm gọi API thống kê (có lọc theo ngày)
  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/statistics", {
        params: {
          startDate: startDate ? formatForApi(startDate) : undefined,
          endDate: endDate ? formatForApi(endDate) : undefined,
        },
      })
      setStats(res.data)
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Khi mở trang lần đầu → set ngày mặc định là hôm nay
  useEffect(() => {
    const today = new Date()
    const formatted = formatForDisplay(today)
    setStartDate(formatted)
    setEndDate(formatted)
  }, [])

  // 🔹 Khi startDate và endDate có giá trị → gọi API
  useEffect(() => {
    if (startDate && endDate) {
      fetchStats()
    }
  }, [startDate, endDate])

  if (!stats && loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Đang tải dữ liệu thống kê...
      </main>
    )
  }

  if (!stats) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Không có dữ liệu thống kê
      </main>
    )
  }

  const booksData = stats.topProducts || []
  const totalRevenue = stats.totalRevenue || 0
  const totalSales = stats.totalBooksSold || 0
  const totalCustomers = stats.totalCustomers || 0
  const avgOrderValue = totalSales ? Math.round(totalRevenue / totalSales) : 0
  const maxSales = Math.max(...(booksData.map((b) => b.totalQuantity) || [0]))
  const topCustomers = stats.topCustomers || []

  const StatCard = ({ title, value, change, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 text-white`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs mt-3 opacity-75">{change}</p>
    </div>
  )

  const BarChart = ({ data, maxValue, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Sản Phẩm Bán Chạy Nhất</h3>
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.totalQuantity / maxValue) * 100
          return (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.title}</span>
                <span className="text-sm font-bold text-gray-900">{item.totalQuantity} sp</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-full rounded-full transition-all ${color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">₫ {item.totalRevenue.toLocaleString()}</div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.totalQuantity, 0)
    let startAngle = 0
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỷ Lệ Bán Sản Phẩm</h3>
        <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto mb-4">
          {data.map((item, idx) => {
            const sliceAngle = (item.totalQuantity / total) * 360
            const radius = 80
            const x1 = 100 + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = 100 + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = 100 + radius * Math.cos(((startAngle + sliceAngle) * Math.PI) / 180)
            const y2 = 100 + radius * Math.sin(((startAngle + sliceAngle) * Math.PI) / 180)
            const largeArc = sliceAngle > 180 ? 1 : 0
            const path = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
            startAngle += sliceAngle
            return <path key={idx} d={path} fill={colors[idx]} opacity="0.8" />
          })}
        </svg>
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
                <span className="text-gray-700">{item.title}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {Math.round((item.totalQuantity / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const CustomerTable = ({ data }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống Kê Khách Hàng</h3>
      <table className="w-full text-sm">
        <thead className="border-b border-gray-300">
          <tr className="text-gray-600 font-semibold">
            <th className="text-left py-3 px-4">Tên Khách Hàng</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Số Điện Thoại</th>
            <th className="text-center py-3 px-4">Số Đơn Mua</th>
            <th className="text-right py-3 px-4">Tổng Chi Tiêu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{customer.name || "Ẩn danh"}</td>
              <td className="py-3 px-4 text-gray-600">{customer.email}</td>
              <td className="py-3 px-4 text-gray-600">{customer.phone || "Không có"}</td>
              <td className="py-3 px-4 text-center text-gray-700">{customer.ordersCount}</td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900">
                ₫ {customer.totalSpent.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-700 font-medium z-10">
          Đang tải dữ liệu...
        </div>
      )}

      <div className="max-w mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Thống Kê Bán Hàng</h1>
            <p className="text-gray-600 mt-2">Theo dõi doanh thu và hiệu suất bán sản phẩm</p>
          </div>

          {/* Bộ lọc ngày bên phải */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={fetchStats}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Lọc thống kê
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Tổng Doanh Thu"
            value={`₫ ${(totalRevenue / 1000000).toFixed(2)}M`}
            change="+12.5% so với kỳ trước"
            bgColor="bg-blue-600"
          />
          <StatCard
            title="Tổng Sản Phẩm Bán"
            value={totalSales}
            change="+8.3% so với kỳ trước"
            bgColor="bg-emerald-600"
          />
          <StatCard
            title="Tổng Khách Hàng"
            value={totalCustomers}
            change="+5.2% so với kỳ trước"
            bgColor="bg-orange-600"
          />
          <StatCard
            title="Giá Trung Bình"
            value={`₫ ${avgOrderValue.toLocaleString()}`}
            change="+3.1% so với kỳ trước"
            bgColor="bg-pink-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BarChart data={booksData} maxValue={maxSales} color="bg-blue-500" />
          </div>
          <div>
            <PieChart data={booksData} />
          </div>
        </div>

        {/* Bảng khách hàng */}
        <CustomerTable data={topCustomers} />
      </div>
    </main>
  )
}

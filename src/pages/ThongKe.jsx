import React, { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { CalendarDays, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock data
const revenueData = [
  { date: "01/01", daily: 12500000, monthly: 375000000, yearly: 4500000000 },
  { date: "02/01", daily: 15200000, monthly: 456000000, yearly: 5472000000 },
  { date: "03/01", daily: 11800000, monthly: 354000000, yearly: 4248000000 },
  { date: "04/01", daily: 18900000, monthly: 567000000, yearly: 6804000000 },
  { date: "05/01", daily: 16700000, monthly: 501000000, yearly: 6012000000 },
  { date: "06/01", daily: 14300000, monthly: 429000000, yearly: 5148000000 },
  { date: "07/01", daily: 19800000, monthly: 594000000, yearly: 7128000000 },
  { date: "08/01", daily: 17500000, monthly: 525000000, yearly: 6300000000 },
  { date: "09/01", daily: 13900000, monthly: 417000000, yearly: 5004000000 },
  { date: "10/01", daily: 21200000, monthly: 636000000, yearly: 7632000000 },
  { date: "11/01", daily: 18600000, monthly: 558000000, yearly: 6696000000 },
  { date: "12/01", daily: 22400000, monthly: 672000000, yearly: 8064000000 },
]

const customerRevenueData = [
  { customer: "Nguyễn V.A", revenue: 245000000 },
  { customer: "Trần T.B", revenue: 198000000 },
  { customer: "Lê M.C", revenue: 187000000 },
  { customer: "Phạm T.D", revenue: 165000000 },
  { customer: "Hoàng V.E", revenue: 142000000 },
]

const topCustomers = [
  { name: "Nguyễn Văn An", orders: 156, revenue: 245000000, growth: 12.5 },
  { name: "Trần Thị Bình", orders: 142, revenue: 198000000, growth: 8.3 },
  { name: "Lê Minh Cường", orders: 128, revenue: 187000000, growth: -2.1 },
  { name: "Phạm Thị Dung", orders: 119, revenue: 165000000, growth: 15.7 },
  { name: "Hoàng Văn Em", orders: 103, revenue: 142000000, growth: 6.9 },
]

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(amount)

const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num)

export default function RevenueDashboard() {
  const [timePeriod, setTimePeriod] = useState("monthly")

  const getCurrentData = () =>
    revenueData.map((item) => ({
      ...item,
      value: item[timePeriod],
    }))

  const totalRevenue = getCurrentData().reduce((sum, item) => sum + item.value, 0)
  const avgRevenue = totalRevenue / getCurrentData().length
  const growth = 12.8

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-10xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Thống kê doanh thu</h1>
            <p className="text-gray-500 mt-1">Theo dõi và phân tích doanh thu kinh doanh</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimePeriod("daily")}
              className={`px-3 py-1 rounded ${timePeriod === "daily" ? "bg-blue-500 text-white" : "bg-white border"}`}
            >
              Ngày
            </button>
            <button
              onClick={() => setTimePeriod("monthly")}
              className={`px-3 py-1 rounded ${timePeriod === "monthly" ? "bg-blue-500 text-white" : "bg-white border"}`}
            >
              Tháng
            </button>
            <button
              onClick={() => setTimePeriod("yearly")}
              className={`px-3 py-1 rounded ${timePeriod === "yearly" ? "bg-blue-500 text-white" : "bg-white border"}`}
            >
              Năm
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Doanh thu TB</p>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgRevenue)}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <CalendarDays className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(1247)}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">KH hoạt động</p>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(892)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow col-span-2">
            <h2 className="font-semibold mb-2">Biểu đồ doanh thu</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(v) => `${v / 1000000}tr`} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Doanh thu khách hàng</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customer" />
                  <YAxis tickFormatter={(v) => `${v / 1000000}tr`} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Top khách hàng</h2>
            <ul className="space-y-2">
              {topCustomers.map((c, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{c.name} ({c.orders} đơn)</span>
                  <span>{formatCurrency(c.revenue)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

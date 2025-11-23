"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Package, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from "lucide-react"
import { useNavigate } from "react-router-dom"


function DetailOrders() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [returnFilter, setReturnFilter] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("http://localhost:5000/api/orders")
        const result = await res.json()

        if (result.success && result.orders) {
          const mappedOrders = result.orders.map((o) => ({
            _id: o._id,
            orderId: o.orderCode,
            customerName: o.shippingAddress?.fullName ?? "Không rõ",
            customerEmail: o.shippingAddress?.email ?? "Không có",
            orderDate: o.createdAt,
            totalAmount: o.total,
            status: o.status,
            items: o.items,
            returnRequest: null,
          }))
          setOrders(mappedOrders)
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = statusFilter === "all" || o.status === statusFilter

    const matchReturn =
      returnFilter === "all" ||
      (returnFilter === "none" && !o.returnRequest) ||
      (o.returnRequest && o.returnRequest.status === returnFilter)

    return matchSearch && matchStatus && matchReturn
  })

  const formatCurrency = (num) => {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800", icon: Clock }
      case "processing":
        return { label: "Đang xử lý", className: "bg-blue-100 text-blue-800", icon: Clock }
      case "shipping":
        return { label: "Vận chuyển", className: "bg-indigo-100 text-indigo-800", icon: Package }
      case "delivered":
        return { label: "Đã giao", className: "bg-green-100 text-green-800", icon: CheckCircle }
      case "cancelled":
        return { label: "Đã hủy", className: "bg-red-100 text-red-800", icon: XCircle }
        case "shipped":
        return { label: "Đã gửi", className: "bg-indigo-100 text-indigo-800", icon: Package }
      default:
        return { label: "Không rõ", className: "bg-gray-100 text-gray-800", icon: AlertTriangle }
    }
  }

  const getReturnStatusInfo = (returnRequest) => {
    if (!returnRequest) return { label: "Không", className: "bg-gray-100 text-gray-800" }
    return { label: "Yêu cầu", className: "bg-yellow-100 text-yellow-800" }
  }

  const canReturnOrder = (orderDate) => {
    const now = new Date()
    const order = new Date(orderDate)
    const diffDays = (now - order) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  const handleReturnRequest = (orderId, action) => {
    alert(`Đơn hàng ${orderId} - ${action === "approve" ? "Chấp nhận" : "Từ chối"} hoàn trả`)
    setActiveDropdown(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10xl mx-auto space-y-6">

        {/* Tiêu đề */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của khách hàng</p>
        </div>

        {/* Bộ lọc + tìm kiếm */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px] appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã gửi</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <select
                value={returnFilter}
                onChange={(e) => setReturnFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="all">Tất cả hoàn trả</option>
                <option value="none">Không hoàn trả</option>
                <option value="requested">Yêu cầu hoàn trả</option>
                <option value="approved">Đã chấp nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã đơn hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hoàn trả</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Không có đơn hàng</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    const StatusIcon = statusInfo.icon
                    const returnStatusInfo = getReturnStatusInfo(order.returnRequest)
                    const canReturn = canReturnOrder(order.orderDate)

                    return (
                      <tr
                        key={order._id}
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                          {canReturn && (
                            <div className="text-xs text-green-600 font-medium mt-1">✓ Có thể hoàn trả</div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                            <StatusIcon className="w-3 h-3 mr-1" /> {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${returnStatusInfo.className}`}>
                            {returnStatusInfo.label}
                          </span>
                        </td>

                        <td
                          className="px-6 py-4 whitespace-nowrap text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(order._id)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex justify-center items-center"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </button>

                             {activeDropdown === order._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => handleReturnRequest(order._id, "approve")}
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                              >
                                ✓ Chấp nhận hoàn trả
                              </button>
                              <button
                                onClick={() => handleReturnRequest(order._id, "reject")}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                ✗ Từ chối hoàn trả
                              </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DetailOrders

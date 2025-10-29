"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { CheckCircle, AlertCircle, Phone, Mail, MapPin, DollarSign, Loader } from "lucide-react"

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnAccepted, setReturnAccepted] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`http://localhost:5000/api/orders/${id}`)

        if (!res.ok) {
          throw new Error("Không thể tải thông tin đơn hàng")
        }

        const result = await res.json()

        if (result.success && result.order) {
          setOrder(result.order)
        } else {
          throw new Error(result.message || "Lỗi khi tải dữ liệu")
        }
      } catch (err) {
        console.error("[v0] Error fetching order:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  // Status flow: pending -> processing -> shipping -> delivered -> yeu_cau_hoan_tra
  const statusFlow = ["pending", "processing", "shipping", "delivered", "yeu_cau_hoan_tra"]
  const statusLabels = {
    pending: "Chờ xác nhận",
    processing: "Chuyển bị",
    shipping: "Vận chuyển",
    delivered: "Đã giao",
    yeu_cau_hoan_tra: "Yêu cầu hoàn trả",
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    yeu_cau_hoan_tra: "bg-red-100 text-red-800",
  }

  const handleConfirmOrder = async () => {
    if (!order) return

    const currentIndex = statusFlow.indexOf(order.status)
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1]

      try {
        const res = await fetch(`http://localhost:5000/api/orders/status/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })

        if (res.ok) {
          setOrder({ ...order, status: newStatus })
        } else {
          alert("Cập nhật trạng thái thất bại")
        }
      } catch (err) {
        console.error("[v0] Error updating order:", err)
        alert("Lỗi khi cập nhật trạng thái")
      }
    }
  }

  const handleAcceptReturn = async () => {
    if (!order) return

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnStatus: "approved" }),
      })

      if (res.ok) {
        setReturnAccepted(true)
        setShowReturnModal(false)
        alert("Đã chấp nhận yêu cầu hoàn trả. Khách hàng sẽ được hoàn tiền.")
      } else {
        alert("Chấp nhận hoàn trả thất bại")
      }
    } catch (err) {
      console.error("[v0] Error accepting return:", err)
      alert("Lỗi khi chấp nhận hoàn trả")
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lỗi</h2>
          <p className="text-slate-600">{error || "Không thể tải thông tin đơn hàng"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Chi tiết đơn hàng</h1>
              <p className="text-slate-600 mt-1">Mã đơn: {order.orderCode}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Trạng thái đơn hàng</h2>
              <div className="flex items-center justify-between">
                {statusFlow.map((status, index) => (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                        statusFlow.indexOf(order.status) >= index
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-sm text-center text-slate-600">{statusLabels[status]}</p>
                    {index < statusFlow.length - 1 && (
                      <div
                        className={`h-1 w-full mt-4 ${
                          statusFlow.indexOf(order.status) > index ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items &&
                  order.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatCurrency(item.total)}</p>
                        <p className="text-sm text-slate-600">{formatCurrency(item.price)}/cái</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Tên người nhận</p>
                  <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Điện thoại
                    </p>
                    <p className="font-semibold text-slate-900">{order.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="font-semibold text-slate-900">{order.shippingAddress?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Địa chỉ</p>
                  <p className="font-semibold text-slate-900">
                    {order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district},{" "}
                    {order.shippingAddress?.city}
                  </p>
                </div>
                {order.shippingAddress?.notes && (
                  <div>
                    <p className="text-sm text-slate-600">Ghi chú</p>
                    <p className="font-semibold text-slate-900">{order.shippingAddress.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Thuế</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-slate-900">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-600">Phương thức thanh toán</p>
                  <p className="font-semibold text-slate-900 uppercase">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-slate-600">Ngày tạo</p>
                  <p className="font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {order.status !== "delivered" && order.status !== "yeu_cau_hoan_tra" && (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Xác nhận bước tiếp theo
                </button>
              )}

              {order.status === "yeu_cau_hoan_tra" && order.returnRequest && !returnAccepted && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Tiếp nhận yêu cầu hoàn trả
                </button>
              )}

              {returnAccepted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900">Yêu cầu hoàn trả đã được chấp nhận</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReturnModal && order.returnRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Yêu cầu hoàn trả đơn hàng</h3>

            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">Lý do hoàn trả:</p>
              <p className="font-semibold text-slate-900">{order.returnRequest.reason}</p>
            </div>

            <div className="mb-4 text-sm text-slate-600">
              <p>Ngày yêu cầu: {formatDate(order.returnRequest.requestedAt)}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAcceptReturn}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Chấp nhận hoàn trả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail

"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { CheckCircle, AlertCircle, MapPin, DollarSign, Loader, Printer } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { useNavigate } from "react-router-dom"
/**
 * OrderPage.jsx
 * - Full UI + logic
 * - Xuất hoá đơn PDF sử dụng html2canvas + jsPDF
 */

const OrderPage = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnAccepted, setReturnAccepted] = useState(false)
  const [userNames, setUserNames] = useState({})
  const userId = localStorage.getItem("userId")
  const invoiceRef = useRef(null)
const navigate = useNavigate()
  const statusFlow = ["pending", "processing", "shipping", "delivered", "yeu_cau_hoan_tra"]
  const statusLabels = {
    pending: "Chờ xác nhận",
    processing: "Chuẩn bị",
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

  const fetchUserName = async (uId) => {
    if (!uId) return "Không xác định"
    if (userNames[uId]) return userNames[uId]
    try {
      const res = await fetch(`http://localhost:5000/api/users/${uId}`)
      if (res.ok) {
        const result = await res.json()
        if (result.success && result.data) {
          const name = result.data.name || result.data.email || uId
          setUserNames((prev) => ({ ...prev, [uId]: name }))
          return name
        }
      }
    } catch (err) {
      console.error("fetchUserName error:", err)
    }
    // fallback
    setUserNames((prev) => ({ ...prev, [uId]: uId }))
    return uId
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`http://localhost:5000/api/orders/${id}`)
      if (!res.ok) throw new Error("Không thể tải thông tin đơn hàng")
      const result = await res.json()
      if (result.success && result.order) {
        setOrder(result.order)
      } else {
        throw new Error(result.message || "Lỗi khi tải dữ liệu")
      }
    } catch (err) {
      console.error("Error fetching order:", err)
      setError(err.message || "Lỗi khi tải đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Khi order về, prefetch tên những người liên quan
  useEffect(() => {
    if (!order) return
  
    if (order.createdBy) fetchUserName(order.createdBy)
    if (order.statusHistory && Array.isArray(order.statusHistory)) {
      order.statusHistory.forEach((h) => {
        if (h.updatedBy) fetchUserName(h.updatedBy)
      })
    }
    // nếu có returnRequest.requestedBy
    if (order.returnRequest?.requestedBy) fetchUserName(order.returnRequest.requestedBy)
   
  }, [order])

  const handleConfirmOrder = async () => {
    if (!order || !userId) {
      alert("Không có đơn hàng hoặc chưa đăng nhập.")
      return
    }
    const currentIndex = statusFlow.indexOf(order.status)
    if (currentIndex < 0) {
      alert("Trạng thái đơn hàng không hợp lệ.")
      return
    }
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1]
      try {
        const res = await fetch(`http://localhost:5000/api/orders/status/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, userId }),
        })
        if (res.ok) {
          // cập nhật local 
          setOrder((prev) => ({ ...prev, status: newStatus, statusHistory: [...(prev?.statusHistory || []), { status: newStatus, updatedBy: userId, updatedAt: new Date().toISOString() }] }))
         
          fetchUserName(userId)
        } else {
          const data = await res.json().catch(() => ({}))
          alert(data.message || "Cập nhật trạng thái thất bại")
        }
      } catch (err) {
        console.error("Error updating order:", err)
        alert("Lỗi khi cập nhật trạng thái")
      }
    } else {
      alert("Đơn hàng đã ở trạng thái cuối.")
    }
  }

  const handleAcceptReturn = async () => {
    if (!order) return
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnStatus: "approved", handledBy: userId }),
      })
      if (res.ok) {
        setReturnAccepted(true)
        setShowReturnModal(false)
        alert("Đã chấp nhận yêu cầu hoàn trả. Khách hàng sẽ được hoàn tiền.")
        // cập nhật local: đặt status về delivered? hoặc "return_approved" tuỳ backend
        setOrder((prev) => ({ ...prev, status: "yeu_cau_hoan_tra", returnRequest: { ...prev?.returnRequest, status: "approved", handledBy: userId, handledAt: new Date().toISOString() } }))
        fetchUserName(userId)
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.message || "Chấp nhận hoàn trả thất bại")
      }
    } catch (err) {
      console.error("Error accepting return:", err)
      alert("Lỗi khi chấp nhận hoàn trả")
    }
  }

  const formatCurrency = (value) => {
    if (isNaN(Number(value))) return "₫0"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value))
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  // Xuất hoá đơn sang PDF
  const exportInvoicePDF = async () => {
    if (!invoiceRef.current) {
      alert("Không tìm thấy nội dung hoá đơn.")
      return
    }
    try {
      // tăng scale để ảnh PDF nét hơn
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      // tự động tính chiều cao ảnh theo tỉ lệ
      const imgProps = pdf.getImageProperties(imgData)
      const imgWidthMM = pageWidth - 16 // 8mm margin each side
      const imgHeightMM = (imgProps.height * imgWidthMM) / imgProps.width
      let position = 8
      // nếu ảnh cao hơn 1 trang, chia trang
      if (imgHeightMM <= pageHeight - 16) {
        pdf.addImage(imgData, "PNG", 8, position, imgWidthMM, imgHeightMM)
      } else {
        // ghi theo nhiều trang
        let remainingHeight = imgHeightMM
        let tempCanvas = document.createElement("canvas")
        const pxPerMM = canvas.width / imgWidthMM // approximate px per mm
        const sliceHeightPx = Math.floor((pageHeight - 16) * pxPerMM)
        let y = 0
        while (remainingHeight > 0) {
          const sliceCanvas = document.createElement("canvas")
          sliceCanvas.width = canvas.width
          sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - y)
          const ctx = sliceCanvas.getContext("2d")
          ctx.drawImage(canvas, 0, y, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height)
          const sliceData = sliceCanvas.toDataURL("image/png")
          const sliceImgProps = { width: sliceCanvas.width, height: sliceCanvas.height }
          const sliceImgHeightMM = (sliceImgProps.height * imgWidthMM) / sliceImgProps.width
          if (y > 0) pdf.addPage()
          pdf.addImage(sliceData, "PNG", 8, 8, imgWidthMM, sliceImgHeightMM)
          y += sliceHeightPx
          remainingHeight -= sliceImgHeightMM
        }
      }
      const fileName = `Invoice-${order?.orderCode || id}.pdf`
      pdf.save(fileName)
    } catch (err) {
      console.error("Error exporting PDF:", err)
      alert("Không thể xuất hoá đơn. Vui lòng thử lại.")
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )

  if (error || !order)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lỗi</h2>
          <p className="text-slate-600">{error || "Không thể tải thông tin đơn hàng"}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w mx-auto px-4">
        {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Chi tiết đơn hàng</h1>
              <p className="text-slate-600 mt-1">Mã đơn: {order.orderCode}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Hiển thị trạng thái */}
              <div className={`px-4 py-2 rounded-lg font-semibold ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </div>

              {/* Nút xem chi tiết hoàn trả, chỉ khi yêu cầu hoàn trả */}
              {order.status === "yeu_cau_hoan_tra" && (
                <button
                  onClick={() => navigate(`/return-detail/${order._id}`)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Xem chi tiết hoàn trả
                </button>
              )}

              {/* Xuất hoá đơn PDF, chỉ khi đã giao */}
              {order.status === "delivered" && (
                <button
                  onClick={exportInvoicePDF}
                  className="flex items-center gap-2 bg-white border hover:shadow-md px-4 py-2 rounded-md"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm font-medium">Xuất hoá đơn (PDF)</span>
                </button>
              )}
            </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Trạng thái đơn hàng</h2>
              <div className="relative">
                <div className="absolute top-8 left-8 right-8 h-1 bg-slate-200 z-0" />
                <div
                  className="absolute top-8 left-8 h-1 bg-blue-600 z-0 transition-all duration-300"
                  style={{
                    width:
                      statusFlow.indexOf(order.status) === 0
                        ? "0%"
                        : `calc((100% - 64px) * ${statusFlow.indexOf(order.status)} / ${statusFlow.length - 1})`,
                  }}
                />
                <div className="flex justify-between relative z-10">
                  {statusFlow.map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 border-4 transition-all ${
                          statusFlow.indexOf(order.status) >= index
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p className="text-sm text-center text-slate-600 w-24">{statusLabels[status]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item._id || item.productId || Math.random()} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div>
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

            {/* Shipping */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Địa chỉ giao hàng
              </h2>
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Tên người nhận</p>
                <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName}</p>
                <p className="text-sm text-slate-600">Số điện thoại: {order.shippingAddress?.phone}</p>
                <p className="text-sm text-slate-600">Email: {order.shippingAddress?.email}</p>
                <p className="text-sm text-slate-600">
                  Địa chỉ: {order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district},{" "}
                  {order.shippingAddress?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invoice summary (this will be captured to PDF) */}
            <div className="bg-white rounded-lg shadow-sm p-6" ref={invoiceRef}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Hoá đơn</h2>
                  <p className="text-sm text-slate-600">Mã: {order.orderCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Ngày: {formatDate(order.createdAt)}</p>
                  <p className="text-sm text-slate-600">Người mua: {order.shippingAddress?.fullName}</p>
                </div>
              </div>

              <div className="mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th>Sản phẩm</th>
                      <th className="text-right">Số lượng</th>
                      <th className="text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((it) => (
                      <tr key={it._id || it.productId || Math.random()} className="border-t">
                        <td className="py-2">{it.title}</td>
                        <td className="py-2 text-right">{it.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(it.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-3 text-sm">
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
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Phương thức thanh toán: </span>
                  <span className="font-semibold uppercase">{order.paymentMethod}</span>
                </p>
                <p>
                  <span className="text-slate-600">Ngày tạo: </span>
                  <span className="font-semibold">{formatDate(order.createdAt)}</span>
                </p>
                <p>
                  <span className="text-slate-600">Người đặt hàng: </span>
                  <span className="font-semibold">{[order.shippingAddress.fullName] || "Đang tải..."}</span>
                </p>
              </div>
            </div>

            {/* Status history */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Lịch sử cập nhật trạng thái</h2>
              <ul className="space-y-3">
                {order?.statusHistory?.map((history, index) => (
                  <li key={index} className="text-sm border-l-2 border-blue-600 pl-3">
                    <p className="text-slate-700">
                      <strong className="text-slate-900">{[history.updatedByName] || "Đang tải..."}</strong> đã cập
                      nhật trạng thái thành <strong className="text-slate-900">{statusLabels[history.status]}</strong> vào{" "}
                      <span className="text-slate-600">{formatDate(history.updatedAt)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
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

      {/* Modal xác nhận hoàn trả */}
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
              {order.returnRequest.requestedBy && (
                <p>
                  Người yêu cầu: <strong>{userNames[order.returnRequest.requestedBy] || order.returnRequest.requestedBy}</strong>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleAcceptReturn}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
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

export default OrderPage

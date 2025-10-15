import React, { useState } from "react"
import { message, Modal } from "antd"
// ------------------ ICONS ------------------
const PercentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
)

const MoneyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

// ------------------ COMPONENT ------------------
export default function PromotionForm() {
  const [discountType, setDiscountType] = useState("percent")
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Khuyến mãi mùa hè",
      desc: "Mua từ 100.000 ₫ giảm 10.000 ₫",
      status: "active",
      type: "fixed",
      minOrder: 100000,
      value: 10000,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
    },
    {
      id: 2,
      title: "Giảm giá cuối tuần",
      desc: "Mua từ 150.000 ₫ giảm 15% tối đa 20.000 ₫",
      status: "active",
      type: "percent",
      minOrder: 150000,
      value: 15,
      maxDiscount: 20000,
      startDate: "2024-06-01",
      endDate: "2024-12-31",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    minOrder: "",
    value: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    active: true,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.minOrder || !formData.value || !formData.startDate || !formData.endDate) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const newPromotion = {
      id: Date.now(),
      title: formData.title,
      type: discountType,
      minOrder: Number(formData.minOrder),
      value: Number(formData.value),
      maxDiscount: discountType === "percent" ? Number(formData.maxDiscount) : null,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.active ? "active" : "inactive",
      desc: generateDescription(formData, discountType),
    }

    setPromotions((prev) => [newPromotion, ...prev])

    setFormData({ title: "", minOrder: "", value: "", maxDiscount: "", startDate: "", endDate: "", active: true })
  }

  const generateDescription = (data, type) => {
    const minOrder = Number(data.minOrder).toLocaleString("vi-VN")
    if (type === "fixed") {
      const discount = Number(data.value).toLocaleString("vi-VN")
      return `Mua từ ${minOrder} ₫ giảm ${discount} ₫`
    } else {
      const percent = data.value
      const maxDiscount = data.maxDiscount ? ` tối đa ${Number(data.maxDiscount).toLocaleString("vi-VN")} ₫` : ""
      return `Mua từ ${minOrder} ₫ giảm ${percent}%${maxDiscount}`
    }
  }

const deletePromotion = (id) => {
  Modal.confirm({
    title: "Xác nhận xóa khuyến mãi",
    content: "Bạn có chắc muốn xóa khuyến mãi này không?",
    okText: "Xóa",
    cancelText: "Hủy",
    okType: "danger",
    onOk() {
      setPromotions((prev) => prev.filter((promo) => promo.id !== id))
      message.success("Xóa khuyến mãi thành công!")
    },
    onCancel() {
      message.info("Hủy xóa khuyến mãi")
    },
  })
}

  const toggleStatus = (id) => {
    setPromotions((prev) =>
      prev.map((promo) => (promo.id === id ? { ...promo, status: promo.status === "active" ? "inactive" : "active" } : promo)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex gap-6">
      {/* ------------------- FORM ------------------- */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1 h-fit">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-purple-700">
          <TagIcon /> Tạo Khuyến Mãi Mới
        </h2>
        <p className="text-gray-500 mb-6 text-sm">Thiết lập chương trình khuyến mãi cho khách hàng</p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Tên chương trình</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="VD: Khuyến mãi mùa hè"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Discount type */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Loại giảm giá</label>
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  discountType === "fixed"
                    ? "bg-purple-500 text-white border-purple-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                }`}
                onClick={() => setDiscountType("fixed")}
              >
                <MoneyIcon /> Giảm cố định
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  discountType === "percent"
                    ? "bg-purple-500 text-white border-purple-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                }`}
                onClick={() => setDiscountType("percent")}
              >
                <PercentIcon /> Giảm phần trăm
              </button>
            </div>
          </div>

          {/* Min order */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Giá trị đơn hàng tối thiểu (VND)</label>
            <input
              type="number"
              name="minOrder"
              value={formData.minOrder}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Discount value */}
          {discountType === "percent" ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Phần trăm giảm (%)</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Giảm tối đa (VND)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Số tiền giảm (VND)</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Date */}
          <div className="mb-4 flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 font-medium">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 font-medium">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Active */}
          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="active" className="text-gray-700 font-medium">
              Kích hoạt ngay
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Tạo Khuyến Mãi
          </button>
        </form>
      </div>

      {/* ------------------- DANH SÁCH ------------------- */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700">
            <TagIcon /> Danh Sách Khuyến Mãi
          </h2>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
            {promotions.length} khuyến mãi
          </span>
        </div>

        <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {promotions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <TagIcon />
              <p className="mt-2">Chưa có khuyến mãi nào</p>
            </div>
          ) : (
            promotions.map((promo) => (
              <div
                key={promo.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        promo.type === "percent" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                      }`}
                    >
                      {promo.type === "percent" ? <PercentIcon /> : <MoneyIcon />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{promo.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{promo.desc}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <CalendarIcon />
                        <span>
                          {promo.startDate} → {promo.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(promo.id)}
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      promo.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {promo.status === "active" ? "Đang hoạt động" : "Đã tắt"}
                  </button>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => alert("Chức năng chỉnh sửa chưa implement")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <EditIcon /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => deletePromotion(promo.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    <TrashIcon /> Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

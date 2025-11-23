"use client"

import { useState, useMemo } from "react"
import { Search, Filter, X, Calendar } from "lucide-react"

export default function TransactionForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Dữ liệu giao dịch sách mẫu
  const transactionData = [
    {
      _id: "1",
      productId: { code: "B001", name: "Clean Code" },
      quantity: 2,
      volume: "1",
      transactionType: "ban",
      date: new Date("2024-11-20"),
      price: 45.99,
      author: "Robert C. Martin",
    },
    {
      _id: "2",
      productId: { code: "B002", name: "The Pragmatic Programmer" },
      quantity: 1,
      volume: "1",
      transactionType: "nhap",
      date: new Date("2024-11-19"),
      price: 49.99,
      author: "David Thomas",
    },
    {
      _id: "3",
      productId: { code: "B003", name: "Design Patterns" },
      quantity: 3,
      volume: "1",
      transactionType: "ban",
      date: new Date("2024-11-18"),
      price: 54.99,
      author: "Gang of Four",
    },
    {
      _id: "4",
      productId: { code: "B001", name: "Clean Code" },
      quantity: 1,
      volume: "1",
      transactionType: "kiemke",
      date: new Date("2024-11-17"),
      price: 45.99,
      author: "Robert C. Martin",
    },
    {
      _id: "5",
      productId: { code: "B004", name: "JavaScript: The Definitive Guide" },
      quantity: 2,
      volume: "1",
      transactionType: "hoantra",
      date: new Date("2024-11-16"),
      price: 59.99,
      author: "David Flanagan",
    },
    {
      _id: "6",
      productId: { code: "B005", name: "React: The Complete Guide" },
      quantity: 4,
      volume: "1",
      transactionType: "nhap",
      date: new Date("2024-11-15"),
      price: 39.99,
      author: "Maximilian Schwarzmüller",
    },
  ]

  // Định dạng loại giao dịch
  const formatTransactionType = (type) => {
    const typeMap = {
      kiemke: "Kiểm kê",
      huy: "Hủy",
      ban: "Bán hàng",
      khuyenmai: "Khuyến mãi",
      nhap: "Nhập kho",
      hoantra: "Trả hàng",
    }
    return typeMap[type] || type
  }

  // Lọc giao dịch
  const filteredTransactions = useMemo(() => {
    let filtered = transactionData

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.productId.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDate) {
      filtered = filtered.filter((t) => t.date.toISOString().split("T")[0] === selectedDate)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.transactionType === selectedType)
    }

    return filtered.sort((a, b) => b.date - a.date)
  }, [searchTerm, selectedDate, selectedType])

  // Hiển thị modal
  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  // Đóng modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedTransaction(null)
  }

  // Màu cho loại giao dịch
  const getTypeColor = (type) => {
    const colors = {
      ban: "bg-green-100 text-green-800",
      nhap: "bg-blue-100 text-blue-800",
      kiemke: "bg-yellow-100 text-yellow-800",
      hoantra: "bg-red-100 text-red-800",
      huy: "bg-gray-100 text-gray-800",
      khuyenmai: "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách giao dịch</h1>
          <p className="text-gray-600">Quản lý các giao dịch sách trong hệ thống</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã sách, tên sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 font-medium"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
            </button>

            {/* Dropdown menu */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 space-y-4">
                {/* Date filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline-block w-4 h-4 mr-2" />
                    Chọn ngày
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">Tất cả</option>
                    <option value="ban">Bán hàng</option>
                    <option value="nhap">Nhập kho</option>
                    <option value="kiemke">Kiểm kê</option>
                    <option value="hoantra">Trả hàng</option>
                    <option value="huy">Hủy</option>
                    <option value="khuyenmai">Khuyến mãi</option>
                  </select>
                </div>

                {/* Clear filters button */}
                <button
                  onClick={() => {
                    setSelectedDate("")
                    setSelectedType("all")
                    setShowFilterDropdown(false)
                  }}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mã SP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tập</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Số lượng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loại giao dịch</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày giao dịch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      onClick={() => showTransactionDetails(transaction)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.productId.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.productId.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.volume}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{transaction.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.transactionType)}`}
                        >
                          {formatTransactionType(transaction.transactionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.date.toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <p className="text-lg">Không tìm thấy giao dịch nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination info */}
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị {filteredTransactions.length} giao dịch
        </div>
      </div>

      {/* Modal chi tiết giao dịch */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Product info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sách</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã sách</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.productId.code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên sách</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.productId.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tác giả</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTransaction.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ${selectedTransaction.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao dịch</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tập</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTransaction.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loại giao dịch</p>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getTypeColor(selectedTransaction.transactionType)}`}
                    >
                      {formatTransactionType(selectedTransaction.transactionType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày giao dịch</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.date.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-sm text-blue-600 mb-2">Tổng tiền</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${(selectedTransaction.price * selectedTransaction.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                In phiếu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

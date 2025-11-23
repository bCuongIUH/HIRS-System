import { useState, useEffect } from "react";
import { getAllTransaction } from "../../utils/transactionBookApi";
import { Search, Filter, X, Calendar } from "lucide-react";

export default function TransactionForm() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Lấy tất cả giao dịch khi component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransaction();
        setTransactions(data.data);
      } catch (error) {
        console.error("Lỗi khi tải giao dịch:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Định dạng loại giao dịch
  const formatTransactionType = (type) => {
    const typeMap = {
      kiemke: "Kiểm kê",
      huy: "Hủy",
      ban: "Bán hàng",
      khuyenmai: "Khuyến mãi",
      nhap: "Nhập kho",
      hoantra: "Trả hàng",
    };
    return typeMap[type] || type;
  };

  // Màu sắc cho loại giao dịch
  const getTypeColor = (type) => {
    const colors = {
      ban: "bg-green-100 text-green-800",
      nhap: "bg-blue-100 text-blue-800",
      kiemke: "bg-yellow-100 text-yellow-800",
      hoantra: "bg-red-100 text-red-800",
      huy: "bg-gray-100 text-gray-800",
      khuyenmai: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  // Lọc giao dịch
  const filteredTransactions = transactions.filter((transaction) => {
    let isValid = true;

    if (searchTerm) {
      isValid =
        transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         transaction.book.ISSN.toLowerCase().includes(searchTerm.toLowerCase())||
        transaction.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (selectedDate) {
      isValid = new Date(transaction.transactionDate).toISOString().split("T")[0] === selectedDate;
    }

    if (selectedType !== "all") {
      isValid = transaction.transactionType === selectedType;
    }

    return isValid;
  });

  // Hiển thị modal
  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

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
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModal(!showModal)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 font-medium"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
            </button>
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
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.book.ISSN}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.book.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.transactionType)}`}
                        >
                          {formatTransactionType(transaction.transactionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(transaction.transactionDate).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <p className="text-lg">Không tìm thấy giao dịch nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal chi tiết giao dịch */}
        {showModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                      <p className="text-lg font-semibold text-gray-900">{selectedTransaction.book.ISSN}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tên sách</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedTransaction.book.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tác giả</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedTransaction.book.author}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao dịch</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Số lượng</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedTransaction.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Loại giao dịch</p>
                      <p
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getTypeColor(selectedTransaction.transactionType)}`}
                      >
                        {formatTransactionType(selectedTransaction.transactionType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày giao dịch</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(selectedTransaction.transactionDate).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                {/* <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-sm text-blue-600 mb-2">Tổng tiền</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${(selectedTransaction.quantity * selectedTransaction.book.price).toFixed(2)}
                  </p>
                </div> */}
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Đóng
                </button>
                {/* <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  In phiếu
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

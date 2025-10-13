import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Modal, message } from "antd";
import AddBookModal from "./AddBookModal";
import EditBookModal from "./EditBookModal";

const BookManagementPage = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false); // add modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // edit modal
  const [editingBook, setEditingBook] = useState(null); // <-- fixed: declare editingBook

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/books");
      if (res.data && res.data.success) {
        setBooks(res.data.data);
      } else if (res.data) {
        // if your API returns plain array: setBooks(res.data)
        // try both safely
        setBooks(res.data.data || res.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải sách:", error);
      message.error("Không thể tải danh sách sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // filter
  const filteredBooks = books.filter((book) => {
    const keyword = search.toLowerCase();
    return (
      (book.title || "").toLowerCase().includes(keyword) ||
      (book.author || "").toLowerCase().includes(keyword) ||
      (book.ISSN || "").toLowerCase().includes(keyword) ||
      ((book.category?.name || "") || "").toLowerCase().includes(keyword)
    );
  });

  const totalBooks = books.length;
  const totalQuantity = books.reduce((sum, b) => sum + (b.quantity || 0), 0);

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // delete (fix: use DELETE)
  const handleDelete = (bookId, title) => {
    Modal.confirm({
      title: "Xác nhận xóa sách",
      content: `Bạn có chắc chắn muốn xóa "${title}" khỏi danh sách không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      centered: true,
      async onOk() {
        try {
          
          const res = await axios.put(`http://localhost:5000/api/books/${bookId}`);
          if (res.data && res.data.success) {
            message.success("Đã xóa sách thành công!");
            fetchBooks();
          } else {
            message.error(res.data?.message || "Xóa thất bại!");
          }
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra khi xóa sách!");
        }
      },
    });
  };

  // edit handler (fix: set editingBook)
  const handleEdit = (book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Đang tải dữ liệu sách...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header + search + summary */}
      <div className="sticky top-0 bg-gray-50 pb-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-blue-600">📘</span> Quản Lý Sách
            </h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý thông tin sách trong hệ thống</p>
          </div>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setIsModalOpen(true);
              setEditingBook(null); // ensure editingBook cleared when adding
            }}
          >
            <Plus size={18} /> Thêm Sách Mới
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="🔍 Tìm kiếm theo tên, tác giả, ISSN, thể loại..."
          className="w-full border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-500 text-sm">Tổng số sách</p>
            <p className="text-2xl font-bold">{totalBooks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-500 text-sm">Kết quả tìm kiếm</p>
            <p className="text-2xl font-bold">{filteredBooks.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-500 text-sm">Tổng số lượng</p>
            <p className="text-2xl font-bold">{totalQuantity}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full border-collapse min-w-[950px]">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-gray-700">
              <th className="p-3 text-left w-16">#</th>
              <th className="p-3 text-left">ISSN</th>
              <th className="p-3 text-left">Tên Sách</th>
              <th className="p-3 text-left">Tác Giả</th>
              <th className="p-3 text-left">Thể Loại</th>
              <th className="p-3 text-left">Năm SX</th>
              <th className="p-3 text-left">Số Trang</th>
              <th className="p-3 text-left">Giá Bán</th>
              <th className="p-3 text-left">Số Lượng</th>
              <th className="p-3 text-center">Ảnh</th>
              <th className="p-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => (
              <tr key={book._id} className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="p-3 font-semibold text-gray-700">#{startIndex + index + 1}</td>
                <td className="p-3 text-gray-700">{book.ISSN || "-"}</td>
                <td className="p-3 font-medium text-blue-700">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category?.name || "Chưa phân loại"}</td>
                <td className="p-3">{book.publishYear || "-"}</td>
                <td className="p-3">{book.pages || "-"}</td>
                <td className="p-3 font-semibold text-gray-800">{book.price?.toLocaleString()} ₫</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      (book.quantity || 0) > 40
                        ? "bg-green-100 text-green-700"
                        : (book.quantity || 0) > 20
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.quantity || 0}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded-md border inline-block" />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm mx-auto">N/A</div>
                  )}
                </td>
                <td className="p-3 text-center flex gap-3 justify-center">
                  <button onClick={() => handleEdit(book)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(book._id, book.title)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {currentBooks.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  Không tìm thấy sách nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 sticky bottom-0">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${
                currentPage === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              « Trước
            </button>
            <span className="text-gray-700">Trang {currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${
                currentPage === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              Sau »
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBookAdded={fetchBooks} />

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBook(null);
        }}
        book={editingBook}
        onBookUpdated={fetchBooks}
      />
    </div>
  );
};

export default BookManagementPage;

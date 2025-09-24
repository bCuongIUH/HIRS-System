import React, { useState } from "react";

const initialBooks = [
  { code: "B001", name: "Toán lớp 1", author: "Nguyễn Văn A", quantity: 120, price: 15000 },
  { code: "B002", name: "Tiếng Việt lớp 2", author: "Trần Thị B", quantity: 80, price: 18000 },
  { code: "B003", name: "Lịch sử lớp 3", author: "Phạm Văn C", quantity: 50, price: 20000 },
  { code: "B004", name: "Địa lý lớp 4", author: "Lê Thị D", quantity: 200, price: 22000 },
];

export default function WarehousePage() {
  const [books] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Lọc sách theo mã hoặc tên
  const filteredBooks = books.filter(
    (book) =>
      book.code.toLowerCase().includes(search.toLowerCase()) ||
      book.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sắp xếp sách
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "quantity") return b.quantity - a.quantity;
    return 0;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">📚 Quản Lý Kho Sách</h1>

      {/* Thanh tìm kiếm + sắp xếp */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Tìm theo mã sách hoặc tên sách..."
          className="p-2 border rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">-- Sắp xếp --</option>
          <option value="name">Theo tên</option>
          <option value="quantity">Theo số lượng</option>
        </select>
      </div>

      {/* Bảng hiển thị */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-center">Mã sách</th>
              <th className="py-3 px-4 text-center">Tên sách</th>
              <th className="py-3 px-4 text-center">Tác giả</th>
              <th className="py-3 px-4 text-center">Số lượng</th>
              <th className="py-3 px-4 text-center">Giá (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr key={book.code} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-center">{book.code}</td>
                <td className="py-2 px-4 text-center">{book.name}</td>
                <td className="py-2 px-4 text-center">{book.author}</td>
                <td className="py-2 px-4 text-center">{book.quantity}</td>
                <td className="py-2 px-4 text-center">
                  {book.price.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
            {sortedBooks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Không tìm thấy sách nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"

const AddBookPage = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Lập trình React.js",
      author: "Nguyễn Văn A",
      category: "Công nghệ",
      price: 250000,
      description: "Cuốn sách hướng dẫn lập trình React.js từ cơ bản đến nâng cao",
      image: "/react-book-cover.png",
      publishYear: 2023,
      pages: 350,
      issn: "1234-5678",
    },
    {
      id: 2,
      title: "Thiết kế UI/UX",
      author: "Trần Thị B",
      category: "Thiết kế",
      price: 180000,
      description: "Hướng dẫn thiết kế giao diện người dùng chuyên nghiệp",
      image: "/placeholder-m5q2n.png",
      publishYear: 2022,
      pages: 280,
      issn: "2345-6789",
    },
    {
      id: 3,
      title: "JavaScript ES6+",
      author: "Lê Văn C",
      category: "Công nghệ",
      price: 320000,
      description: "Tìm hiểu các tính năng mới của JavaScript ES6 và các phiên bản sau",
      image: "/javascript-es6-book.png",
      publishYear: 2023,
      pages: 420,
      issn: "3456-7890",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedBook, setSelectedBook] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    description: "",
    issn: "",
    publishYear: "",
    pages: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  const [categories, setCategories] = useState(["Công nghệ", "Thiết kế", "Kinh doanh", "Văn học", "Khoa học"])
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortedBooks = (books) => {
    if (!sortField) return books

    return [...books].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "" || book.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedAndFilteredBooks = getSortedBooks(filteredBooks)

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>
    }
    return sortDirection === "asc" ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      price: "",
      description: "",
      issn: "",
      publishYear: "",
      pages: "",
    })
    setImageFile(null)
    setImagePreview("")
    setEditingBook(null)
    setShowAddForm(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let imageUrl = ""
    if (imageFile) {
      imageUrl = imagePreview
    } else if (editingBook) {
      imageUrl = editingBook.image
    }

    if (editingBook) {
      setBooks(
        books.map((book) =>
          book.id === editingBook.id
            ? {
                ...formData,
                id: editingBook.id,
                price: Number(formData.price),
                publishYear: Number(formData.publishYear),
                pages: Number(formData.pages),
                image: imageUrl,
              }
            : book,
        ),
      )
    } else {
      const newBook = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        publishYear: Number(formData.publishYear),
        pages: Number(formData.pages),
        image: imageUrl,
      }
      setBooks([...books, newBook])
    }

    resetForm()
  }

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price.toString(),
      description: book.description,
      issn: book.issn,
      publishYear: book.publishYear.toString(),
      pages: book.pages.toString(),
    })
    setImagePreview(book.image)
    setEditingBook(book)
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      setBooks(books.filter((book) => book.id !== id))
    }
  }

  const handleRowClick = (book) => {
    setSelectedBook(book)
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setFormData({ ...formData, category: newCategory.trim() })
      setNewCategory("")
      setShowNewCategoryInput(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const BookDetailModal = ({ book, onClose }) => {
    if (!book) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết sách</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={book.image || "/placeholder.svg?height=300&width=200&query=book cover"}
                  alt={book.title}
                  className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mã sách</label>
                  <p className="text-lg font-semibold text-gray-900">#{book.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Mã ISSN</label>
                  <p className="text-lg text-gray-900">{book.issn || "Không có"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Tên sách</label>
                  <p className="text-lg font-semibold text-gray-900">{book.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Tác giả</label>
                  <p className="text-lg text-gray-900">{book.author}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Thể loại</label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {book.category}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Giá</label>
                  <p className="text-xl font-bold text-green-600">{formatPrice(book.price)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Năm xuất bản</label>
                  <p className="text-lg text-gray-900">{book.publishYear}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Số trang</label>
                  <p className="text-lg text-gray-900">{book.pages} trang</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Mô tả</label>
              <p className="text-gray-900 leading-relaxed">{book.description}</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  handleEdit(book)
                  onClose()
                }}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  handleDelete(book.id)
                  onClose()
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Xóa sách
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{editingBook ? "Chỉnh sửa sách" : "Thêm sách mới"}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sách *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sách"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên tác giả"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã ISSN</label>
                  <input
                    type="text"
                    value={formData.issn}
                    onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234-5678"
                    pattern="[0-9]{4}-[0-9]{4}"
                    title="Định dạng ISSN: 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại *</label>
                  <div className="space-y-2">
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "add_new") {
                          setShowNewCategoryInput(true)
                        } else {
                          setFormData({ ...formData, category: e.target.value })
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn thể loại</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="add_new" className="text-blue-600 font-medium">
                        + Thêm thể loại mới
                      </option>
                    </select>

                    {showNewCategoryInput && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên thể loại mới"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Thêm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewCategoryInput(false)
                            setNewCategory("")
                          }}
                          className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giá sách"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                  <input
                    type="number"
                    min="1900"
                    max="2024"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Năm xuất bản"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số trang</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số trang"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh bìa sách</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-24 h-32 object-cover rounded shadow-sm border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả về sách"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {editingBook ? "Cập nhật" : "Thêm sách"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sách</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Thêm sách mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sách</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm theo tên sách hoặc tác giả..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo thể loại</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả thể loại</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-gray-700">
                      Mã <SortIcon field="id" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort("issn")} className="flex items-center gap-1 hover:text-gray-700">
                      ISSN <SortIcon field="issn" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort("title")} className="flex items-center gap-1 hover:text-gray-700">
                      Tên sách <SortIcon field="title" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("author")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Tác giả <SortIcon field="author" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("category")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Thể loại <SortIcon field="category" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort("price")} className="flex items-center gap-1 hover:text-gray-700">
                      Giá <SortIcon field="price" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("publishYear")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Năm XB <SortIcon field="publishYear" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort("pages")} className="flex items-center gap-1 hover:text-gray-700">
                      Số trang <SortIcon field="pages" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(book)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{book.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.issn || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={book.image || "/placeholder.svg?height=60&width=45&query=book cover"}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">{book.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{book.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.publishYear}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.pages}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(book)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200 text-xs"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 text-xs"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sortedAndFilteredBooks.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sách nào</h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Hãy thêm sách đầu tiên của bạn"}
            </p>
          </div>
        )}

        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      </div>
    </div>
  )
}

export default AddBookPage

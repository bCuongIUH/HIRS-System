// "use client"

// import { useState, useEffect } from "react"
// import { message, Modal } from "antd"

// // ------------------ ICONS ------------------
// const PercentIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//     />
//   </svg>
// )

// const MoneyIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// )

// const TagIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
//     />
//   </svg>
// )

// const BookIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c5.5 0 10 4.747 10 11.002M12 6.253L4.5 17.25m7.5-10.997h2m-2 0h2"
//     />
//   </svg>
// )

// const EditIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//     />
//   </svg>
// )

// const TrashIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//     />
//   </svg>
// )

// const CalendarIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//     />
//   </svg>
// )

// // ------------------ COMPONENT ------------------
// export default function PromotionForm() {
//   const [discountType, setDiscountType] = useState("percent")
//   const [promotions, setPromotions] = useState([])
//   const [books, setBooks] = useState([])
//   const [employees, setEmployees] = useState([])

//   const [loading, setLoading] = useState(false)
//   const [booksLoading, setBooksLoading] = useState(true)
//   const [employeesLoading, setEmployeesLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [currentEmployee, setCurrentEmployee] = useState(null)
//   const [currentEmployeeLoading, setCurrentEmployeeLoading] = useState(true)

//   const [formData, setFormData] = useState({
//     title: "",
//     minOrder: "",
//     value: "",
//     maxDiscount: "",
//     startDate: "",
//     endDate: "",
//     active: true,
//     bookId: "",
//     bookName: "",
//     originalPrice: "",
//     discount: "",
//     createdByEmployeeId: "",
//   })

//   useEffect(() => {
//     const fetchCurrentEmployee = async () => {
//       try {
//         setCurrentEmployeeLoading(true)
//         const userId = localStorage.getItem("userId")
//         console.log("[v0] User ID from localStorage:", userId)

//         if (!userId) {
//           message.error("Vui lòng đăng nhập trước")
//           setCurrentEmployeeLoading(false)
//           return
//         }

//         const response = await fetch(`http://localhost:5000/api/employeesID/user/${userId}`)
//         if (!response.ok) throw new Error("Failed to fetch employee")
//         const data = await response.json()
//         console.log("[v0] Current employee fetched:", data)

//         const employee = data.data || data
//         setCurrentEmployee(employee)
//         setFormData((prev) => ({
//           ...prev,
//           createdByEmployeeId: employee._id || employee.id,
//         }))
//       } catch (err) {
//         console.error("[v0] Error fetching current employee:", err)
//         message.error("Lỗi khi lấy thông tin nhân viên")
//       } finally {
//         setCurrentEmployeeLoading(false)
//       }
//     }

//     fetchCurrentEmployee()
//     fetchBooks()
//     // fetchEmployees()
//     fetchPromotions()
//   }, [])

//   const fetchBooks = async () => {
//     try {
//       setBooksLoading(true)
//       const response = await fetch("http://localhost:5000/api/books")
//       if (!response.ok) throw new Error("Failed to fetch books")
//       const data = await response.json()
//       console.log("[v0] Books fetched:", data)
//       setBooks(data.data || data)
//     } catch (err) {
//       console.error("[v0] Error fetching books:", err)
//       message.error("Lỗi khi tải danh sách sách")
//     } finally {
//       setBooksLoading(false)
//     }
//   }

//   const fetchPromotions = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/promotions")
//       if (!response.ok) throw new Error("Failed to fetch promotions")
//       const data = await response.json()
//       console.log("[v0] Promotions fetched:", data)
//       setPromotions(data.data || data)
//     } catch (err) {
//       console.error("[v0] Error fetching promotions:", err)
//       message.error("Lỗi khi tải danh sách khuyến mãi")
//     }
//   }

//   const handleBookChange = (e) => {
//     const bookId = e.target.value
//     const selectedBook = books.find((b) => b._id === bookId || b.id === bookId)

//     if (selectedBook) {
//       setFormData((prev) => ({
//         ...prev,
//         bookId: bookId,
//         bookName: selectedBook.title || selectedBook.name,
//         originalPrice: selectedBook.price || "",
//       }))
//       console.log("[v0] Book selected:", selectedBook)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
//   }

//   const calculateSellingPrice = () => {
//     const original = Number(formData.originalPrice) || 0
//     const discount = Number(formData.discount) || 0
//     return Math.max(0, original - discount)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       if (discountType === "by-book") {
//         if (
//           !formData.title ||
//           !formData.bookId ||
//           !formData.originalPrice ||
//           !formData.discount ||
//           !formData.createdByEmployeeId
//         ) {
//           message.error("Vui lòng điền đầy đủ thông tin!")
//           setLoading(false)
//           return
//         }

//         const sellingPrice = calculateSellingPrice()
//         const promotionData = {
//           title: formData.title,
//           type: "by-book",
//           bookId: formData.bookId,
//           originalPrice: Number(formData.originalPrice),
//           discountAmount: Number(formData.discount),
//           sellingPrice: sellingPrice,
//           createdByEmployeeId: formData.createdByEmployeeId,
//           status: formData.active ? "active" : "inactive",
//         }

//         console.log("[v0] Submitting by-book promotion:", promotionData)
//         const response = await fetch("http://localhost:5000/api/promotions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(promotionData),
//         })

//         if (!response.ok) {
//           const errorData = await response.json()
//           throw new Error(errorData.message || "Failed to create promotion")
//         }

//         message.success("Tạo khuyến mãi thành công!")
//         setFormData({
//           title: "",
//           minOrder: "",
//           value: "",
//           maxDiscount: "",
//           startDate: "",
//           endDate: "",
//           active: true,
//           bookId: "",
//           bookName: "",
//           originalPrice: "",
//           discount: "",
//           createdByEmployeeId: "",
//         })
//         fetchPromotions()
//       } else {
//         if (
//           !formData.title ||
//           !formData.minOrder ||
//           !formData.value ||
//           !formData.startDate ||
//           !formData.endDate ||
//           !formData.createdByEmployeeId
//         ) {
//           message.error("Vui lòng điền đầy đủ thông tin!")
//           setLoading(false)
//           return
//         }

//         const promotionData = {
//           title: formData.title,
//           type: discountType,
//           minOrderValue: Number(formData.minOrder),
//           discountAmount: discountType === "fixed" ? Number(formData.value) : undefined,
//           discountPercent: discountType === "percent" ? Number(formData.value) : undefined,
//           maxDiscount: discountType === "percent" ? Number(formData.maxDiscount) : undefined,
//           startDate: formData.startDate,
//           endDate: formData.endDate,
//           createdByEmployeeId: formData.createdByEmployeeId,
//           status: formData.active ? "active" : "inactive",
//         }

//         console.log("[v0] Submitting promotion:", promotionData)
//         const response = await fetch("http://localhost:5000/api/promotions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(promotionData),
//         })

//         if (!response.ok) {
//           const errorData = await response.json()
//           throw new Error(errorData.message || "Failed to create promotion")
//         }

//         message.success("Tạo khuyến mãi thành công!")
//         setFormData({
//           title: "",
//           minOrder: "",
//           value: "",
//           maxDiscount: "",
//           startDate: "",
//           endDate: "",
//           active: true,
//           bookId: "",
//           bookName: "",
//           originalPrice: "",
//           discount: "",
//           createdByEmployeeId: "",
//         })
//         fetchPromotions()
//       }
//     } catch (err) {
//       console.error("[v0] Error submitting promotion:", err)
//       message.error(err.message || "Lỗi khi tạo khuyến mãi")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateDescription = (data, type) => {
//     const minOrder = Number(data.minOrderValue).toLocaleString("vi-VN")
//     if (type === "fixed") {
//       const discount = Number(data.discountAmount).toLocaleString("vi-VN")
//       return `Mua từ ${minOrder} ₫ giảm ${discount} ₫`
//     } else {
//       const percent = data.discountPercent
//       const maxDiscount = data.maxDiscount ? ` tối đa ${Number(data.maxDiscount).toLocaleString("vi-VN")} ₫` : ""
//       return `Mua từ ${minOrder} ₫ giảm ${percent}%${maxDiscount}`
//     }
//   }

//   const deletePromotion = (id) => {
//     Modal.confirm({
//       title: "Xác nhận xóa khuyến mãi",
//       content: "Bạn có chắc muốn xóa khuyến mãi này không?",
//       okText: "Xóa",
//       cancelText: "Hủy",
//       okType: "danger",
//       async onOk() {
//         try {
//           const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
//             method: "DELETE",
//           })
//           if (!response.ok) throw new Error("Failed to delete promotion")
//           message.success("Xóa khuyến mãi thành công!")
//           fetchPromotions()
//         } catch (err) {
//           console.error("[v0] Error deleting promotion:", err)
//           message.error("Lỗi khi xóa khuyến mãi")
//         }
//       },
//     })
//   }

//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const newStatus = currentStatus === "active" ? "inactive" : "active"
//       const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       })
//       if (!response.ok) throw new Error("Failed to update promotion")
//       message.success("Cập nhật trạng thái thành công!")
//       fetchPromotions()
//     } catch (err) {
//       console.error("[v0] Error updating promotion:", err)
//       message.error("Lỗi khi cập nhật trạng thái")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex gap-6">
//       {/* ------------------- FORM ------------------- */}
//       <div className="bg-white rounded-xl shadow-lg p-6 flex-1 h-fit">
//         <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-purple-700">
//           <TagIcon /> Tạo Khuyến Mãi Mới
//         </h2>
//         <p className="text-gray-500 mb-6 text-sm">Thiết lập chương trình khuyến mãi cho khách hàng</p>

//         <form onSubmit={handleSubmit}>
//           {/* Title */}
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2 font-medium">Tên chương trình</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="VD: Khuyến mãi mùa hè"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2 font-medium">Người lập</label>
//             {currentEmployeeLoading ? (
//               <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500">
//                 Đang tải thông tin...
//               </div>
//             ) : currentEmployee ? (
//               <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-blue-50 text-gray-700 font-medium">
//                 {currentEmployee.firstName} {currentEmployee.lastName} {currentEmployee.email}
//               </div>
//             ) : (
//               <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-red-50 text-red-600">
//                 Không tìm thấy thông tin nhân viên
//               </div>
//             )}
//           </div>

//           {/* Discount type */}
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2 font-medium">Loại giảm giá</label>
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
//                   discountType === "fixed"
//                     ? "bg-purple-500 text-white border-purple-500 shadow-md"
//                     : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
//                 }`}
//                 onClick={() => setDiscountType("fixed")}
//               >
//                 <MoneyIcon /> Giảm cố định
//               </button>
//               <button
//                 type="button"
//                 className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
//                   discountType === "percent"
//                     ? "bg-purple-500 text-white border-purple-500 shadow-md"
//                     : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
//                 }`}
//                 onClick={() => setDiscountType("percent")}
//               >
//                 <PercentIcon /> Giảm phần trăm
//               </button>
//               <button
//                 type="button"
//                 className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
//                   discountType === "by-book"
//                     ? "bg-purple-500 text-white border-purple-500 shadow-md"
//                     : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
//                 }`}
//                 onClick={() => setDiscountType("by-book")}
//               >
//                 <BookIcon /> Giảm theo sách
//               </button>
//             </div>
//           </div>

//           {discountType === "by-book" ? (
//             <>
//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2 font-medium">Chọn sách</label>
//                 <select
//                   name="bookId"
//                   value={formData.bookId}
//                   onChange={handleBookChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="">-- Chọn sách --</option>
//                   {booksLoading ? (
//                     <option disabled>Đang tải...</option>
//                   ) : (
//                     books.map((book) => (
//                       <option key={book._id || book.id} value={book._id || book.id}>
//                         {book.title || book.name}- Tập {book.volume || "Truyện ngắn"} - {Number(book.price).toLocaleString("vi-VN")} ₫
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2 font-medium">Giá gốc (VND)</label>
//                 <input
//                   type="number"
//                   name="originalPrice"
//                   value={formData.originalPrice}
//                   onChange={handleInputChange}
//                   placeholder="0"
//                   disabled
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 cursor-not-allowed"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Giá gốc tự động lấy từ sách đã chọn</p>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2 font-medium">Số tiền giảm (VND)</label>
//                 <input
//                   type="number"
//                   name="discount"
//                   value={formData.discount}
//                   onChange={handleInputChange}
//                   placeholder="0"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               {/* Display calculated selling price */}
//               <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className="text-gray-700 font-medium mb-2">Giá bán sau giảm:</p>
//                 <p className="text-2xl font-bold text-green-600">{calculateSellingPrice().toLocaleString("vi-VN")} ₫</p>
//               </div>

//               <div className="mb-6 flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="active"
//                   name="active"
//                   checked={formData.active}
//                   onChange={handleInputChange}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <label htmlFor="active" className="text-gray-700 font-medium">
//                   Kích hoạt ngay
//                 </label>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Min order */}
//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2 font-medium">Giá trị đơn hàng tối thiểu (VND)</label>
//                 <input
//                   type="number"
//                   name="minOrder"
//                   value={formData.minOrder}
//                   onChange={handleInputChange}
//                   placeholder="0"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               {/* Discount value */}
//               {discountType === "percent" ? (
//                 <>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2 font-medium">Phần trăm giảm (%)</label>
//                     <input
//                       type="number"
//                       name="value"
//                       value={formData.value}
//                       onChange={handleInputChange}
//                       placeholder="0"
//                       max="100"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 mb-2 font-medium">Giảm tối đa (VND)</label>
//                     <input
//                       type="number"
//                       name="maxDiscount"
//                       value={formData.maxDiscount}
//                       onChange={handleInputChange}
//                       placeholder="0"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2 font-medium">Số tiền giảm (VND)</label>
//                   <input
//                     type="number"
//                     name="value"
//                     value={formData.value}
//                     onChange={handleInputChange}
//                     placeholder="0"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               )}

//               {/* Date */}
//               <div className="mb-4 flex gap-3">
//                 <div className="flex-1">
//                   <label className="block text-gray-700 mb-2 font-medium">Ngày bắt đầu</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="block text-gray-700 mb-2 font-medium">Ngày kết thúc</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>

//               {/* Active */}
//               <div className="mb-6 flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="active"
//                   name="active"
//                   checked={formData.active}
//                   onChange={handleInputChange}
//                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                 />
//                 <label htmlFor="active" className="text-gray-700 font-medium">
//                   Kích hoạt ngay
//                 </label>
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Đang tạo..." : "Tạo Khuyến Mãi"}
//           </button>
//         </form>
//       </div>

//       {/* ------------------- DANH SÁCH ------------------- */}
//       <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700">
//             <TagIcon /> Danh Sách Khuyến Mãi
//           </h2>
//           <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
//             {promotions.length} khuyến mãi
//           </span>
//         </div>

//         <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
//           {promotions.length === 0 ? (
//             <div className="text-center py-12 text-gray-400">
//               <TagIcon />
//               <p className="mt-2">Chưa có khuyến mãi nào</p>
//             </div>
//           ) : (
//             promotions.map((promo) => (
//               <div
//                 key={promo._id || promo.id}
//                 className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-start gap-3 flex-1">
//                     <div
//                       className={`p-2 rounded-lg ${
//                         promo.type === "percent"
//                           ? "bg-blue-100 text-blue-600"
//                           : promo.type === "by-book"
//                             ? "bg-orange-100 text-orange-600"
//                             : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {promo.type === "percent" ? (
//                         <PercentIcon />
//                       ) : promo.type === "by-book" ? (
//                         <BookIcon />
//                       ) : (
//                         <MoneyIcon />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 text-lg">{promo.title}</h3>
//                       <p className="text-gray-600 text-sm mt-1">
//                         {promo.type === "by-book"
//                           ? `${promo.bookName || "Sách"}: Giá gốc ${Number(promo.originalPrice).toLocaleString("vi-VN")} ₫ → Giá bán ${Number(promo.sellingPrice).toLocaleString("vi-VN")} ₫ (giảm ${Number(promo.discountAmount).toLocaleString("vi-VN")} ₫)`
//                           : generateDescription(promo, promo.type)}
//                       </p>
//                       {promo.type !== "by-book" && (
//                         <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
//                           <CalendarIcon />
//                           <span>
//                             {new Date(promo.startDate).toLocaleDateString("vi-VN")} →{" "}
//                             {new Date(promo.endDate).toLocaleDateString("vi-VN")}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => toggleStatus(promo._id || promo.id, promo.status)}
//                     className={`text-sm font-medium px-3 py-1 rounded-full ${
//                       promo.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     {promo.status === "active" ? "Đang hoạt động" : "Đã tắt"}
//                   </button>
//                 </div>
//                 <div className="flex gap-3 mt-2">
//                   <button
//                     onClick={() => message.info("Chức năng chỉnh sửa chưa implement")}
//                     className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
//                   >
//                     <EditIcon /> Chỉnh sửa
//                   </button>
//                   <button
//                     onClick={() => deletePromotion(promo._id || promo.id)}
//                     className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
//                   >
//                     <TrashIcon /> Xóa
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { message, Modal } from "antd"
import { Book } from "lucide-react"

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

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c5.5 0 10 4.747 10 11.002M12 6.253L4.5 17.25m7.5-10.997h2m-2 0h2"
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
  const [promotions, setPromotions] = useState([])
  const [books, setBooks] = useState([])
  const [employees, setEmployees] = useState([])

  const [loading, setLoading] = useState(false)
  const [booksLoading, setBooksLoading] = useState(true)
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [currentEmployeeLoading, setCurrentEmployeeLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    minOrder: "",
    value: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    active: true,
    bookId: "",
    bookName: "",
    originalPrice: "",
    discount: "",
    createdByEmployeeId: "",
  })

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      try {
        setCurrentEmployeeLoading(true)
        const userId = localStorage.getItem("userId")
        console.log("[v0] User ID from localStorage:", userId)

        if (!userId) {
          message.error("Vui lòng đăng nhập trước")
          setCurrentEmployeeLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5000/api/employeesID/user/${userId}`)
        if (!response.ok) throw new Error("Failed to fetch employee")
        const data = await response.json()
        console.log("[v0] Current employee fetched:", data)

        const employee = data.data || data
        setCurrentEmployee(employee)
        setFormData((prev) => ({
          ...prev,
          createdByEmployeeId: employee._id || employee.id,
        }))
      } catch (err) {
        console.error("[v0] Error fetching current employee:", err)
        message.error("Lỗi khi lấy thông tin nhân viên")
      } finally {
        setCurrentEmployeeLoading(false)
      }
    }

    fetchCurrentEmployee()
    fetchBooks()
    fetchPromotions()
  }, [])

  const fetchBooks = async () => {
    try {
      setBooksLoading(true)
      const response = await fetch("http://localhost:5000/api/books")
      if (!response.ok) throw new Error("Failed to fetch books")
      const data = await response.json()
      console.log("[v0] Books fetched:", data)
      setBooks(data.data || data)
    } catch (err) {
      console.error("[v0] Error fetching books:", err)
      message.error("Lỗi khi tải danh sách sách")
    } finally {
      setBooksLoading(false)
    }
  }

  const fetchPromotions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/promotions")
      if (!response.ok) throw new Error("Failed to fetch promotions")
      const data = await response.json()
      console.log("[v0] Promotions fetched:", data)
      setPromotions(data.data || data)
    } catch (err) {
      console.error("[v0] Error fetching promotions:", err)
      message.error("Lỗi khi tải danh sách khuyến mãi")
    }
  }

  const handleBookChange = (e) => {
    const bookId = e.target.value
    const selectedBook = books.find((b) => b._id === bookId || b.id === bookId)

    if (selectedBook) {
      setFormData((prev) => ({
        ...prev,
        bookId: bookId,
        bookName: selectedBook.title || selectedBook.name,
        originalPrice: selectedBook.price || "",
      }))
      console.log("[v0] Book selected:", selectedBook)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const calculateSellingPrice = () => {
    const original = Number(formData.originalPrice) || 0
    const discount = Number(formData.discount) || 0
    return Math.max(0, original - discount)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (discountType === "by-book") {
        if (
          !formData.title ||
          !formData.bookId ||
          !formData.originalPrice ||
          !formData.discount ||
          !formData.startDate ||
          !formData.endDate ||
          !formData.createdByEmployeeId
        ) {
          message.error("Vui lòng điền đầy đủ thông tin!")
          setLoading(false)
          return
        }

        const sellingPrice = calculateSellingPrice()
        const promotionData = {
          title: formData.title,
          type: "by-book",
          bookId: formData.bookId,
          originalPrice: Number(formData.originalPrice),
          discountAmount: Number(formData.discount),
          sellingPrice: sellingPrice,
          startDate: formData.startDate,
          endDate: formData.endDate,
          createdByEmployeeId: formData.createdByEmployeeId,
          status: formData.active ? "active" : "inactive",
        }

        console.log("[v0] Submitting by-book promotion:", promotionData)
        const response = await fetch("http://localhost:5000/api/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promotionData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create promotion")
        }

        message.success("Tạo khuyến mãi thành công!")
        setFormData({
          title: "",
          minOrder: "",
          value: "",
          maxDiscount: "",
          startDate: "",
          endDate: "",
          active: true,
          bookId: "",
          bookName: "",
          originalPrice: "",
          discount: "",
          createdByEmployeeId: "",
        })
        fetchPromotions()
      } else {
        if (
          !formData.title ||
          !formData.minOrder ||
          !formData.value ||
          !formData.startDate ||
          !formData.endDate ||
          !formData.createdByEmployeeId
        ) {
          message.error("Vui lòng điền đầy đủ thông tin!")
          setLoading(false)
          return
        }

        const promotionData = {
          title: formData.title,
          type: discountType,
          minOrderValue: Number(formData.minOrder),
          discountAmount: discountType === "fixed" ? Number(formData.value) : undefined,
          discountPercent: discountType === "percent" ? Number(formData.value) : undefined,
          maxDiscount: discountType === "percent" ? Number(formData.maxDiscount) : undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
          createdByEmployeeId: formData.createdByEmployeeId,
          status: formData.active ? "active" : "inactive",
        }

        console.log("[v0] Submitting promotion:", promotionData)
        const response = await fetch("http://localhost:5000/api/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promotionData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create promotion")
        }

        message.success("Tạo khuyến mãi thành công!")
        setFormData({
          title: "",
          minOrder: "",
          value: "",
          maxDiscount: "",
          startDate: "",
          endDate: "",
          active: true,
          bookId: "",
          bookName: "",
          originalPrice: "",
          discount: "",
          createdByEmployeeId: "",
        })
        fetchPromotions()
      }
    } catch (err) {
      console.error("[v0] Error submitting promotion:", err)
      message.error(err.message || "Lỗi khi tạo khuyến mãi")
    } finally {
      setLoading(false)
    }
  }

  const generateDescription = (data, type) => {
    const minOrder = Number(data.minOrderValue).toLocaleString("vi-VN")
    if (type === "fixed") {
      const discount = Number(data.discountAmount).toLocaleString("vi-VN")
      return `Mua từ ${minOrder} ₫ giảm ${discount} ₫`
    } else {
      const percent = data.discountPercent
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
      async onOk() {
        try {
          const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
            method: "DELETE",
          })
          if (!response.ok) throw new Error("Failed to delete promotion")
          message.success("Xóa khuyến mãi thành công!")
          fetchPromotions()
        } catch (err) {
          console.error("[v0] Error deleting promotion:", err)
          message.error("Lỗi khi xóa khuyến mãi")
        }
      },
    })
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error("Failed to update promotion")
      message.success("Cập nhật trạng thái thành công!")
      fetchPromotions()
    } catch (err) {
      console.error("[v0] Error updating promotion:", err)
      message.error("Lỗi khi cập nhật trạng thái")
    }
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

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Người lập</label>
            {currentEmployeeLoading ? (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500">
                Đang tải thông tin...
              </div>
            ) : currentEmployee ? (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-blue-50 text-gray-700 font-medium">
                {currentEmployee.firstName} {currentEmployee.lastName} {currentEmployee.email}
              </div>
            ) : (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-red-50 text-red-600">
                Không tìm thấy thông tin nhân viên
              </div>
            )}
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
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  discountType === "by-book"
                    ? "bg-purple-500 text-white border-purple-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                }`}
                onClick={() => setDiscountType("by-book")}
              >
                <Book /> Giảm theo sách
              </button>
            </div>
          </div>

          {discountType === "by-book" ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Chọn sách</label>
                <select
                  name="bookId"
                  value={formData.bookId}
                  onChange={handleBookChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Chọn sách --</option>
                  {booksLoading ? (
                    <option disabled>Đang tải...</option>
                  ) : (
                    books.map((book) => (
                      <option key={book._id || book.id} value={book._id || book.id}>
                        {book.title || book.name}- Tập {book.volume || "Truyện ngắn"} -{" "}
                        {Number(book.price).toLocaleString("vi-VN")} ₫
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Giá gốc (VND)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0"
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Giá gốc tự động lấy từ sách đã chọn</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Số tiền giảm (VND)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

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

              {/* Display calculated selling price */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-gray-700 font-medium mb-2">Giá bán sau giảm:</p>
                <p className="text-2xl font-bold text-green-600">{calculateSellingPrice().toLocaleString("vi-VN")} ₫</p>
              </div>

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
            </>
          ) : (
            <>
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
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo..." : "Tạo Khuyến Mãi"}
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
                key={promo._id || promo.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        promo.type === "percent"
                          ? "bg-blue-100 text-blue-600"
                          : promo.type === "by-book"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {promo.type === "percent" ? (
                        <PercentIcon />
                      ) : promo.type === "by-book" ? (
                        <BookIcon />
                      ) : (
                        <MoneyIcon />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{promo.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {promo.type === "by-book"
                          ? `${promo.bookName || "Sách"}: Giá gốc ${Number(promo.originalPrice).toLocaleString("vi-VN")} ₫ → Giá bán ${Number(promo.sellingPrice).toLocaleString("vi-VN")} ₫ (giảm ${Number(promo.discountAmount).toLocaleString("vi-VN")} ₫)`
                          : generateDescription(promo, promo.type)}
                      </p>
                      {promo.startDate && promo.endDate && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <CalendarIcon />
                          <span>
                            {new Date(promo.startDate).toLocaleDateString("vi-VN")} →{" "}
                            {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(promo._id || promo.id, promo.status)}
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      promo.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {promo.status === "active" ? "Đang hoạt động" : "Đã tắt"}
                  </button>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => message.info("Chức năng chỉnh sửa chưa implement")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <EditIcon /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => deletePromotion(promo._id || promo.id)}
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

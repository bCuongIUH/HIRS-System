// "use client"

// import { useState, useEffect } from "react"
// import { Search, MoreHorizontal, PlusCircle, X, Upload, User } from "lucide-react"
// import { toast } from "react-toastify"
// import { getEmployees, addEmployee, deleteEmployee } from "../utils/employeeApi"

// function Employees() {
//   const [employees, setEmployees] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [departmentFilter, setDepartmentFilter] = useState("all")
//   const [activeDropdown, setActiveDropdown] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [departments, setDepartments] = useState([])
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [newEmployee, setNewEmployee] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     gender: "male",
//     dateOfBirth: "",
//     joinDate: new Date().toISOString().split("T")[0],
   
//   })
//   const [formErrors, setFormErrors] = useState({})
// console.log("user",employees);


//   // Toggle dropdown menu
//   const toggleDropdown = (id) => {
//     setActiveDropdown(activeDropdown === id ? null : id)
//   }

//   // Handle input change for new employee form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".")
//       setNewEmployee({
//         ...newEmployee,
//         [parent]: {
//           ...newEmployee[parent],
//           [child]: value,
//         },
//       })
//     } else {
//       setNewEmployee({
//         ...newEmployee,
//         [name]: value,
//       })
//     }
//   }
// // ✅ useEffect lấy dữ liệu nhân viên và phòng ban
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true)
//         const employeeResponse = await getEmployees()
//         setEmployees(employeeResponse.data || [])
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu:", error)
//         toast.error("Không thể tải danh sách nhân viên")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [])
//   // Validate form
//   const validateForm = () => {
//     const errors = {}
//     if (!newEmployee.firstName) errors.firstName = "Vui lòng nhập tên"
//     if (!newEmployee.lastName) errors.lastName = "Vui lòng nhập họ"
//     if (!newEmployee.email) {
//       errors.email = "Vui lòng nhập email"
//     } else if (!/^\S+@\S+\.\S+$/.test(newEmployee.email)) {
//       errors.email = "Email không hợp lệ"
//     }
//     if (!newEmployee.phone) errors.phone = "Vui lòng nhập số điện thoại"
//     if (!newEmployee.dateOfBirth) errors.dateOfBirth = "Vui lòng nhập ngày sinh"
//     if (!newEmployee.joinDate) errors.joinDate = "Vui lòng nhập ngày vào làm"


//     setFormErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     try {
//       setIsLoading(true)

//       // Call API to add employee
//       const response = await addEmployee(newEmployee)

//       // Add new employee to the list
//       setEmployees([...employees, response.data])

//       // Reset form and close modal
//       setNewEmployee({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         gender: "male",
//         dateOfBirth: "",
//         joinDate: new Date().toISOString().split("T")[0],
//         // salary: {
//         //   baseSalary: 0,
//         // },
//       })
//       setShowAddModal(false)
//       toast.success("Thêm nhân viên thành công!")
//     } catch (error) {
//       console.error("Error adding employee:", error)
//       toast.error(error.message || "Lỗi khi thêm nhân viên")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle delete employee
//   const handleDeleteEmployee = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
//       try {
//         setIsLoading(true)

//         // Call API to delete employee
//         await deleteEmployee(id, { deleteUser: true })

//         // Remove employee from the list
//         setEmployees(employees.filter((employee) => employee._id !== id))

//         toast.success("Xóa nhân viên thành công!")
//       } catch (error) {
//         console.error("Error deleting employee:", error)
//         toast.error(error.message || "Lỗi khi xóa nhân viên")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   // Filter employees based on search term and department
//   const filteredEmployees = employees.filter((employee) => {
//     const fullName = `${employee.firstName} ${employee.lastName}`
//     const matchesSearch =
//       fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) 
//             // (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()))

//     const matchesDepartment =
//       departmentFilter === "all" || (employee.department && employee.department._id === departmentFilter)

//     return matchesSearch && matchesDepartment
//   })

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h1>
//           <p className="text-gray-500">Quản lý thông tin nhân viên trong hệ thống.</p>
//         </div>
//         <button
//           className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//           onClick={() => setShowAddModal(true)}
//         >
//           <PlusCircle className="h-4 w-4" />
//           Thêm nhân viên
//         </button>
//       </div>

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="search"
//             placeholder="Tìm nhân viên..."
//             className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[180px]"
//           value={departmentFilter}
//           onChange={(e) => setDepartmentFilter(e.target.value)}
//         >
//           <option value="all">Tất cả phòng ban</option>
//           {departments.map((department) => (
//             <option key={department._id} value={department._id}>
//               {department.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="overflow-x-auto rounded-lg border">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 Nhân viên
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 ID
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 Chức vụ
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 Ngày vào làm
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 Trạng thái
//               </th>
//               <th
//                 scope="col"
//                 className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
//               >
//                 Thao tác
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {isLoading ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                   Đang tải dữ liệu...
//                 </td>
//               </tr>
//             ) : filteredEmployees.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                   Không tìm thấy nhân viên nào.
//                 </td>
//               </tr>
//             ) : (
//               filteredEmployees.map((employee) => (
//                 <tr key={employee._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
//                         {employee.avatar ? (
//                           <img
//                             src={employee.avatar || "/placeholder.svg"}
//                             alt={`${employee.firstName} ${employee.lastName}`}
//                             className="h-full w-full object-cover"
//                             onError={(e) => {
//                               e.target.onerror = null
//                               e.target.src = "https://img.pikbest.com/png-images/20240905/medical-staff-avatars-and-doctor-vector-white-background-png_10806814.png!sw800"
//                             }}
//                           />
//                         ) : (
//                           <div className="h-full w-full bg-blue-100 flex items-center justify-center">
//                             <span className="text-blue-600 font-medium">{employee.firstName.charAt(0)}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {employee.firstName} {employee.lastName}
//                         </div>
//                         <div className="text-sm text-gray-500">{employee.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeId}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {employee.role === "admin"
//                       ? "Quản lý"
//                       : employee.role === "employee"
//                       ? "Nhân viên"
//                       : "Chưa phân công"}
//                   </td>

//                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td> */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(employee.joinDate).toLocaleDateString("vi-VN")}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
//                         employee.employmentStatus === "active"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {employee.employmentStatus === "active" ? "Đang làm việc" : "Nghỉ việc"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="relative">
//                       <button
//                         className="text-gray-500 hover:text-gray-700"
//                         onClick={() => toggleDropdown(employee._id)}
//                       >
//                         <MoreHorizontal className="h-5 w-5" />
//                       </button>

//                     {activeDropdown === employee._id && (
//                       <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10 text-left">
//                         <a
//                           href="#"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                         >
//                           Xem chi tiết
//                         </a>
//                         <a
//                           href="#"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                         >
//                           Chỉnh sửa
//                         </a>
                       
//                         <button
//                           className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           onClick={() => handleDeleteEmployee(employee._id)}
//                         >
//                           Xóa nhân viên
//                         </button>
//                       </div>
//                     )}

//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal thêm nhân viên */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             {/* Nền mờ */}
//             <div
//               className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
//               onClick={() => setShowAddModal(false)}
//             ></div>

//             <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
//               &#8203;
//             </span>

//             {/* Hộp modal */}
//             <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 {/* Header */}
//                 <div className="flex items-center justify-between border-b pb-3">
//                   <h3 className="text-lg font-medium leading-6 text-gray-900">Thêm nhân viên mới</h3>
//                   <button
//                     type="button"
//                     className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
//                     onClick={() => setShowAddModal(false)}
//                   >
//                     <span className="sr-only">Đóng</span>
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>

//                 {/* Form thêm nhân viên */}
//                 <form onSubmit={handleSubmit} className="mt-4">
//                   <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">

//                     {/* Họ */}
//                     <div>
//                       <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                         Họ <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         id="lastName"
//                         value={newEmployee.lastName}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border ${
//                           formErrors.lastName ? "border-red-500" : "border-gray-300"
//                         } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
//                       />
//                       {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
//                     </div>

//                     {/* Tên */}
//                     <div>
//                       <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                         Tên <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         id="firstName"
//                         value={newEmployee.firstName}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border ${
//                           formErrors.firstName ? "border-red-500" : "border-gray-300"
//                         } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
//                       />
//                       {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
//                     </div>

//                     {/* Email */}
//                     <div className="sm:col-span-2">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                         Email <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         value={newEmployee.email}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border ${
//                           formErrors.email ? "border-red-500" : "border-gray-300"
//                         } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
//                       />
//                       {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
//                     </div>

//                     {/* Số điện thoại */}
//                     <div className="sm:col-span-2">
//                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                         Số điện thoại <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="phone"
//                         id="phone"
//                         value={newEmployee.phone}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border ${
//                           formErrors.phone ? "border-red-500" : "border-gray-300"
//                         } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
//                       />
//                       {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
//                     </div>

//                     {/* Giới tính */}
//                     <div>
//                       <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
//                         Giới tính
//                       </label>
//                       <select
//                         name="gender"
//                         id="gender"
//                         value={newEmployee.gender}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="male">Nam</option>
//                         <option value="female">Nữ</option>
//                         <option value="other">Khác</option>
//                       </select>
//                     </div>

//                     {/* Ngày sinh */}
//                     <div>
//                       <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
//                         Ngày sinh <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="date"
//                         name="dateOfBirth"
//                         id="dateOfBirth"
//                         value={newEmployee.dateOfBirth}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border ${
//                           formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"
//                         } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
//                       />
//                       {formErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>}
//                     </div>
//                   </div>

//                   {/* Nút thao tác */}
//                   <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
//                     <button
//                       type="submit"
//                       className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? "Đang xử lý..." : "Thêm nhân viên"}
//                     </button>
//                     <button
//                       type="button"
//                       className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
//                       onClick={() => setShowAddModal(false)}
//                     >
//                       Hủy
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default Employees
"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, PlusCircle, X } from "lucide-react"
import { toast } from "react-toastify"
import { getEmployees, addEmployee, deleteEmployee } from "../utils/employeeApi"

function Employees() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    joinDate: new Date().toISOString().split("T")[0],
  })
  const [formErrors, setFormErrors] = useState({})

  // ✅ Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const employeeResponse = await getEmployees()
      setEmployees(employeeResponse.data || [])
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error)
      toast.error("Không thể tải danh sách nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // ✅ Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // ✅ Handle input form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ✅ Validate form
  const validateForm = () => {
    const errors = {}
    if (!newEmployee.firstName) errors.firstName = "Vui lòng nhập tên"
    if (!newEmployee.lastName) errors.lastName = "Vui lòng nhập họ"
    if (!newEmployee.email) {
      errors.email = "Vui lòng nhập email"
    } else if (!/^\S+@\S+\.\S+$/.test(newEmployee.email)) {
      errors.email = "Email không hợp lệ"
    }
    if (!newEmployee.phone) errors.phone = "Vui lòng nhập số điện thoại"
    if (!newEmployee.dateOfBirth) errors.dateOfBirth = "Vui lòng nhập ngày sinh"
    if (!newEmployee.joinDate) errors.joinDate = "Vui lòng nhập ngày vào làm"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ✅ Thêm nhân viên mới
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      await addEmployee(newEmployee)
      toast.success("Thêm nhân viên thành công!")
      setShowAddModal(false)
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "male",
        dateOfBirth: "",
        joinDate: new Date().toISOString().split("T")[0],
      })

      // ✅ Refetch dữ liệu ngay sau khi thêm
      fetchEmployees()
    } catch (error) {
      console.error("Error adding employee:", error)
      toast.error(error.message || "Lỗi khi thêm nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Xóa nhân viên (đổi trạng thái nghỉ việc + refetch)
  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn cho nhân viên này nghỉ việc?")) {
      try {
        setIsLoading(true)
        await deleteEmployee(id, { deleteUser: true })
        toast.success("Đã cập nhật trạng thái nhân viên thành nghỉ việc!")

        // ✅ Refetch lại dữ liệu sau khi xóa (nghỉ việc)
        fetchEmployees()
      } catch (error) {
        console.error("Error deleting employee:", error)
        toast.error(error.message || "Lỗi khi cập nhật trạng thái nhân viên")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // ✅ Lọc nhân viên
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      fullName.includes(search) ||
      (employee.email && employee.email.toLowerCase().includes(search))
    const matchesDepartment =
      departmentFilter === "all" ||
      (employee.department && employee.department._id === departmentFilter)
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h1>
          <p className="text-gray-500">Quản lý thông tin nhân viên trong hệ thống.</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Thêm nhân viên
        </button>
      </div>

      {/* Thanh tìm kiếm + lọc */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm nhân viên..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-[180px]"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bảng danh sách nhân viên */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Chức vụ</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Ngày vào làm</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {employee.firstName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{employee.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {employee.role === "admin" ? "Quản lý" : "Nhân viên"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(employee.joinDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        employee.employmentStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.employmentStatus === "active" ? "Đang làm việc" : "Nghỉ việc"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >
                      Cho nghỉ việc
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm nhân viên */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-semibold">Thêm nhân viên mới</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Họ</label>
                    <input
                      name="lastName"
                      value={newEmployee.lastName}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Tên</label>
                    <input
                      name="firstName"
                      value={newEmployee.firstName}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm">Số điện thoại</label>
                  <input
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees

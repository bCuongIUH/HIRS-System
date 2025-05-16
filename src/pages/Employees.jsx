// "use client"

// import { useState } from "react"
// import { PlusCircle, Search } from "lucide-react"
// import Button from "../components/ui/Button"
// import Input from "../components/ui/Input"
// import Select from "../components/ui/Select"
// import Table from "../components/ui/Table"
// import Badge from "../components/ui/Badge"
// import Avatar from "../components/ui/Avatar"
// import Dropdown from "../components/ui/Dropdown"
// import { employeesData } from "../data/employees"

// function Employees() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [departmentFilter, setDepartmentFilter] = useState("all")

//   // Filter employees based on search term and department
//   const filteredEmployees = employeesData.filter((employee) => {
//     const matchesSearch =
//       employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.position.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter

//     return matchesSearch && matchesDepartment
//   })

//   // Get unique departments for filter
//   const departments = Array.from(new Set(employeesData.map((employee) => employee.department)))
//   const departmentOptions = [
//     { value: "all", label: "Tất cả phòng ban" },
//     ...departments.map((dept) => ({ value: dept, label: dept })),
//   ]

//   // Table columns
//   const columns = [
//     {
//       header: "Nhân viên",
//       accessor: "name",
//       cell: (row) => (
//         <div className="flex items-center gap-3">
//           <Avatar src={row.avatar} alt={row.name} initials={row.name.charAt(0)} size="sm" />
//           <div className="flex flex-col">
//             <span className="font-medium">{row.name}</span>
//             <span className="text-xs text-gray-500">{row.email}</span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       header: "ID",
//       accessor: "id",
//     },
//     {
//       header: "Phòng ban",
//       accessor: "department",
//     },
//     {
//       header: "Vị trí",
//       accessor: "position",
//     },
//     {
//       header: "Ngày vào làm",
//       accessor: "joinDate",
//     },
//     {
//       header: "Trạng thái",
//       accessor: "status",
//       cell: (row) => <Badge variant={row.status === "Đang làm việc" ? "success" : "default"}>{row.status}</Badge>,
//     },
//     {
//       header: "Thao tác",
//       accessor: "actions",
//       className: "text-right",
//       cell: (row) => (
//         <div className="flex justify-end">
//           <Dropdown
//             items={[
//               { type: "label", label: "Thao tác" },
//               { type: "item", label: "Xem chi tiết", onClick: () => console.log("View", row.id) },
//               { type: "item", label: "Chỉnh sửa", onClick: () => console.log("Edit", row.id) },
//               { type: "divider" },
//               { type: "item", label: "Tính lương", onClick: () => console.log("Calculate", row.id) },
//               { type: "item", label: "Xem chấm công", onClick: () => console.log("Attendance", row.id) },
//               { type: "divider" },
//               {
//                 type: "item",
//                 label: "Xóa nhân viên",
//                 className: "text-red-600",
//                 onClick: () => console.log("Delete", row.id),
//               },
//             ]}
//           />
//         </div>
//       ),
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h1>
//           <p className="text-gray-500">Quản lý thông tin nhân viên trong hệ thống.</p>
//         </div>
//         <Button icon={<PlusCircle className="h-4 w-4" />}>Thêm nhân viên</Button>
//       </div>

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:w-64">
//           <Input
//             type="search"
//             placeholder="Tìm nhân viên..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             icon={<Search className="h-4 w-4 text-gray-400" />}
//           />
//         </div>
//         <Select
//           options={departmentOptions}
//           value={departmentFilter}
//           onChange={setDepartmentFilter}
//           className="w-full sm:w-[180px]"
//         />
//       </div>

//       <Table columns={columns} data={filteredEmployees} emptyMessage="Không tìm thấy nhân viên nào." />
//     </div>
//   )
// }

// export default Employees


"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, PlusCircle, X, Upload, User } from "lucide-react"
import { toast } from "react-toastify"
import { getEmployees, addEmployee, deleteEmployee } from "../utils/employeeApi"
import { getDepartments } from "../utils/departmentApi"

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
    position: "",
    department: "",
    gender: "male",
    dateOfBirth: "",
    joinDate: new Date().toISOString().split("T")[0],
    salary: {
      baseSalary: 0,
    },
  })
  const [formErrors, setFormErrors] = useState({})



  // Fetch employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch employees
        const employeesResponse = await getEmployees()
        setEmployees(employeesResponse.data)

        // Fetch departments
        try {
          const departmentsResponse = await getDepartments()
          setDepartments(departmentsResponse.data)
        } catch (error) {
          console.error("Error fetching departments:", error)
          // Fallback to mock data if API is not available
          setDepartments([
            { _id: "1", name: "Kỹ thuật" },
            { _id: "2", name: "Marketing" },
            { _id: "3", name: "Kinh doanh" },
            { _id: "4", name: "Nhân sự" },
            { _id: "5", name: "Tài chính" },
            { _id: "6", name: "Sản xuất" },
          ])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle input change for new employee form
  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setNewEmployee({
        ...newEmployee,
        [parent]: {
          ...newEmployee[parent],
          [child]: value,
        },
      })
    } else {
      setNewEmployee({
        ...newEmployee,
        [name]: value,
      })
    }
  }

  // Validate form
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
    if (!newEmployee.position) errors.position = "Vui lòng nhập vị trí"
    if (!newEmployee.department) errors.department = "Vui lòng chọn phòng ban"
    if (!newEmployee.dateOfBirth) errors.dateOfBirth = "Vui lòng nhập ngày sinh"
    if (!newEmployee.joinDate) errors.joinDate = "Vui lòng nhập ngày vào làm"
    if (!newEmployee.salary.baseSalary) errors.baseSalary = "Vui lòng nhập lương cơ bản"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)

      // Call API to add employee
      const response = await addEmployee(newEmployee)

      // Add new employee to the list
      setEmployees([...employees, response.data])

      // Reset form and close modal
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        gender: "male",
        dateOfBirth: "",
        joinDate: new Date().toISOString().split("T")[0],
        salary: {
          baseSalary: 0,
        },
      })
      setShowAddModal(false)
      toast.success("Thêm nhân viên thành công!")
    } catch (error) {
      console.error("Error adding employee:", error)
      toast.error(error.message || "Lỗi khi thêm nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        setIsLoading(true)

        // Call API to delete employee
        await deleteEmployee(id, { deleteUser: true })

        // Remove employee from the list
        setEmployees(employees.filter((employee) => employee._id !== id))

        toast.success("Xóa nhân viên thành công!")
      } catch (error) {
        console.error("Error deleting employee:", error)
        toast.error(error.message || "Lỗi khi xóa nhân viên")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment =
      departmentFilter === "all" || (employee.department && employee.department._id === departmentFilter)

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

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Nhân viên
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Phòng ban
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Vị trí
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Ngày vào làm
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                        {employee.avatar ? (
                          <img
                            src={employee.avatar || "/placeholder.svg"}
                            alt={`${employee.firstName} ${employee.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/images/default-avatar.png"
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{employee.firstName.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department?.name || "Chưa phân công"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.joinDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleDropdown(employee._id)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                    {activeDropdown === employee._id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10 text-left">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Xem chi tiết
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Chỉnh sửa
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Tính lương
                        </a>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          Xóa nhân viên
                        </button>
                      </div>
                    )}

                    </div>
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
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowAddModal(false)}
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Thêm nhân viên mới</h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowAddModal(false)}
                  >
                    <span className="sr-only">Đóng</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={newEmployee.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.firstName ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={newEmployee.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.lastName ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={newEmployee.email}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={newEmployee.phone}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.phone ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Vị trí <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        id="position"
                        value={newEmployee.position}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.position ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.position && <p className="mt-1 text-xs text-red-500">{formErrors.position}</p>}
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Phòng ban <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="department"
                        id="department"
                        value={newEmployee.department}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.department ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      >
                        <option value="">Chọn phòng ban</option>
                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.department && <p className="mt-1 text-xs text-red-500">{formErrors.department}</p>}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Giới tính
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={newEmployee.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={newEmployee.dateOfBirth}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.dateOfBirth ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                        Ngày vào làm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="joinDate"
                        id="joinDate"
                        value={newEmployee.joinDate}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.joinDate ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.joinDate && <p className="mt-1 text-xs text-red-500">{formErrors.joinDate}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="salary.baseSalary" className="block text-sm font-medium text-gray-700">
                        Lương cơ bản (VNĐ) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="salary.baseSalary"
                        id="salary.baseSalary"
                        value={newEmployee.salary.baseSalary}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.baseSalary ? "border-red-500" : "border-gray-300"
                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                      />
                      {formErrors.baseSalary && <p className="mt-1 text-xs text-red-500">{formErrors.baseSalary}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                      <div className="mt-1 flex items-center">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                          <User className="h-full w-full text-gray-300" />
                        </div>
                        <button
                          type="button"
                          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Upload className="mr-2 -ml-1 h-4 w-4 inline-block" />
                          Tải lên
                        </button>
                        <p className="ml-3 text-xs text-gray-500">Sẽ sử dụng ảnh mặc định nếu không tải lên</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Thêm nhân viên"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees

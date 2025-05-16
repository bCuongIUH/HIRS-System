// "use client"

// import { useState } from "react"
// import { CalendarIcon, Download, FileText, Printer } from "lucide-react"
// import Button from "../components/ui/Button"
// import Select from "../components/ui/Select"
// import Table from "../components/ui/Table"
// import Badge from "../components/ui/Badge"
// import Dropdown from "../components/ui/Dropdown"
// import { payrollData } from "../data/payroll"
// import { formatCurrency } from "../utils/format"

// function Payroll() {
//   const [month, setMonth] = useState("")
//   const [year, setYear] = useState("2023")
//   const [department, setDepartment] = useState("")

//   // Generate months for select
//   const months = [
//     { value: "01", label: "Tháng 1" },
//     { value: "02", label: "Tháng 2" },
//     { value: "03", label: "Tháng 3" },
//     { value: "04", label: "Tháng 4" },
//     { value: "05", label: "Tháng 5" },
//     { value: "06", label: "Tháng 6" },
//     { value: "07", label: "Tháng 7" },
//     { value: "08", label: "Tháng 8" },
//     { value: "09", label: "Tháng 9" },
//     { value: "10", label: "Tháng 10" },
//     { value: "11", label: "Tháng 11" },
//     { value: "12", label: "Tháng 12" },
//   ]

//   // Generate years for select
//   const currentYear = new Date().getFullYear()
//   const years = Array.from({ length: 5 }, (_, i) => ({
//     value: (currentYear - 2 + i).toString(),
//     label: (currentYear - 2 + i).toString(),
//   }))

//   // Departments
//   const departments = [
//     { value: "all", label: "Tất cả phòng ban" },
//     { value: "Kỹ thuật", label: "Kỹ thuật" },
//     { value: "Marketing", label: "Marketing" },
//     { value: "Kinh doanh", label: "Kinh doanh" },
//     { value: "Nhân sự", label: "Nhân sự" },
//     { value: "Tài chính", label: "Tài chính" },
//     { value: "Sản xuất", label: "Sản xuất" },
//   ]

//   // Filter payroll data based on selected filters
//   const filteredPayroll = payrollData.filter((payroll) => {
//     const matchesMonth = month ? payroll.period.startsWith(month) : true
//     const matchesYear = payroll.period.endsWith(year)
//     const matchesDepartment = department === "all" || department === "" || payroll.department === department

//     return matchesMonth && matchesYear && matchesDepartment
//   })

//   // Table columns
//   const columns = [
//     {
//       header: "Kỳ lương",
//       accessor: "period",
//     },
//     {
//       header: "Nhân viên",
//       accessor: "employeeName",
//       cell: (row) => (
//         <div>
//           <div className="font-medium">{row.employeeName}</div>
//           <div className="text-xs text-gray-500">ID: {row.employeeId}</div>
//         </div>
//       ),
//     },
//     {
//       header: "Phòng ban",
//       accessor: "department",
//     },
//     {
//       header: "Lương cơ bản",
//       accessor: "baseSalary",
//       cell: (row) => formatCurrency(row.baseSalary),
//     },
//     {
//       header: "Phụ cấp",
//       accessor: "allowances",
//       cell: (row) => formatCurrency(row.allowances),
//     },
//     {
//       header: "Khấu trừ",
//       accessor: "deductions",
//       cell: (row) => formatCurrency(row.deductions),
//     },
//     {
//       header: "Thực lãnh",
//       accessor: "netSalary",
//       cell: (row) => <span className="font-medium">{formatCurrency(row.netSalary)}</span>,
//     },
//     {
//       header: "Trạng thái",
//       accessor: "status",
//       cell: (row) => {
//         let variant = "default"
//         if (row.status === "Đã thanh toán") variant = "success"
//         if (row.status === "Chờ thanh toán") variant = "warning"

//         return <Badge variant={variant}>{row.status}</Badge>
//       },
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
//               {
//                 type: "item",
//                 label: "Xem chi tiết",
//                 icon: <FileText className="h-4 w-4" />,
//                 onClick: () => console.log("View", row.employeeId),
//               },
//               {
//                 type: "item",
//                 label: "In phiếu lương",
//                 icon: <Printer className="h-4 w-4" />,
//                 onClick: () => console.log("Print", row.employeeId),
//               },
//               {
//                 type: "item",
//                 label: "Xuất PDF",
//                 icon: <Download className="h-4 w-4" />,
//                 onClick: () => console.log("Export", row.employeeId),
//               },
//               { type: "divider" },
//               { type: "item", label: "Chỉnh sửa", onClick: () => console.log("Edit", row.employeeId) },
//               {
//                 type: "item",
//                 label: "Xóa",
//                 className: "text-red-600",
//                 onClick: () => console.log("Delete", row.employeeId),
//               },
//             ]}
//           />
//         </div>
//       ),
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Quản lý Lương</h1>
//         <p className="text-gray-500">Tính lương và quản lý bảng lương nhân viên.</p>
//       </div>

//       <div className="space-y-4">
//         <div className="flex flex-col gap-4 sm:flex-row">
//           <Select
//             options={months}
//             value={month}
//             onChange={setMonth}
//             placeholder="Chọn tháng"
//             className="w-full sm:w-[180px]"
//             icon={<CalendarIcon className="h-4 w-4 text-gray-400" />}
//           />

//           <Select
//             options={years}
//             value={year}
//             onChange={setYear}
//             placeholder="Chọn năm"
//             className="w-full sm:w-[120px]"
//           />

//           <Select
//             options={departments}
//             value={department}
//             onChange={setDepartment}
//             placeholder="Phòng ban"
//             className="w-full sm:w-[180px]"
//           />

//           <Button className="sm:ml-auto">Lọc</Button>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />}>
//             In bảng lương
//           </Button>
//           <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
//             Xuất Excel
//           </Button>
//           <Button variant="outline" size="sm" icon={<FileText className="h-4 w-4" />}>
//             Báo cáo tổng hợp
//           </Button>
//         </div>
//       </div>

//       <Table columns={columns} data={filteredPayroll} emptyMessage="Không có dữ liệu lương cho kỳ này." />
//     </div>
//   )
// }

// export default Payroll
"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Printer, MoreHorizontal, AlertCircle } from "lucide-react"
import { getPayrolls, approvePayroll, payPayroll, cancelPayroll } from "../utils/payrollApi"
import { getDepartments } from "../utils/departmentApi"
import { formatCurrency } from "../utils/format"
import { toast } from "react-toastify"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"

function Payroll() {
  const [month, setMonth] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [department, setDepartment] = useState("")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [payrolls, setPayrolls] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch payrolls data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch payrolls
        const payrollsResponse = await getPayrolls()
        setPayrolls(payrollsResponse.data)

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
        console.error("Error fetching payrolls:", error)
        setError("Không thể tải danh sách bảng lương. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate months for select
  const months = [
    { value: "", label: "Tất cả tháng" },
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ]

  // Generate years for select
  const currentYear = new Date().getFullYear()
  const years = [
    { value: "", label: "Tất cả năm" },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - 2 + i).toString(),
      label: (currentYear - 2 + i).toString(),
    })),
  ]

  // Department options
  const departmentOptions = [
    { value: "", label: "Tất cả phòng ban" },
    ...departments.map((dept) => ({
      value: dept._id,
      label: dept.name,
    })),
  ]

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Filter payrolls based on selected filters
  const filteredPayrolls = payrolls.filter((payroll) => {
    const matchesMonth = month === "" || payroll.period?.month?.toString() === month
    const matchesYear = year === "" || payroll.period?.year?.toString() === year
    const matchesDepartment = department === "" || payroll.employee?.department?._id === department

    return matchesMonth && matchesYear && matchesDepartment
  })

  // Handle approve payroll
  const handleApprovePayroll = async (id) => {
    try {
      await approvePayroll(id)

      // Update payroll status in the list
      setPayrolls(payrolls.map((payroll) => (payroll._id === id ? { ...payroll, status: "approved" } : payroll)))

      toast.success("Bảng lương đã được phê duyệt!")
    } catch (error) {
      console.error("Error approving payroll:", error)
      toast.error(error.message || "Lỗi khi phê duyệt bảng lương")
    }
  }

  // Handle pay payroll
  const handlePayPayroll = async (id) => {
    try {
      const paymentData = {
        paymentMethod: "bank_transfer",
        paymentReference: `PAY-${Date.now()}`,
        paymentDate: new Date().toISOString(),
      }

      await payPayroll(id, paymentData)

      // Update payroll status in the list
      setPayrolls(payrolls.map((payroll) => (payroll._id === id ? { ...payroll, status: "paid" } : payroll)))

      toast.success("Bảng lương đã được thanh toán!")
    } catch (error) {
      console.error("Error paying payroll:", error)
      toast.error(error.message || "Lỗi khi thanh toán bảng lương")
    }
  }

  // Handle cancel payroll
  const handleCancelPayroll = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy bảng lương này?")) {
      try {
        await cancelPayroll(id)

        // Update payroll status in the list
        setPayrolls(payrolls.map((payroll) => (payroll._id === id ? { ...payroll, status: "cancelled" } : payroll)))

        toast.success("Bảng lương đã được hủy!")
      } catch (error) {
        console.error("Error cancelling payroll:", error)
        toast.error(error.message || "Lỗi khi hủy bảng lương")
      }
    }
  }

  // Handle filter
  const handleFilter = () => {
    // Reload data with filters
    setIsLoading(true)

    // In a real application, you would call the API with filter parameters
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Lương</h1>
        <p className="text-gray-500">Tính lương và quản lý bảng lương nhân viên.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select
            options={months}
            value={month}
            onChange={setMonth}
            placeholder="Chọn tháng"
            className="w-full sm:w-[180px]"
          />

          <Select
            options={years}
            value={year}
            onChange={setYear}
            placeholder="Chọn năm"
            className="w-full sm:w-[120px]"
          />

          <Select
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
            placeholder="Chọn phòng ban"
            className="w-full sm:w-[180px]"
          />

          <Button className="sm:ml-auto" onClick={handleFilter}>
            Lọc
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />}>
            In bảng lương
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
            Xuất Excel
          </Button>
          <Button variant="outline" size="sm" icon={<FileText className="h-4 w-4" />}>
            Báo cáo tổng hợp
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Kỳ lương
              </th>
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
                Phòng ban
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Lương cơ bản
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Phụ cấp
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Khấu trừ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Thực lãnh
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
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredPayrolls.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu lương cho kỳ này.
                </td>
              </tr>
            ) : (
              filteredPayrolls.map((payroll) => {
                const period = `${payroll.period?.month || "-"}/${payroll.period?.year || "-"}`
                return (
                  <tr key={payroll._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{period}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payroll.employee?.firstName} {payroll.employee?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">ID: {payroll.employee?.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payroll.employee?.department?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payroll.salary?.baseSalary || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payroll.totalAllowances || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payroll.totalDeductions || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payroll.netSalary || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          payroll.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : payroll.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : payroll.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : payroll.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payroll.status === "draft"
                          ? "Bản nháp"
                          : payroll.status === "approved"
                            ? "Đã duyệt"
                            : payroll.status === "paid"
                              ? "Đã thanh toán"
                              : payroll.status === "cancelled"
                                ? "Đã hủy"
                                : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => toggleDropdown(payroll._id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {activeDropdown === payroll._id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <FileText className="mr-2 h-4 w-4" /> Xem chi tiết
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Printer className="mr-2 h-4 w-4" /> In phiếu lương
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Download className="mr-2 h-4 w-4" /> Xuất PDF
                            </a>
                            <hr className="my-1" />
                            {payroll.status === "draft" && (
                              <button
                                onClick={() => handleApprovePayroll(payroll._id)}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              >
                                Phê duyệt
                              </button>
                            )}
                            {payroll.status === "approved" && (
                              <button
                                onClick={() => handlePayPayroll(payroll._id)}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                              >
                                Thanh toán
                              </button>
                            )}
                            {(payroll.status === "draft" || payroll.status === "approved") && (
                              <button
                                onClick={() => handleCancelPayroll(payroll._id)}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Hủy bảng lương
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payroll

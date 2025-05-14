"use client"

import { useState } from "react"
import { CalendarIcon, Download, FileText, Printer } from "lucide-react"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import Table from "../components/ui/Table"
import Badge from "../components/ui/Badge"
import Dropdown from "../components/ui/Dropdown"
import { payrollData } from "../data/payroll"
import { formatCurrency } from "../utils/format"

function Payroll() {
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("2023")
  const [department, setDepartment] = useState("")

  // Generate months for select
  const months = [
    { value: "01", label: "Tháng 1" },
    { value: "02", label: "Tháng 2" },
    { value: "03", label: "Tháng 3" },
    { value: "04", label: "Tháng 4" },
    { value: "05", label: "Tháng 5" },
    { value: "06", label: "Tháng 6" },
    { value: "07", label: "Tháng 7" },
    { value: "08", label: "Tháng 8" },
    { value: "09", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ]

  // Generate years for select
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString(),
  }))

  // Departments
  const departments = [
    { value: "all", label: "Tất cả phòng ban" },
    { value: "Kỹ thuật", label: "Kỹ thuật" },
    { value: "Marketing", label: "Marketing" },
    { value: "Kinh doanh", label: "Kinh doanh" },
    { value: "Nhân sự", label: "Nhân sự" },
    { value: "Tài chính", label: "Tài chính" },
    { value: "Sản xuất", label: "Sản xuất" },
  ]

  // Filter payroll data based on selected filters
  const filteredPayroll = payrollData.filter((payroll) => {
    const matchesMonth = month ? payroll.period.startsWith(month) : true
    const matchesYear = payroll.period.endsWith(year)
    const matchesDepartment = department === "all" || department === "" || payroll.department === department

    return matchesMonth && matchesYear && matchesDepartment
  })

  // Table columns
  const columns = [
    {
      header: "Kỳ lương",
      accessor: "period",
    },
    {
      header: "Nhân viên",
      accessor: "employeeName",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.employeeName}</div>
          <div className="text-xs text-gray-500">ID: {row.employeeId}</div>
        </div>
      ),
    },
    {
      header: "Phòng ban",
      accessor: "department",
    },
    {
      header: "Lương cơ bản",
      accessor: "baseSalary",
      cell: (row) => formatCurrency(row.baseSalary),
    },
    {
      header: "Phụ cấp",
      accessor: "allowances",
      cell: (row) => formatCurrency(row.allowances),
    },
    {
      header: "Khấu trừ",
      accessor: "deductions",
      cell: (row) => formatCurrency(row.deductions),
    },
    {
      header: "Thực lãnh",
      accessor: "netSalary",
      cell: (row) => <span className="font-medium">{formatCurrency(row.netSalary)}</span>,
    },
    {
      header: "Trạng thái",
      accessor: "status",
      cell: (row) => {
        let variant = "default"
        if (row.status === "Đã thanh toán") variant = "success"
        if (row.status === "Chờ thanh toán") variant = "warning"

        return <Badge variant={variant}>{row.status}</Badge>
      },
    },
    {
      header: "Thao tác",
      accessor: "actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end">
          <Dropdown
            items={[
              { type: "label", label: "Thao tác" },
              {
                type: "item",
                label: "Xem chi tiết",
                icon: <FileText className="h-4 w-4" />,
                onClick: () => console.log("View", row.employeeId),
              },
              {
                type: "item",
                label: "In phiếu lương",
                icon: <Printer className="h-4 w-4" />,
                onClick: () => console.log("Print", row.employeeId),
              },
              {
                type: "item",
                label: "Xuất PDF",
                icon: <Download className="h-4 w-4" />,
                onClick: () => console.log("Export", row.employeeId),
              },
              { type: "divider" },
              { type: "item", label: "Chỉnh sửa", onClick: () => console.log("Edit", row.employeeId) },
              {
                type: "item",
                label: "Xóa",
                className: "text-red-600",
                onClick: () => console.log("Delete", row.employeeId),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Lương</h1>
        <p className="text-gray-500">Tính lương và quản lý bảng lương nhân viên.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select
            options={months}
            value={month}
            onChange={setMonth}
            placeholder="Chọn tháng"
            className="w-full sm:w-[180px]"
            icon={<CalendarIcon className="h-4 w-4 text-gray-400" />}
          />

          <Select
            options={years}
            value={year}
            onChange={setYear}
            placeholder="Chọn năm"
            className="w-full sm:w-[120px]"
          />

          <Select
            options={departments}
            value={department}
            onChange={setDepartment}
            placeholder="Phòng ban"
            className="w-full sm:w-[180px]"
          />

          <Button className="sm:ml-auto">Lọc</Button>
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

      <Table columns={columns} data={filteredPayroll} emptyMessage="Không có dữ liệu lương cho kỳ này." />
    </div>
  )
}

export default Payroll

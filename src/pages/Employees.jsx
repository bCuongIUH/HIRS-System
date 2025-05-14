"use client"

import { useState } from "react"
import { PlusCircle, Search } from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Table from "../components/ui/Table"
import Badge from "../components/ui/Badge"
import Avatar from "../components/ui/Avatar"
import Dropdown from "../components/ui/Dropdown"
import { employeesData } from "../data/employees"

function Employees() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Filter employees based on search term and department
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  // Get unique departments for filter
  const departments = Array.from(new Set(employeesData.map((employee) => employee.department)))
  const departmentOptions = [
    { value: "all", label: "Tất cả phòng ban" },
    ...departments.map((dept) => ({ value: dept, label: dept })),
  ]

  // Table columns
  const columns = [
    {
      header: "Nhân viên",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} alt={row.name} initials={row.name.charAt(0)} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium">{row.name}</span>
            <span className="text-xs text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "ID",
      accessor: "id",
    },
    {
      header: "Phòng ban",
      accessor: "department",
    },
    {
      header: "Vị trí",
      accessor: "position",
    },
    {
      header: "Ngày vào làm",
      accessor: "joinDate",
    },
    {
      header: "Trạng thái",
      accessor: "status",
      cell: (row) => <Badge variant={row.status === "Đang làm việc" ? "success" : "default"}>{row.status}</Badge>,
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
              { type: "item", label: "Xem chi tiết", onClick: () => console.log("View", row.id) },
              { type: "item", label: "Chỉnh sửa", onClick: () => console.log("Edit", row.id) },
              { type: "divider" },
              { type: "item", label: "Tính lương", onClick: () => console.log("Calculate", row.id) },
              { type: "item", label: "Xem chấm công", onClick: () => console.log("Attendance", row.id) },
              { type: "divider" },
              {
                type: "item",
                label: "Xóa nhân viên",
                className: "text-red-600",
                onClick: () => console.log("Delete", row.id),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Nhân viên</h1>
          <p className="text-gray-500">Quản lý thông tin nhân viên trong hệ thống.</p>
        </div>
        <Button icon={<PlusCircle className="h-4 w-4" />}>Thêm nhân viên</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            type="search"
            placeholder="Tìm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select
          options={departmentOptions}
          value={departmentFilter}
          onChange={setDepartmentFilter}
          className="w-full sm:w-[180px]"
        />
      </div>

      <Table columns={columns} data={filteredEmployees} emptyMessage="Không tìm thấy nhân viên nào." />
    </div>
  )
}

export default Employees

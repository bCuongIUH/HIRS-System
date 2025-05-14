"use client"

import { useState } from "react"
import { PlusCircle, Search } from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Table from "../components/ui/Table"
import Dropdown from "../components/ui/Dropdown"
import Card from "../components/ui/Card"

// Dữ liệu mẫu cho phòng ban
const departmentsData = [
  {
    id: 1,
    name: "Kỹ thuật",
    manager: "Nguyễn Văn A",
    employeeCount: 42,
    description: "Phòng ban phát triển và bảo trì sản phẩm công nghệ",
  },
  {
    id: 2,
    name: "Marketing",
    manager: "Trần Thị B",
    employeeCount: 24,
    description: "Phòng ban quảng bá và tiếp thị sản phẩm",
  },
  {
    id: 3,
    name: "Kinh doanh",
    manager: "Lê Văn C",
    employeeCount: 36,
    description: "Phòng ban phụ trách bán hàng và phát triển kinh doanh",
  },
  {
    id: 4,
    name: "Nhân sự",
    manager: "Phạm Thị D",
    employeeCount: 18,
    description: "Phòng ban quản lý nhân sự và tuyển dụng",
  },
  {
    id: 5,
    name: "Tài chính",
    manager: "Hoàng Văn E",
    employeeCount: 22,
    description: "Phòng ban quản lý tài chính và kế toán",
  },
  {
    id: 6,
    name: "Sản xuất",
    manager: "Vũ Văn G",
    employeeCount: 14,
    description: "Phòng ban quản lý sản xuất và vận hành",
  },
]

function Departments() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter departments based on search term
  const filteredDepartments = departmentsData.filter((department) => {
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Table columns
  const columns = [
    {
      header: "Tên phòng ban",
      accessor: "name",
    },
    {
      header: "Quản lý",
      accessor: "manager",
    },
    {
      header: "Số nhân viên",
      accessor: "employeeCount",
    },
    {
      header: "Mô tả",
      accessor: "description",
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
              {
                type: "item",
                label: "Xóa phòng ban",
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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng ban</h1>
          <p className="text-gray-500">Quản lý thông tin phòng ban trong hệ thống.</p>
        </div>
        <Button icon={<PlusCircle className="h-4 w-4" />}>Thêm phòng ban</Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="search"
              placeholder="Tìm phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <Table columns={columns} data={filteredDepartments} emptyMessage="Không tìm thấy phòng ban nào." />
        </div>
      </Card>
    </div>
  )
}

export default Departments

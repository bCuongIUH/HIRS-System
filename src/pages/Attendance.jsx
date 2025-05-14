"use client"

import { useState } from "react"
import { CalendarIcon, Download, FileText } from "lucide-react"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import Table from "../components/ui/Table"
import Badge from "../components/ui/Badge"
import Avatar from "../components/ui/Avatar"
import Dropdown from "../components/ui/Dropdown"
import { attendanceData } from "../data/attendance"

function Attendance() {
  const [date, setDate] = useState(new Date().toLocaleDateString("vi-VN"))
  const [department, setDepartment] = useState("")
  const [status, setStatus] = useState("")

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

  // Attendance statuses
  const statuses = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Đúng giờ", label: "Đúng giờ" },
    { value: "Đi muộn", label: "Đi muộn" },
    { value: "Về sớm", label: "Về sớm" },
    { value: "Vắng mặt", label: "Vắng mặt" },
  ]

  // Filter attendance data based on selected filters
  const filteredAttendance = attendanceData.filter((record) => {
    const matchesDepartment = department === "all" || department === "" || record.department === department
    const matchesStatus = status === "all" || status === "" || record.status === status

    return matchesDepartment && matchesStatus
  })

  // Table columns
  const columns = [
    {
      header: "Ngày",
      accessor: "date",
    },
    {
      header: "Nhân viên",
      accessor: "employeeName",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} alt={row.employeeName} initials={row.employeeName.charAt(0)} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium">{row.employeeName}</span>
            <span className="text-xs text-gray-500">{row.department}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Giờ vào",
      accessor: "timeIn",
      cell: (row) => (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {row.timeIn || "—"}
        </div>
      ),
    },
    {
      header: "Giờ ra",
      accessor: "timeOut",
      cell: (row) => (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {row.timeOut || "—"}
        </div>
      ),
    },
    {
      header: "Tổng giờ",
      accessor: "totalHours",
      cell: (row) => `${row.totalHours} giờ`,
    },
    {
      header: "Làm thêm",
      accessor: "overtime",
      cell: (row) => `${row.overtime} giờ`,
    },
    {
      header: "Trạng thái",
      accessor: "status",
      cell: (row) => {
        let variant = "default"
        if (row.status === "Đúng giờ") variant = "success"
        if (row.status === "Đi muộn") variant = "warning"
        if (row.status === "Vắng mặt") variant = "danger"

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
              { type: "item", label: "Xem chi tiết", onClick: () => console.log("View", row.employeeId) },
              { type: "item", label: "Chỉnh sửa", onClick: () => console.log("Edit", row.employeeId) },
              { type: "divider" },
              { type: "item", label: "Phê duyệt", onClick: () => console.log("Approve", row.employeeId) },
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
        <h1 className="text-3xl font-bold tracking-tight">Chấm công</h1>
        <p className="text-gray-500">Quản lý chấm công và theo dõi giờ làm của nhân viên.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="outline"
            className="w-full justify-start text-left sm:w-[240px]"
            icon={<CalendarIcon className="h-4 w-4" />}
          >
            {date}
          </Button>

          <Select
            options={departments}
            value={department}
            onChange={setDepartment}
            placeholder="Phòng ban"
            className="w-full sm:w-[180px]"
          />

          <Select
            options={statuses}
            value={status}
            onChange={setStatus}
            placeholder="Trạng thái"
            className="w-full sm:w-[180px]"
          />

          <Button className="sm:ml-auto">Lọc</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
            Xuất Excel
          </Button>
          <Button variant="outline" size="sm" icon={<FileText className="h-4 w-4" />}>
            Báo cáo chấm công
          </Button>
        </div>
      </div>

      <Table columns={columns} data={filteredAttendance} emptyMessage="Không có dữ liệu chấm công cho ngày này." />
    </div>
  )
}

export default Attendance

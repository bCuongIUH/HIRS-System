"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Table from "../components/ui/Table"
import Tabs from "../components/ui/Tabs"
import { employeesData } from "../data/employees"
import { formatCurrency } from "../utils/format"

function PayrollCalculate() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("2023")
  const [workingDays, setWorkingDays] = useState("22")
  const [actualWorkDays, setActualWorkDays] = useState("22")
  const [overtime, setOvertime] = useState("0")
  const [baseSalary, setBaseSalary] = useState("0")
  const [allowances, setAllowances] = useState([
    { name: "Phụ cấp ăn trưa", amount: "1000000" },
    { name: "Phụ cấp xăng xe", amount: "500000" },
  ])
  const [deductions, setDeductions] = useState([
    { name: "Bảo hiểm xã hội (8%)", amount: "0" },
    { name: "Bảo hiểm y tế (1.5%)", amount: "0" },
    { name: "Bảo hiểm thất nghiệp (1%)", amount: "0" },
    { name: "Thuế thu nhập cá nhân", amount: "0" },
  ])
  const [calculatedSalary, setCalculatedSalary] = useState(null)

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

  // Employee options
  const employeeOptions = employeesData.map((employee) => ({
    value: employee.id,
    label: `${employee.name} - ${employee.department}`,
  }))

  // Handle employee selection
  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId)
    const employee = employeesData.find((emp) => emp.id === employeeId)
    if (employee) {
      setBaseSalary(employee.baseSalary.toString())

      // Update insurance deductions based on base salary
      const baseValue = Number.parseFloat(employee.baseSalary.toString())
      const updatedDeductions = [...deductions]
      updatedDeductions[0].amount = Math.round(baseValue * 0.08).toString()
      updatedDeductions[1].amount = Math.round(baseValue * 0.015).toString()
      updatedDeductions[2].amount = Math.round(baseValue * 0.01).toString()

      // Simple tax calculation (just for demonstration)
      const taxableIncome = baseValue - baseValue * 0.105 - 11000000 // Deduct insurance and personal deduction
      let tax = 0
      if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) {
          tax = taxableIncome * 0.05
        } else if (taxableIncome <= 10000000) {
          tax = 5000000 * 0.05 + (taxableIncome - 5000000) * 0.1
        } else {
          tax = 5000000 * 0.05 + 5000000 * 0.1 + (taxableIncome - 10000000) * 0.15
        }
      }
      updatedDeductions[3].amount = Math.round(tax).toString()

      setDeductions(updatedDeductions)
    }
  }

  // Calculate salary
  const calculateSalary = () => {
    const employee = employeesData.find((emp) => emp.id === selectedEmployee)
    if (!employee) return

    const baseValue = Number.parseFloat(baseSalary)
    const workDays = Number.parseFloat(workingDays)
    const actualDays = Number.parseFloat(actualWorkDays)
    const overtimeHours = Number.parseFloat(overtime)

    // Calculate salary based on actual working days
    const dailySalary = baseValue / workDays
    const regularSalary = dailySalary * actualDays

    // Calculate overtime pay (1.5x regular hourly rate)
    const hourlyRate = dailySalary / 8 // Assuming 8 hours per day
    const overtimePay = hourlyRate * 1.5 * overtimeHours

    // Calculate total allowances
    const totalAllowances = allowances.reduce((sum, item) => sum + Number.parseFloat(item.amount), 0)

    // Calculate total deductions
    const totalDeductions = deductions.reduce((sum, item) => sum + Number.parseFloat(item.amount), 0)

    // Calculate gross and net salary
    const grossSalary = regularSalary + overtimePay + totalAllowances
    const netSalary = grossSalary - totalDeductions

    setCalculatedSalary({
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      position: employee.position,
      period: `${month}/${year}`,
      workingDays: workDays,
      actualWorkDays: actualDays,
      overtime: overtimeHours,
      baseSalary: baseValue,
      regularSalary,
      overtimePay,
      allowances: totalAllowances,
      deductions: totalDeductions,
      grossSalary,
      netSalary,
    })
  }

  // Add new allowance
  const addAllowance = () => {
    setAllowances([...allowances, { name: "Phụ cấp mới", amount: "0" }])
  }

  // Update allowance
  const updateAllowance = (index, field, value) => {
    const updatedAllowances = [...allowances]
    updatedAllowances[index][field] = value
    setAllowances(updatedAllowances)
  }

  // Remove allowance
  const removeAllowance = (index) => {
    const updatedAllowances = [...allowances]
    updatedAllowances.splice(index, 1)
    setAllowances(updatedAllowances)
  }

  // Allowances table columns
  const allowanceColumns = [
    {
      header: "Loại phụ cấp",
      accessor: "name",
      cell: (row, rowIndex) => (
        <Input value={row.name} onChange={(e) => updateAllowance(rowIndex, "name", e.target.value)} />
      ),
    },
    {
      header: "Số tiền",
      accessor: "amount",
      cell: (row, rowIndex) => (
        <Input type="number" value={row.amount} onChange={(e) => updateAllowance(rowIndex, "amount", e.target.value)} />
      ),
    },
    {
      header: "Thao tác",
      accessor: "actions",
      className: "w-[100px]",
      cell: (row, rowIndex) => (
        <Button variant="ghost" size="sm" onClick={() => removeAllowance(rowIndex)}>
          Xóa
        </Button>
      ),
    },
  ]

  // Deductions table columns
  const deductionColumns = [
    {
      header: "Loại khấu trừ",
      accessor: "name",
    },
    {
      header: "Số tiền",
      accessor: "amount",
      cell: (row, rowIndex) => (
        <Input
          type="number"
          value={row.amount}
          onChange={(e) => {
            const updatedDeductions = [...deductions]
            updatedDeductions[rowIndex].amount = e.target.value
            setDeductions(updatedDeductions)
          }}
        />
      ),
    },
  ]

  // Salary result table columns
  const salaryResultColumns = [
    {
      header: "Mục",
      accessor: "name",
      className: "w-[300px]",
    },
    {
      header: "Số tiền",
      accessor: "amount",
      className: "text-right",
    },
  ]

  // Salary result data
  const salaryResultData = calculatedSalary
    ? [
        { name: "Lương cơ bản", amount: formatCurrency(calculatedSalary.baseSalary) },
        { name: "Lương theo ngày công", amount: formatCurrency(calculatedSalary.regularSalary) },
        { name: "Lương làm thêm giờ", amount: formatCurrency(calculatedSalary.overtimePay) },
        { name: "Tổng phụ cấp", amount: formatCurrency(calculatedSalary.allowances) },
        { name: "Tổng thu nhập", amount: formatCurrency(calculatedSalary.grossSalary), isBold: true },
        { name: "Tổng khấu trừ", amount: formatCurrency(calculatedSalary.deductions) },
        { name: "Thực lãnh", amount: formatCurrency(calculatedSalary.netSalary), isBold: true, isHighlighted: true },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tính lương</h1>
        <p className="text-gray-500">Tính lương cho nhân viên theo kỳ lương.</p>
      </div>

      <Card title="Thông tin tính lương" description="Nhập thông tin để tính lương cho nhân viên">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              label="Nhân viên"
              id="employee"
              options={employeeOptions}
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              placeholder="Chọn nhân viên"
            />

            <Select
              label="Tháng"
              id="month"
              options={months}
              value={month}
              onChange={setMonth}
              placeholder="Chọn tháng"
            />

            <Select label="Năm" id="year" options={years} value={year} onChange={setYear} placeholder="Chọn năm" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              label="Lương cơ bản"
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
            />

            <Input
              label="Số ngày công chuẩn"
              id="workingDays"
              type="number"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
            />

            <Input
              label="Số ngày công thực tế"
              id="actualWorkDays"
              type="number"
              value={actualWorkDays}
              onChange={(e) => setActualWorkDays(e.target.value)}
            />

            <Input
              label="Số giờ làm thêm"
              id="overtime"
              type="number"
              value={overtime}
              onChange={(e) => setOvertime(e.target.value)}
            />
          </div>

          <Tabs
            tabs={[
              {
                id: "allowances",
                label: "Phụ cấp",
                content: (
                  <div className="space-y-4">
                    <Table columns={allowanceColumns} data={allowances} emptyMessage="Không có phụ cấp nào." />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<PlusCircle className="h-4 w-4" />}
                      onClick={addAllowance}
                    >
                      Thêm phụ cấp
                    </Button>
                  </div>
                ),
              },
              {
                id: "deductions",
                label: "Khấu trừ",
                content: (
                  <div className="space-y-4">
                    <Table columns={deductionColumns} data={deductions} emptyMessage="Không có khấu trừ nào." />
                  </div>
                ),
              },
            ]}
            defaultTab="allowances"
          />

          <Button onClick={calculateSalary}>Tính lương</Button>
        </div>
      </Card>

      {calculatedSalary && (
        <Card
          title="Kết quả tính lương"
          description={`Bảng lương của ${calculatedSalary.employeeName} - Kỳ lương: ${calculatedSalary.period}`}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium">Thông tin nhân viên</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Họ tên:</span> {calculatedSalary.employeeName}
                  </p>
                  <p>
                    <span className="text-gray-500">Mã nhân viên:</span> {calculatedSalary.employeeId}
                  </p>
                  <p>
                    <span className="text-gray-500">Phòng ban:</span> {calculatedSalary.department}
                  </p>
                  <p>
                    <span className="text-gray-500">Vị trí:</span> {calculatedSalary.position}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Thông tin chấm công</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Số ngày công chuẩn:</span> {calculatedSalary.workingDays} ngày
                  </p>
                  <p>
                    <span className="text-gray-500">Số ngày công thực tế:</span> {calculatedSalary.actualWorkDays} ngày
                  </p>
                  <p>
                    <span className="text-gray-500">Số giờ làm thêm:</span> {calculatedSalary.overtime} giờ
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Thông tin kỳ lương</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Kỳ lương:</span> {calculatedSalary.period}
                  </p>
                  <p>
                    <span className="text-gray-500">Ngày tính lương:</span> {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <Table
              columns={[
                {
                  header: "Mục",
                  accessor: "name",
                  cell: (row) => <span className={row.isBold ? "font-medium" : ""}>{row.name}</span>,
                },
                {
                  header: "Số tiền",
                  accessor: "amount",
                  className: "text-right",
                  cell: (row) => (
                    <span
                      className={`
                      ${row.isBold ? "font-medium" : ""}
                      ${row.isHighlighted ? "text-blue-600 font-bold" : ""}
                    `}
                    >
                      {row.amount}
                    </span>
                  ),
                },
              ]}
              data={salaryResultData}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline">In phiếu lương</Button>
              <Button variant="outline">Xuất PDF</Button>
              <Button>Lưu bảng lương</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PayrollCalculate

"use client"

import { useState, useEffect } from "react"
import { PlusCircle, AlertCircle } from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Table from "../components/ui/Table"
import Tabs from "../components/ui/Tabs"
import { getEmployees } from "../utils/employeeApi"
import { calculatePayroll } from "../utils/payrollApi"
import { formatCurrency } from "../utils/format"
import { toast } from "react-toastify"

function PayrollCalculate() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
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
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees()
        setEmployees(response.data)
      } catch (error) {
        console.error("Error fetching employees:", error)
        setError("Không thể tải danh sách nhân viên. Vui lòng thử lại sau.")
      }
    }

    fetchEmployees()
  }, [])

  // Generate months for select
  const months = [
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
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString(),
  }))

  // Employee options
  const employeeOptions = employees.map((employee) => ({
    value: employee._id,
    label: `${employee.firstName} ${employee.lastName} - ${employee.position}`,
  }))

  // Handle employee selection
  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId)
    const employee = employees.find((emp) => emp._id === employeeId)
    if (employee) {
      setBaseSalary(employee.salary?.baseSalary?.toString() || "0")

      // Update insurance deductions based on base salary
      const baseValue = Number.parseFloat(employee.salary?.baseSalary?.toString() || "0")
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
  const calculateSalary = async () => {
    // Validate inputs
    if (!selectedEmployee) {
      toast.error("Vui lòng chọn nhân viên")
      return
    }

    if (!month) {
      toast.error("Vui lòng chọn tháng")
      return
    }

    if (!year) {
      toast.error("Vui lòng chọn năm")
      return
    }

    try {
      setIsLoading(true)

      // Prepare data for API
      const payrollData = {
        employeeId: selectedEmployee,
        month,
        year,
        workingDays,
        actualWorkDays,
        overtime,
        allowances,
        deductions,
      }

      // Call API to calculate payroll
      const response = await calculatePayroll(payrollData)
      const payroll = response.data

      // Format data for display
      const employee = employees.find((emp) => emp._id === selectedEmployee)

      setCalculatedSalary({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department?.name || "Chưa phân công",
        position: employee.position,
        period: `${month}/${year}`,
        workingDays: Number.parseInt(workingDays),
        actualWorkDays: Number.parseInt(actualWorkDays),
        overtime: Number.parseFloat(overtime),
        baseSalary: payroll.salary.baseSalary,
        regularSalary: payroll.salary.regularSalary,
        overtimePay: payroll.salary.overtimePay,
        allowances: payroll.totalAllowances,
        deductions: payroll.totalDeductions,
        grossSalary: payroll.grossSalary,
        netSalary: payroll.netSalary,
        status: payroll.status,
        payrollId: payroll._id,
      })

      toast.success("Tính lương thành công!")
    } catch (error) {
      console.error("Error calculating salary:", error)
      toast.error(error.message || "Lỗi khi tính lương. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add new allowance with custom name and amount
  const addAllowance = () => {
    // Hiển thị modal hoặc prompt để nhập tên và giá trị phụ cấp
    const name = prompt("Nhập tên phụ cấp:")
    if (!name) return // Nếu người dùng hủy hoặc không nhập tên

    const amount = prompt("Nhập giá trị phụ cấp:")
    if (!amount) return // Nếu người dùng hủy hoặc không nhập giá trị

    // Kiểm tra giá trị có phải là số không
    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue)) {
      toast.error("Giá trị phụ cấp phải là số!")
      return
    }

    setAllowances([...allowances, { name, amount: amountValue.toString() }])
    toast.success(`Đã thêm phụ cấp "${name}" với giá trị ${formatCurrency(amountValue)}`)
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

  // Add new deduction
  const addDeduction = () => {
    // Hiển thị modal hoặc prompt để nhập tên và giá trị khấu trừ
    const name = prompt("Nhập tên khoản khấu trừ:")
    if (!name) return // Nếu người dùng hủy hoặc không nhập tên

    const amount = prompt("Nhập giá trị khấu trừ:")
    if (!amount) return // Nếu người dùng hủy hoặc không nhập giá trị

    // Kiểm tra giá trị có phải là số không
    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue)) {
      toast.error("Giá trị khấu trừ phải là số!")
      return
    }

    setDeductions([...deductions, { name, amount: amountValue.toString() }])
    toast.success(`Đã thêm khấu trừ "${name}" với giá trị ${formatCurrency(amountValue)}`)
  }

  // Remove deduction
  const removeDeduction = (index) => {
    const updatedDeductions = [...deductions]
    updatedDeductions.splice(index, 1)
    setDeductions(updatedDeductions)
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
    {
      header: "Thao tác",
      accessor: "actions",
      className: "w-[100px]",
      cell: (row, rowIndex) => (
        <Button variant="ghost" size="sm" onClick={() => removeDeduction(rowIndex)}>
          Xóa
        </Button>
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

  // Save payroll to database
  const savePayroll = async () => {
    try {
      setIsLoading(true)

      // Giả định rằng bảng lương đã được lưu thành công
      // Trong thực tế, bạn đã có API calculatePayroll rồi nên không cần gọi lại

      toast.success("Đã lưu bảng lương thành công!")

      // Reset form về trạng thái ban đầu
      setSelectedEmployee("")
      setMonth("")
      setYear(new Date().getFullYear().toString())
      setWorkingDays("22")
      setActualWorkDays("22")
      setOvertime("0")
      setBaseSalary("0")
      setAllowances([
        { name: "Phụ cấp ăn trưa", amount: "1000000" },
        { name: "Phụ cấp xăng xe", amount: "500000" },
      ])
      setDeductions([
        { name: "Bảo hiểm xã hội (8%)", amount: "0" },
        { name: "Bảo hiểm y tế (1.5%)", amount: "0" },
        { name: "Bảo hiểm thất nghiệp (1%)", amount: "0" },
        { name: "Thuế thu nhập cá nhân", amount: "0" },
      ])
      setCalculatedSalary(null)
    } catch (error) {
      console.error("Error saving payroll:", error)
      toast.error("Lỗi khi lưu bảng lương. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tính lương</h1>
        <p className="text-gray-500">Tính lương cho nhân viên theo kỳ lương.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

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
              disabled
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
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<PlusCircle className="h-4 w-4" />}
                      onClick={addDeduction}
                    >
                      Thêm khấu trừ
                    </Button>
                  </div>
                ),
              },
            ]}
            defaultTab="allowances"
          />

          <Button onClick={calculateSalary} disabled={isLoading}>
            {isLoading ? "Đang tính..." : "Tính lương"}
          </Button>
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
                  <p>
                    <span className="text-gray-500">Trạng thái:</span>{" "}
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        calculatedSalary.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : calculatedSalary.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : calculatedSalary.status === "paid"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {calculatedSalary.status === "draft"
                        ? "Bản nháp"
                        : calculatedSalary.status === "approved"
                          ? "Đã duyệt"
                          : calculatedSalary.status === "paid"
                            ? "Đã thanh toán"
                            : "Chờ duyệt"}
                    </span>
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
              <Button onClick={savePayroll}>Lưu bảng lương</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PayrollCalculate

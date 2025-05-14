"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Tabs from "../components/ui/Tabs"

function Settings() {
  const [companyName, setCompanyName] = useState("Công ty TNHH ABC")
  const [companyAddress, setCompanyAddress] = useState("123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh")
  const [companyPhone, setCompanyPhone] = useState("(028) 1234 5678")
  const [companyEmail, setCompanyEmail] = useState("info@company.com")
  const [taxCode, setTaxCode] = useState("0123456789")

  const [workingDays, setWorkingDays] = useState("22")
  const [workingHours, setWorkingHours] = useState("8")
  const [overtimeRate, setOvertimeRate] = useState("1.5")
  const [currency, setCurrency] = useState("VND")

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [payrollReminders, setPayrollReminders] = useState(true)
  const [attendanceAlerts, setAttendanceAlerts] = useState(true)

  const currencyOptions = [
    { value: "VND", label: "Việt Nam Đồng (VND)" },
    { value: "USD", label: "US Dollar (USD)" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-gray-500">Quản lý cài đặt hệ thống.</p>
      </div>

      <Tabs
        tabs={[
          {
            id: "company",
            label: "Thông tin công ty",
            content: (
              <Card>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Tên công ty" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    <Input label="Mã số thuế" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
                  </div>

                  <Input label="Địa chỉ" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Số điện thoại"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button>Lưu thông tin</Button>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            id: "payroll",
            label: "Cài đặt lương",
            content: (
              <Card>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      label="Số ngày công chuẩn"
                      type="number"
                      value={workingDays}
                      onChange={(e) => setWorkingDays(e.target.value)}
                    />
                    <Input
                      label="Số giờ làm việc mỗi ngày"
                      type="number"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                    />
                    <Input
                      label="Hệ số làm thêm giờ"
                      type="number"
                      value={overtimeRate}
                      onChange={(e) => setOvertimeRate(e.target.value)}
                    />
                  </div>

                  <Select label="Đơn vị tiền tệ" options={currencyOptions} value={currency} onChange={setCurrency} />

                  <div className="flex justify-end">
                    <Button>Lưu cài đặt</Button>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            id: "notifications",
            label: "Thông báo",
            content: (
              <Card>
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Thông báo qua email</h3>
                      <p className="text-sm text-gray-500">Nhận thông báo qua email khi có cập nhật mới</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        id="email-notifications"
                      />
                      <span
                        className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all ${emailNotifications ? "translate-x-5 bg-blue-600" : ""}`}
                      ></span>
                      <label
                        htmlFor="email-notifications"
                        className="absolute inset-0 cursor-pointer rounded-full"
                      ></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Nhắc nhở kỳ lương</h3>
                      <p className="text-sm text-gray-500">Nhận thông báo khi đến kỳ tính lương</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={payrollReminders}
                        onChange={() => setPayrollReminders(!payrollReminders)}
                        id="payroll-reminders"
                      />
                      <span
                        className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all ${payrollReminders ? "translate-x-5 bg-blue-600" : ""}`}
                      ></span>
                      <label
                        htmlFor="payroll-reminders"
                        className="absolute inset-0 cursor-pointer rounded-full"
                      ></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cảnh báo chấm công</h3>
                      <p className="text-sm text-gray-500">Nhận thông báo khi có nhân viên đi muộn hoặc vắng mặt</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={attendanceAlerts}
                        onChange={() => setAttendanceAlerts(!attendanceAlerts)}
                        id="attendance-alerts"
                      />
                      <span
                        className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all ${attendanceAlerts ? "translate-x-5 bg-blue-600" : ""}`}
                      ></span>
                      <label
                        htmlFor="attendance-alerts"
                        className="absolute inset-0 cursor-pointer rounded-full"
                      ></label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Lưu cài đặt</Button>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
        defaultTab="company"
        className="mt-4"
      />
    </div>
  )
}

export default Settings

"use client"

import React, { useState, useEffect } from "react"
import { Search, MoreHorizontal, PlusCircle, X, Upload, User } from "lucide-react"
import { toast } from "react-toastify"

// Mock API functions for customers
const getCustomers = async () => {
  return {
    data: [
      {
        _id: "1",
        customerId: "KH001",
        firstName: "Nguyễn",
        lastName: "Văn An",
        email: "nguyenvanan@email.com",
        phone: "0901234567",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        totalPurchases: 15000000,
        registrationDate: "2024-01-15",
        status: "active",
      },
      {
        _id: "2",
        customerId: "KH002",
        firstName: "Trần",
        lastName: "Thị Bình",
        email: "tranthibinh@email.com",
        phone: "0912345678",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        totalPurchases: 8500000,
        registrationDate: "2024-02-20",
        status: "active",
      },
      {
        _id: "3",
        customerId: "KH003",
        firstName: "Lê",
        lastName: "Minh Cường",
        email: "leminhcuong@email.com",
        phone: "0923456789",
        address: "789 Đường DEF, Quận 7, TP.HCM",
        totalPurchases: 25000000,
        registrationDate: "2023-12-10",
        status: "inactive",
      },
    ],
  }
}

const addCustomer = async (customerData) => {
  return {
    data: {
      _id: Date.now().toString(),
      customerId: `KH${String(Date.now()).slice(-3)}`,
      ...customerData,
      totalPurchases: 0,
      status: "active",
    },
  }
}

const deleteCustomer = async (id) => {
  return { success: true }
}

function Customers() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    registrationDate: new Date().toISOString().split("T")[0],
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const customersResponse = await getCustomers()
        setCustomers(customersResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!newCustomer.firstName) errors.firstName = "Vui lòng nhập tên"
    if (!newCustomer.lastName) errors.lastName = "Vui lòng nhập họ"
    if (!newCustomer.email) {
      errors.email = "Vui lòng nhập email"
    } else if (!/^\S+@\S+\.\S+$/.test(newCustomer.email)) {
      errors.email = "Email không hợp lệ"
    }
    if (!newCustomer.phone) errors.phone = "Vui lòng nhập số điện thoại"
    if (!newCustomer.address) errors.address = "Vui lòng nhập địa chỉ"
    if (!newCustomer.registrationDate) errors.registrationDate = "Vui lòng nhập ngày đăng ký"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      const response = await addCustomer(newCustomer)
      setCustomers([...customers, response.data])

      setNewCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        registrationDate: new Date().toISOString().split("T")[0],
      })
      setShowAddModal(false)
      toast.success("Thêm khách hàng thành công!")
    } catch (error) {
      console.error("Error adding customer:", error)
      toast.error("Lỗi khi thêm khách hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        setIsLoading(true)
        await deleteCustomer(id)
        setCustomers(customers.filter((customer) => customer._id !== id))
        toast.success("Xóa khách hàng thành công!")
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast.error("Lỗi khi xóa khách hàng")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

   return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-muted-foreground">Quản lý thông tin khách hàng trong hệ thống.</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Thêm khách hàng
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Tìm khách hàng..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-[180px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Khách hàng
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Mã KH
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Địa chỉ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Tổng đơn mua
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Ngày đăng ký
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Trạng thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted-foreground">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted-foreground">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar || "/placeholder.svg"}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = "/images/default-avatar.png"
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">{customer.firstName.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{customer.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground max-w-xs truncate">
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {formatCurrency(customer.totalPurchases)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(customer.registrationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {customer.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleDropdown(customer._id)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {activeDropdown === customer._id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md bg-popover py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10 text-left border">
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground text-left"
                          >
                            Xem chi tiết
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground text-left"
                          >
                            Chỉnh sửa
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground text-left"
                          >
                            Lịch sử mua hàng
                          </a>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleDeleteCustomer(customer._id)}
                          >
                            Xóa khách hàng
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

      {/* Modal thêm khách hàng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowAddModal(false)}></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-card text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle border">
              <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-medium leading-6 text-card-foreground">Thêm khách hàng mới</h3>
                  <button
                    type="button"
                    className="rounded-md bg-card text-muted-foreground hover:text-foreground focus:outline-none"
                    onClick={() => setShowAddModal(false)}
                  >
                    <span className="sr-only">Đóng</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-card-foreground">
                        Tên <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={newCustomer.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.firstName ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.firstName && <p className="mt-1 text-xs text-destructive">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-card-foreground">
                        Họ <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={newCustomer.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.lastName ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.lastName && <p className="mt-1 text-xs text-destructive">{formErrors.lastName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={newCustomer.email}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.email ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.email && <p className="mt-1 text-xs text-destructive">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-card-foreground">
                        Số điện thoại <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={newCustomer.phone}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.phone ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.phone && <p className="mt-1 text-xs text-destructive">{formErrors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-card-foreground">
                        Địa chỉ <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={newCustomer.address}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.address ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.address && <p className="mt-1 text-xs text-destructive">{formErrors.address}</p>}
                    </div>

                    <div>
                      <label htmlFor="registrationDate" className="block text-sm font-medium text-card-foreground">
                        Ngày đăng ký <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="date"
                        name="registrationDate"
                        id="registrationDate"
                        value={newCustomer.registrationDate}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border ${
                          formErrors.registrationDate ? "border-destructive" : "border-input"
                        } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                      />
                      {formErrors.registrationDate && (
                        <p className="mt-1 text-xs text-destructive">{formErrors.registrationDate}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-card-foreground">Ảnh đại diện</label>
                      <div className="mt-1 flex items-center">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                          <User className="h-full w-full text-muted-foreground" />
                        </div>
                        <button
                          type="button"
                          className="ml-5 rounded-md border border-input bg-background py-2 px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Upload className="mr-2 -ml-1 h-4 w-4 inline-block" />
                          Tải lên
                        </button>
                        <p className="ml-3 text-xs text-muted-foreground">Sẽ sử dụng ảnh mặc định nếu không tải lên</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Thêm khách hàng"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-input bg-background px-4 py-2 text-base font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
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

export default Customers

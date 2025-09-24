"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { toast } from "react-toastify"

function ImportGoods() {
  const navigate = useNavigate()
  const [importItems, setImportItems] = useState([
    {
      id: "1",
      productCode: "",
      productName: "",
      author: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [importDate, setImportDate] = useState(new Date().toISOString().split("T")[0])
  const [supplier, setSupplier] = useState("")
  const [notes, setNotes] = useState("")

  const addImportItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productCode: "",
      productName: "",
      author: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    }
    setImportItems([...importItems, newItem])
  }

  const removeImportItem = (id) => {
    if (importItems.length > 1) {
      setImportItems(importItems.filter((item) => item.id !== id))
    }
  }

  const updateImportItem = (id, field, value) => {
    setImportItems(
      importItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      })
    )
  }

  const getTotalImportValue = () => {
    return importItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!supplier.trim()) {
      toast.error("Vui lòng nhập tên nhà cung cấp")
      return
    }

    const hasEmptyItems = importItems.some(
      (item) =>
        !item.productCode.trim() ||
        !item.productName.trim() ||
        !item.author.trim() ||
        item.quantity <= 0 ||
        item.unitPrice <= 0
    )

    if (hasEmptyItems) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả sản phẩm")
      return
    }

    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Nhập hàng thành công!")
      setTimeout(() => {
        navigate("/inventory")
      }, 1500)
    } catch (error) {
      console.error("Error importing goods:", error)
      toast.error("Lỗi khi nhập hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate("/inventory")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div>
          <h1 className="text-3xl font-bold">Nhập hàng</h1>
          <p className="text-muted-foreground">Thêm sản phẩm mới vào kho hàng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Import Information */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin nhập hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày nhập</label>
              <input
                type="date"
                value={importDate}
                onChange={(e) => setImportDate(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nhà cung cấp</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Nhập tên nhà cung cấp"
                className="w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Ghi chú</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú thêm..."
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Import Items */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
            <button
              type="button"
              onClick={addImportItem}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2">Mã SP</th>
                  <th className="px-4 py-2">Tên sản phẩm</th>
                  <th className="px-4 py-2">Tác giả</th>
                  <th className="px-4 py-2">Số lượng</th>
                  <th className="px-4 py-2">Đơn giá</th>
                  <th className="px-4 py-2">Thành tiền</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {importItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.productCode}
                        onChange={(e) => updateImportItem(item.id, "productCode", e.target.value)}
                        placeholder="SP001"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateImportItem(item.id, "productName", e.target.value)}
                        placeholder="Tên sản phẩm"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.author}
                        onChange={(e) => updateImportItem(item.id, "author", e.target.value)}
                        placeholder="Tác giả"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateImportItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateImportItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">{formatCurrency(item.totalPrice)}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeImportItem(item.id)}
                        disabled={importItems.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mt-4 flex justify-end">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-gray-600">Tổng giá trị nhập hàng:</div>
              <div className="text-lg font-bold">{formatCurrency(getTotalImportValue())}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Đang xử lý..." : "Lưu nhập hàng"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ImportGoods

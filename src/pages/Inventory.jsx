import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

// Mock API functions for products
const getProducts = async () => {
  return {
    data: [
      {
        _id: "1",
        productCode: "SP001",
        productName: "Sách Lập trình JavaScript",
        author: "Nguyễn Văn A",
        quantity: 150,
        status: "in-stock",
        createdDate: "2024-01-15",
      },
      {
        _id: "2",
        productCode: "SP002",
        productName: "Sách React và Next.js",
        author: "Trần Thị B",
        quantity: 5,
        status: "low-stock",
        createdDate: "2024-02-20",
      },
      {
        _id: "3",
        productCode: "SP003",
        productName: "Sách Python cho người mới bắt đầu",
        author: "Lê Minh C",
        quantity: 0,
        status: "out-of-stock",
        createdDate: "2023-12-10",
      },
    ],
  }
}

const deleteProduct = async (id) => {
  return { success: true }
}

function Inventory() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const productsResponse = await getProducts()
        setProducts(productsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        setIsLoading(true)
        await deleteProduct(id)
        setProducts(products.filter((product) => product._id !== id))
        toast.success("Xóa sản phẩm thành công!")
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("Lỗi khi xóa sản phẩm")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Filter products based on search term and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case "in-stock":
        return {
          label: "Còn hàng",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800",
        }
      case "low-stock":
        return {
          label: "Sắp hết",
          icon: AlertTriangle,
          className: "bg-yellow-100 text-yellow-800",
        }
      case "out-of-stock":
        return {
          label: "Hết hàng",
          icon: XCircle,
          className: "bg-red-100 text-red-800",
        }
      default:
        return {
          label: "Không xác định",
          icon: Package,
          className: "bg-gray-100 text-gray-800",
        }
    }
  }

  // Navigate to import page
  const handleImportGoods = () => {
    navigate("/import-goods")
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Kho hàng</h1>
          <p className="text-gray-500">Quản lý thông tin sản phẩm và tồn kho trong hệ thống.</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={handleImportGoods}
        >
          <Package className="h-4 w-4" />
          Nhập hàng
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-md border py-2 pl-10 pr-4 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-md border py-2 pl-3 pr-10 text-sm sm:w-[180px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="in-stock">Còn hàng</option>
          <option value="low-stock">Sắp hết</option>
          <option value="out-of-stock">Hết hàng</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Mã SP</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tác giả</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Trạng thái</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ngày tạo</th> */}
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const statusInfo = getStatusInfo(product.status)
                const StatusIcon = statusInfo.icon
                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{product.productCode}</td>
                    <td className="px-6 py-4 text-sm">{product.productName}</td>
                    <td className="px-6 py-4 text-sm">{product.author}</td>
                    <td className="px-6 py-4 text-sm">{product.quantity}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-sm">{new Date(product.createdDate).toLocaleDateString("vi-VN")}</td> */}
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleDropdown(product._id)}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {activeDropdown === product._id && (
                        <div className="absolute right-10 mt-2 w-48 rounded-md bg-white shadow-md border z-10">
                          <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Xem chi tiết</button>
                          <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Chỉnh sửa</button>
                          <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Cập nhật số lượng</button>
                          <button
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Xóa sản phẩm
                          </button>
                        </div>
                      )}
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

export default Inventory

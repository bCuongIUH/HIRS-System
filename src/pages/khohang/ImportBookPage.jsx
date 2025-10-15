import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  Button,
  Table,
  Space,
  InputNumber,
  AutoComplete,
  Tag,
  Typography,
  Divider,
  message,
  Statistic,
} from "antd"
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

const bookDatabase = [
  { isbn: "123", name: "Thám Tử Lừng Danh Conan", volume: "Tập 1", category: "Truyện tranh", sellPrice: 25000 },
  { isbn: "124", name: "Thám Tử Lừng Danh Conan", volume: "Tập 2", category: "Truyện tranh", sellPrice: 25000 },
  { isbn: "125", name: "Thám Tử Lừng Danh Conan", volume: "Tập 3", category: "Truyện tranh", sellPrice: 25000 },
  { isbn: "456", name: "Doraemon", volume: "Tập 1", category: "Truyện tranh", sellPrice: 22000 },
  { isbn: "457", name: "Doraemon", volume: "Tập 2", category: "Truyện tranh", sellPrice: 22000 },
  { isbn: "789", name: "Harry Potter và Hòn Đá Phù Thủy", volume: "Tập 1", category: "Tiểu thuyết", sellPrice: 150000 },
  { isbn: "790", name: "Harry Potter và Phòng Chứa Bí Mật", volume: "Tập 2", category: "Tiểu thuyết", sellPrice: 150000 },
  { isbn: "791", name: "Harry Potter và Tên Tù Nhân Ngục Azkaban", volume: "Tập 3", category: "Tiểu thuyết", sellPrice: 160000 },
]

export default function ImportBooksPage() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [selectedBook, setSelectedBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [importPrice, setImportPrice] = useState("")
  const [importList, setImportList] = useState([])

  // Hàm gợi ý sách
  const getSearchOptions = (searchText) => {
    if (!searchText) return []
    const filtered = bookDatabase.filter(
      (book) =>
        book.isbn.toLowerCase().includes(searchText.toLowerCase()) ||
        book.name.toLowerCase().includes(searchText.toLowerCase()),
    )

    const grouped = filtered.reduce((acc, book) => {
      if (!acc[book.name]) acc[book.name] = []
      acc[book.name].push(book)
      return acc
    }, {})

    return Object.entries(grouped).map(([bookName, volumes]) => ({
      label: (
        <div className="py-2">
          <div className="font-semibold">{bookName}</div>
          <div className="text-sm text-gray-500">
            {volumes.length > 1 ? `${volumes.length} tập có sẵn` : volumes[0].volume}
          </div>
        </div>
      ),
      options: volumes.map((book) => ({
        value: `${book.isbn} - ${book.name} - ${book.volume}`,
        label: (
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="font-mono mr-2">{book.isbn}</span>
              <span>{book.volume}</span>
            </div>
            <Tag color="blue">{book.category}</Tag>
          </div>
        ),
        book,
      })),
    }))
  }

  const handleSelect = (_, option) => {
    const book = option.book
    setSelectedBook(book)
    setSearchValue(`${book.isbn} - ${book.name} - ${book.volume}`)
    setImportPrice("")
  }

  const handleAddToList = () => {
    if (!selectedBook) return message.warning("Vui lòng chọn sách từ danh sách gợi ý")
    if (!quantity || quantity <= 0) return message.warning("Vui lòng nhập số lượng hợp lệ")
    if (!importPrice || importPrice <= 0) return message.warning("Vui lòng nhập giá nhập hợp lệ")

    const newItem = {
      key: `${selectedBook.isbn}-${Date.now()}`,
      ...selectedBook,
      quantity,
      importPrice,
      profit: (selectedBook.sellPrice - importPrice) * quantity,
    }

    setImportList([...importList, newItem])
    setSearchValue("")
    setSelectedBook(null)
    setQuantity(1)
    setImportPrice("")
    message.success("Đã thêm sách vào danh sách nhập hàng")
  }

  const handleDelete = (key) => {
    setImportList(importList.filter((item) => item.key !== key))
    message.info("Đã xóa sách khỏi danh sách")
  }

  const totalQuantity = importList.reduce((sum, item) => sum + item.quantity, 0)
  const totalImportCost = importList.reduce((sum, item) => sum + item.importPrice * item.quantity, 0)
  const totalProfit = importList.reduce((sum, item) => sum + item.profit, 0)

  const columns = [
    { title: "Mã ISBN", dataIndex: "isbn", key: "isbn", render: (t) => <span className="font-mono">{t}</span> },
    { title: "Tên Sách", dataIndex: "name", key: "name" },
    { title: "Tập", dataIndex: "volume", key: "volume" },
    { title: "Thể Loại", dataIndex: "category", key: "category", render: (t) => <Tag>{t}</Tag> },
    { title: "Số Lượng", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "Giá Nhập",
      dataIndex: "importPrice",
      key: "importPrice",
      align: "right",
      render: (p) => `${p.toLocaleString()} ₫`,
    },
    {
      title: "Giá Bán",
      dataIndex: "sellPrice",
      key: "sellPrice",
      align: "right",
      render: (p) => `${p.toLocaleString()} ₫`,
    },
    {
      title: "Lợi Nhuận",
      dataIndex: "profit",
      key: "profit",
      align: "right",
      render: (p) => <span className="text-green-600">{p.toLocaleString()} ₫</span>,
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/bookInventoryPage")}
            className="text-blue-600"
          >
            Quay lại kho hàng
          </Button>
          {/* <Title level={2}>Nhập Hàng</Title> */}
        </div>

        {/* Search Section */}
        <Card>
          <Title level={4}>Tìm kiếm sách</Title>
          <Space direction="vertical" size="large" className="w-full">
            <AutoComplete
              value={searchValue}
              options={getSearchOptions(searchValue)}
              onSelect={handleSelect}
              onChange={setSearchValue}
              placeholder="Nhập mã ISBN hoặc tên sách..."
              className="w-full"
            />
            {selectedBook && (
              <Card>
                <Text strong>{selectedBook.name}</Text> - {selectedBook.volume}
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <Text>Số lượng</Text>
                    <InputNumber min={1} value={quantity} onChange={setQuantity} className="w-full" />
                  </div>
                  <div>
                    <Text>Giá nhập (₫)</Text>
                    <InputNumber
                      min={0}
                      value={importPrice}
                      onChange={setImportPrice}
                      className="w-full"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => v.replace(/(,*)/g, "")}
                    />
                  </div>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddToList} className="mt-4 w-full">
                  Thêm vào danh sách
                </Button>
              </Card>
            )}
          </Space>
        </Card>

        {/* Table Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Danh sách nhập hàng</Title>
            <Tag color="blue">{importList.length} sách</Tag>
          </div>

          <Table columns={columns} dataSource={importList} pagination={false} />

          {importList.length > 0 && (
            <>
              <Divider />
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <Statistic title="Tổng Số Lượng" value={totalQuantity} prefix={<BookOutlined />} />
                </Card>
                <Card>
                  <Statistic
                    title="Tổng Tiền Nhập"
                    value={totalImportCost}
                    suffix="₫"
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Lợi Nhuận Dự Kiến"
                    value={totalProfit}
                    suffix="₫"
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </div>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                className="w-full mt-6"
                onClick={() => {
                  message.success("Đã xác nhận nhập hàng thành công!")
                  setImportList([])
                }}
              >
                Xác Nhận Nhập Hàng
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

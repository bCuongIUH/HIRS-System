"use client"

import { useState, useEffect } from "react"
import { Table, Input, Button, Tag, Card, Space, Statistic, Row, Col, Select, message } from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  BookOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const { Search } = Input

export default function BookInventoryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()

  // ✅ Gọi API để lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5000/api/books")
        if (res.data.success) {
          // Chuyển dữ liệu từ API về định dạng phù hợp với bảng
          const formattedBooks = res.data.data.map((book) => ({
            key: book._id,
            issn: book.ISSN || "—",
            name: book.title,
            volume: book.volume || "—",
            category: book.category?.name || "Chưa phân loại",
            quantity: book.stock ?? 0,
          }))
          setBooks(formattedBooks)
        } else {
          message.error("Không thể tải danh sách sách.")
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error)
        message.error("Lỗi khi tải dữ liệu sách!")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // ✅ Trạng thái hiển thị
  const getStatusTag = (quantity) => {
    if (quantity >= 10) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success" className="rounded-full px-3">
          Còn hàng
        </Tag>
      )
    }
    if (quantity > 0) {
      return (
        <Tag icon={<WarningOutlined />} color="warning" className="rounded-full px-3">
          Sắp hết
        </Tag>
      )
    }
    return (
      <Tag icon={<InboxOutlined />} color="error" className="rounded-full px-3">
        Hết hàng
      </Tag>
    )
  }

  // ✅ Lọc dữ liệu
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.issn.toLowerCase().includes(searchText.toLowerCase()) ||
      book.name.toLowerCase().includes(searchText.toLowerCase()) ||
      book.volume.toLowerCase().includes(searchText.toLowerCase())

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // ✅ Tính thống kê
  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0)
  const inStockBooks = books.filter((book) => book.quantity >= 10).length
  const lowStockBooks = books.filter((book) => book.quantity > 0 && book.quantity < 10).length
  const outOfStockBooks = books.filter((book) => book.quantity === 0).length

  // ✅ Cột bảng
  const columns = [
    {
      title: "Mã ISBN",
      dataIndex: "issn",
      key: "issn",
      width: 300,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tên Sách",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tập",
      dataIndex: "volume",
      key: "volume",
      width: 120,
    },
    {
      title: "Thể Loại",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (text) => (
        <Tag className="rounded-md" bordered={false}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center",
      render: (quantity) => (
        <span
          className={`font-bold text-lg ${
            quantity >= 10 ? "text-success" : quantity > 0 ? "text-warning" : "text-danger"
          }`}
        >
          {quantity}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 150,
      render: (_, record) => getStatusTag(record.quantity),
    },
  ]

  const categories = ["all", ...new Set(books.map((book) => book.category))]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[95%] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BookOutlined className="text-primary" />
              Quản Lý Kho Sách
            </h1>
            <p className="text-muted-foreground text-lg">Theo dõi tồn kho và quản lý sách hiệu quả</p>
          </div>
        <Space>
          <Button
            type="default"
            size="large"
            icon={<InboxOutlined />}
            className="h-12 px-6 text-base font-semibold"
            onClick={() => navigate("/warehouseListPage")}
          >
            Danh Sách Phiếu Nhập
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="bg-primary hover:bg-accent h-12 px-6 text-base font-semibold"
            onClick={() => navigate("/importBookPage")}
          >
            Nhập Hàng
          </Button>
        </Space>
        </div>

               {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-card border-border hover:border-primary transition-colors">
              <Statistic
                title={<span className="text-muted-foreground">Tổng Số Sách</span>}
                value={totalBooks}
                prefix={<BookOutlined className="text-primary" />}
                valueStyle={{ color: "#3b82f6", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-card border-border hover:border-success transition-colors">
              <Statistic
                title={<span className="text-muted-foreground">Còn Hàng</span>}
                value={inStockBooks}
                prefix={<CheckCircleOutlined className="text-success" />}
                valueStyle={{ color: "#10b981", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-card border-border hover:border-warning transition-colors">
              <Statistic
                title={<span className="text-muted-foreground">Sắp Hết</span>}
                value={lowStockBooks}
                prefix={<WarningOutlined className="text-warning" />}
                valueStyle={{ color: "#f59e0b", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-card border-border hover:border-danger transition-colors">
              <Statistic
                title={<span className="text-muted-foreground">Hết Hàng</span>}
                value={outOfStockBooks}
                prefix={<InboxOutlined className="text-danger" />}
                valueStyle={{ color: "#ef4444", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>
        {/* Search & Filter */}
        <Card>
          <Space direction="vertical" size="middle" className="w-full">
            <div className="flex flex-col md:flex-row gap-4">
              <Search
                placeholder="Tìm theo mã ISSN, tên sách hoặc tập..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1"
              />
              <Select
                size="large"
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-full md:w-48"
                options={categories.map((cat) => ({
                  label: cat === "all" ? "Tất cả thể loại" : cat,
                  value: cat,
                }))}
              />
            </div>
          </Space>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredBooks}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} sách`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  )
}

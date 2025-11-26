import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ImportBooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]); // ✅ Lưu dữ liệu từ API
  const [searchValue, setSearchValue] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [importPrice, setImportPrice] = useState("");
  const [importList, setImportList] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const userId = localStorage.getItem("userId");

  // ✅ Lấy thông tin nhân viên theo userId
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/employeesID/user/${userId}`);
        if (res.data.success) {
          setCurrentEmployee(res.data.data);
          console.log("✅ Nhân viên hiện tại:", res.data.data);
        } else {
          message.error("Không lấy được thông tin nhân viên");
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy nhân viên:", err);
        message.error("Lỗi khi lấy thông tin nhân viên");
      }
    };

    fetchEmployee();
  }, [userId]);

  // ✅ Lấy user thông tin từ localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (userId) {
      console.log("✅ User hiện tại:");
      console.log("ID:", userId);
      console.log("Tên:", userName);
      console.log("Email:", userEmail);
      console.log("Vai trò:", userRole);
    } else {
      console.warn("❌ Không tìm thấy user trong localStorage");
    }
  }, []);

  // ✅ Gọi API lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        if (res.data.success) {
          setBooks(res.data.data);
          console.log("✅ Dữ liệu sách:", res.data.data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu sách:", err);
      }
    };
    fetchBooks();
  }, []);

  // ✅ Gợi ý tìm kiếm
  const getSearchOptions = (searchText) => {
    if (!searchText) return [];
    const filtered = books.filter(
      (book) =>
        book.ISSN?.toLowerCase().includes(searchText.toLowerCase()) ||
        book.title?.toLowerCase().includes(searchText.toLowerCase())
    );

    const grouped = filtered.reduce((acc, book) => {
      if (!acc[book.title]) acc[book.title] = [];
      acc[book.title].push(book);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, volumes]) => ({
      label: (
        <div className="py-2">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">
            {volumes.length > 1
              ? `${volumes.length} tập có sẵn`
              : volumes[0].volume || "Không có tập"}
          </div>
        </div>
      ),
      options: volumes.map((book) => ({
        value: `${book.ISSN} - ${book.title} - ${book.volume || "Tập đơn"}`,
        label: (
          <div className="flex justify-between items-center py-1">
            <div>
              <span className="font-mono mr-2">{book.ISSN}</span>
              <span>{book.volume || "Tập đơn"}</span>
            </div>
            <Tag color="blue">{book.category?.name}</Tag>
          </div>
        ),
        book,
      })),
    }));
  };

  // ✅ Khi chọn sách
  const handleSelect = (_, option) => {
    const book = option.book;
    setSelectedBook(book);
    setSearchValue(` ${book.title} - Tập ${book.volume || "đơn"}`);
    setImportPrice("");
  };

  // ✅ Thêm sách vào danh sách nhập
  const handleAddToList = () => {
    if (!selectedBook) return message.warning("Vui lòng chọn sách từ danh sách gợi ý");
    if (!quantity || quantity <= 0) return message.warning("Vui lòng nhập số lượng hợp lệ");
    if (!importPrice || importPrice <= 0) return message.warning("Vui lòng nhập giá nhập hợp lệ");
  

    const newItem = {
      key: `${selectedBook._id}-${Date.now()}`,
      ...selectedBook,
      quantity,
      importPrice,
      profit: (selectedBook.price - importPrice) * quantity,
    };

    setImportList([...importList, newItem]);
    setSearchValue("");
    setSelectedBook(null);
    setQuantity(1);
    setImportPrice("");
    message.success("Đã thêm sách vào danh sách nhập hàng");
  };

  // ✅ Xóa sách
  const handleDelete = (key) => {
    setImportList(importList.filter((item) => item.key !== key));
    message.info("Đã xóa sách khỏi danh sách");
  };

  // ✅ Tạo phiếu nhập hàng
  const handleConfirmImport = async () => {
    if (!currentEmployee) return message.error("Không xác định được nhân viên");
    if (importList.length === 0) return message.warning("Danh sách nhập trống");

    try {
      const res = await axios.post("http://localhost:5000/api/warehouse", {
        enteredBy: currentEmployee._id,
        content: importList.map((item) => ({
          book: item._id,
          quantity: item.quantity,
          importPrice: item.importPrice,
          volume: item.volume,
          total: item.quantity * item.importPrice,
        })),
      });

      if (res.data.success) {
        message.success("Tạo phiếu nhập kho thành công!");
        setImportList([]);
      } else {
        message.error("Tạo phiếu nhập kho thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tạo phiếu nhập kho");
    }
  };

  // ✅ Tổng hợp
  const totalQuantity = importList.reduce((sum, item) => sum + item.quantity, 0);
  const totalImportCost = importList.reduce((sum, item) => sum + item.importPrice * item.quantity, 0);
  const totalProfit = importList.reduce((sum, item) => sum + item.profit, 0);

  const columns = [
    { title: "Mã ISBN", dataIndex: "ISSN", key: "ISSN", render: (t) => <span className="font-mono">{t}</span> },
    { title: "Tên Sách", dataIndex: "title", key: "title" },
    { title: "Tập", dataIndex: "volume", key: "volume", render: (v) => v || "Tập đơn" },
    {
      title: "Thể Loại",
      dataIndex: ["category", "name"],
      key: "category",
      render: (t) => <Tag>{t}</Tag>,
    },
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
      dataIndex: "price",
      key: "price",
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
  ];

  return (
     <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Header */}
       <div className="flex items-center justify-between mb-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/bookInventoryPage")}
            className="text-600"
          >
            Quay lại kho hàng
          </Button>
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
                <Text strong>{selectedBook.title}</Text> - Tập {selectedBook.volume || "Tập đơn"}
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <Text>Số lượng</Text>
                    <InputNumber min={1} value={quantity} onChange={setQuantity} className="w-full" />
                  </div>
                  <div>
                    <Text>Giá nhập(1) (₫) </Text>
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
                onClick={handleConfirmImport} // ✅ Gọi API tạo phiếu nhập hàng
              >
                Xác Nhận Nhập Hàng
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

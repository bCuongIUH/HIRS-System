"use client"

import { useEffect, useState } from "react"
import { Table, Card, Button, Tag, message } from "antd"
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Modal, Descriptions } from "antd"
export default function WarehouseListPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/warehouse")
      if (res.data.success) {
        setData(res.data.data)
      }
    } catch (error) {
      message.error("Không thể tải danh sách phiếu nhập!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
const showModal = (record) => {
  setSelectedRecord(record)
  setIsModalOpen(true)
}

const handleClose = () => {
  setIsModalOpen(false)
  setSelectedRecord(null)
}
  const columns = [
    {
    title: "Mã Phiếu Nhập",
    dataIndex: "code",
    key: "code",
    render: (text) => <span className="font-semibold text-base">{text}</span>,
    },

    {
      title: "Người Nhập",
      dataIndex: "enteredBy",
       render: (_, record) => record.enteredBy || "Không rõ",
    },
    {
      title: "Ngày Nhập",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Số đầu sách",
      dataIndex: "totalBooks",
      key: "totalBooks",
      render: (_, record) => record.content?.length || 0,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (val) => val.toLocaleString("vi-VN") + "₫",
    },
     {
    title: "Thao tác",
    key: "actions",
    align: "center",
    render: (_, record) => (
      <Button icon={<FileTextOutlined />} onClick={() => showModal(record)}>
        Xem chi tiết
      </Button>
    ),
  },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Danh Sách Phiếu Nhập</h1>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate("/importBookPage")}
          >
            Nhập Hàng
          </Button>
        </div>

        <Card className="w-full">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{ pageSize: 8 }}
            rowKey="id"
          />
        </Card>
<Modal
  open={isModalOpen}
  title="Chi tiết phiếu nhập"
  footer={null}
  onCancel={handleClose}
  width={800}
>
  {selectedRecord && (
    <>
      {/* 🎯 Thông tin phiếu nhập */}
      <Descriptions bordered column={2} className="mb-4">
        <Descriptions.Item label="Mã phiếu">
          {selectedRecord.code}
        </Descriptions.Item>
        <Descriptions.Item label="Người nhập">
          {selectedRecord.enteredBy || "Không rõ"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày nhập">
          {new Date(selectedRecord.date).toLocaleDateString("vi-VN")}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {selectedRecord.totalAmount.toLocaleString("vi-VN")}₫
        </Descriptions.Item>
      </Descriptions>

      {/* 📚 Danh sách sách nhập */}
      <h3 className="font-bold text-lg mb-2">Danh sách sách nhập</h3>

      <Table
        dataSource={selectedRecord.content}
        rowKey="_id"
        pagination={false}
        bordered
        size="small"
        columns={[
          {
            title: "Tên sách",
            dataIndex: ["book", "title"],
            key: "title",
            width: "40%",
          },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "15%",
          },
          {
            title: "Giá nhập",
            dataIndex: "importPrice",
            key: "importPrice",
            align: "right",
            width: "20%",
            render: (price) => price.toLocaleString("vi-VN") + "₫",
          },
          {
            title: "Thành tiền",
            dataIndex: "total",
            key: "total",
            align: "right",
            width: "25%",
            render: (total) => total.toLocaleString("vi-VN") + "₫",
          },
        ]}
      />
    </>
  )}
</Modal>
      </div>
    </div>
  )
}

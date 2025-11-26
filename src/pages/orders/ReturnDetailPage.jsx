// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button, message, Spin, Steps, Timeline, Card, Row, Col } from "antd";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import { getUserProfile } from "../../utils/auth";


// const { Step } = Steps;

// const stepList = [
//   { key: "pending", label: "Đang yêu cầu" },
//   { key: "accepted", label: "Tiếp nhận yêu cầu" },
//   { key: "checking", label: "Kiểm hàng" },
//   { key: "completed", label: "Hoàn thành" },
//   { key: "rejected", label: "Từ chối" },
// ];

// const ReturnDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const fetchOrder = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`http://localhost:5000/api/returns/order/${id}`);
//       const result = await res.json();
//       if (result.success && result.data) setOrder(result.data);
//       else message.error(result.message || "Không tìm thấy yêu cầu hoàn trả");
//     } catch (err) {
//       console.error(err);
//       message.error("Lỗi khi tải thông tin yêu cầu hoàn trả");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchOrder();
//   }, [id]);

//   const formatCurrency = (value) => {
//     if (isNaN(Number(value))) return "₫0";
//     return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value));
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     try {
//       return new Date(dateString).toLocaleDateString("vi-VN", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return dateString;
//     }
//   };

// const handleAccept = async () => {
//   if (!window.confirm("Bạn có chắc chắn tiếp nhận yêu cầu hoàn trả này?")) return;

//   try {
//     setUpdating(true);

//     const user = await getUserProfile(); // lấy từ token
//     const res = await fetch(
//       `http://localhost:5000/api/returns/acceptReturn/${id}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           userName: user.name,
//         }),
//       }
//     );
//     const result = await res.json();

//     if (result.success) {
//       setOrder(result.data);
//       message.success("Đã tiếp nhận yêu cầu hoàn trả");
//     } else {
//       message.error(result.message || "Cập nhật thất bại");
//     }
//   } catch (err) {
//     console.error(err);
//     message.error("Có lỗi xảy ra");
//   } finally {
//     setUpdating(false);
//   }
// };


//   const handleReject = async () => {
//     if (!window.confirm("Bạn có chắc chắn từ chối yêu cầu hoàn trả này?")) return;

//     try {
//       setUpdating(true);
//       const user = await getUserProfile();

//       const res = await fetch(`http://localhost:5000/api/returns/reject/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           userName: user.name,
//         }),
//       });

//       const result = await res.json();
//       if (result.success) {
//         setOrder(result.data);
//         message.error("Đã từ chối yêu cầu hoàn trả");
//       } else {
//         message.error(result.message || "Cập nhật thất bại");
//       }
//     } catch (err) {
//       console.error(err);
//       message.error("Có lỗi xảy ra");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getCurrentStep = () => {
//     if (!order) return 0;
//     switch (order.status) {
//       case "pending": return 0;
//       case "accepted": return 1;
//       case "checking": return 2;
//       case "completed": return 3;
//       case "rejected": return 4;
//       default: return 0;
//     }
//   };

//   if (loading) return <Spin tip="Đang tải..." className="min-h-screen flex justify-center items-center" />;
//   if (!order) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy yêu cầu hoàn trả</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold">Chi tiết hoàn trả</h1>
//         <Button onClick={() => navigate(-1)}>Quay lại</Button>
//       </div>

//       <Row gutter={16}>
//         <Col xs={24} lg={16} className="space-y-6">
//           <Card title="Thông tin yêu cầu hoàn trả">
//             <Steps current={getCurrentStep()} size="small" direction="horizontal" className="mb-6">
//               {stepList.map((step, idx) => (
//                 <Step
//                   key={step.key}
//                   title={step.label}
//                   status={
//                     order.status === "rejected"
//                       ? "error"
//                       : idx < getCurrentStep()
//                       ? "finish"
//                       : idx === getCurrentStep()
//                       ? "process"
//                       : "wait"
//                   }
//                 />
//               ))}
//             </Steps>
//             <p><span className="font-semibold">Ngày yêu cầu: </span>{formatDate(order.createdAt)}</p>
//             <p><span className="font-semibold">Lý do: </span>{order.reason}</p>
//             <p><span className="font-semibold">Người yêu cầu: </span>{order.requestedBy?.name || "Không xác định"}</p>

//             {order.images?.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="font-semibold mb-2">Ảnh minh họa sản phẩm lỗi</h3>
//                 <div className="flex gap-4 flex-wrap">
//                   {order.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Ảnh lỗi ${idx + 1}`}
//                       className="w-32 h-32 object-cover rounded-md border cursor-pointer"
//                       onClick={() => window.open(img, "_blank")}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             {(order.status === "pending" || order.status === "accepted" || order.status === "checking") && (
//               <div className="flex gap-4 mt-4">
//                 <Button type="primary" onClick={handleAccept} loading={updating}>
//                   {order.status === "accepted" ? "Chấp nhận hoàn trả" : "Tiếp nhận yêu cầu"}
//                 </Button>
//                 <Button danger onClick={handleReject} loading={updating}>
//                   Từ chối
//                 </Button>
//               </div>
//             )}
//           </Card>
//         </Col>

//         <Col xs={24} lg={8}>
//           <Card title="Sản phẩm trả">
//             <div className="mt-6 space-y-4">
//               {order.items?.map((item) => (
//                 <div key={item._id || Math.random()} className="flex justify-between border-b pb-4 last:border-b-0">
//                   <div>
//                     <h4 className="font-semibold">{item.title}</h4>
//                     <p>Số lượng: {item.quantity}</p>
//                   </div>
//                   <div className="text-right">
//                     <p>{formatCurrency(item.total)}</p>
//                     <p>{formatCurrency(item.price)}/cái</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           <Card title="Tổng đơn hàng">
//             <div className="mt-6 space-y-2">
//               <div className="flex justify-between"><span>Tạm tính</span><span>{formatCurrency(order.subtotal)}</span></div>
//               <div className="flex justify-between"><span>Phí vận chuyển</span><span>{formatCurrency(order.shippingFee)}</span></div>
//               <div className="flex justify-between"><span>Thuế</span><span>{formatCurrency(order.tax)}</span></div>
//               <div className="flex justify-between font-bold text-blue-600 text-lg mt-2">
//                 <span>Tổng cộng</span><span>{formatCurrency(order.total)}</span>
//               </div>
//             </div>
//           </Card>

//           <Card title="Nhân viên tiếp nhận">
//             <Timeline>
//               {order.statusHistory?.map((item, idx) => (
//                 <Timeline.Item
//                   key={idx}
//                   color="green"
//                   dot={<CheckCircleOutlined />}
//                 >
//                   {item.updatedByName} - {item.status} ({formatDate(item.updatedAt)})
//                 </Timeline.Item>
//               ))}
//             </Timeline>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default ReturnDetailPage;
"use client"

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Spin, Steps, Timeline, Card, Row, Col, Modal } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getUserProfile } from "../../utils/auth";

const { Step } = Steps;
const { confirm } = Modal;

const stepList = [
  { key: "pending", label: "Đang yêu cầu" },
  { key: "accepted", label: "Tiếp nhận yêu cầu" },
  { key: "checking", label: "Kiểm hàng" },
  { key: "completed", label: "Hoàn thành" },
  { key: "rejected", label: "Từ chối" },
];

const ReturnDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/returns/order/${id}`);
      const result = await res.json();
      if (result.success && result.data) setOrder(result.data);
      else message.error(result.message || "Không tìm thấy yêu cầu hoàn trả");
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải thông tin yêu cầu hoàn trả");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const formatCurrency = (value) => {
    if (isNaN(Number(value))) return "₫0";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleAccept = async () => {
    const user = await getUserProfile();
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn tiếp nhận yêu cầu hoàn trả này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setUpdating(true);
          const res = await fetch(`http://localhost:5000/api/returns/acceptReturn/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, userName: user.name }),
          });
          const result = await res.json();
          if (result.success) {
            setOrder(result.data);
            message.success("Đã tiếp nhận yêu cầu hoàn trả");
          } else {
            message.error(result.message || "Cập nhật thất bại");
          }
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra");
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleReject = async () => {
    const user = await getUserProfile();
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn từ chối yêu cầu hoàn trả này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setUpdating(true);
          const res = await fetch(`http://localhost:5000/api/returns/rejectReturn/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, userName: user.name }),
          });
          const result = await res.json();
          if (result.success) {
            setOrder(result.data);
            message.error("Đã từ chối yêu cầu hoàn trả");
          } else {
            message.error(result.message || "Cập nhật thất bại");
          }
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra");
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    switch (order.status) {
      case "pending": return 0;
      case "accepted": return 1;
      case "checking": return 2;
      case "completed": return 3;
      case "rejected": return 4;
      default: return 0;
    }
  };

  if (loading) return <Spin tip="Đang tải..." className="min-h-screen flex justify-center items-center" />;
  if (!order) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy yêu cầu hoàn trả</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Chi tiết hoàn trả</h1>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={16} className="space-y-6">
          <Card title="Thông tin yêu cầu hoàn trả">
            <Steps current={getCurrentStep()} size="small" direction="horizontal" className="mb-6">
              {stepList.map((step, idx) => (
                <Step
                  key={step.key}
                  title={step.label}
                  status={
                    order.status === "rejected"
                      ? "error"
                      : idx < getCurrentStep()
                      ? "finish"
                      : idx === getCurrentStep()
                      ? "process"
                      : "wait"
                  }
                />
              ))}
            </Steps>
            <p><span className="font-semibold">Ngày yêu cầu: </span>{formatDate(order.createdAt)}</p>
            <p><span className="font-semibold">Lý do: </span>{order.reason}</p>
            <p><span className="font-semibold">Người yêu cầu: </span>{order.requestedBy?.name || "Không xác định"}</p>

            {order.images?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Ảnh minh họa sản phẩm lỗi</h3>
                <div className="flex gap-4 flex-wrap">
                  {order.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Ảnh lỗi ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-md border cursor-pointer"
                      onClick={() => window.open(img, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {(order.status === "pending" || order.status === "accepted" || order.status === "checking") && (
              <div className="flex gap-4 mt-4">
                <Button type="primary" onClick={handleAccept} loading={updating}>
                  {order.status === "accepted" ? "Chấp nhận hoàn trả" : "Tiếp nhận yêu cầu"}
                </Button>
                <Button danger onClick={handleReject} loading={updating}>
                  Từ chối
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Sản phẩm trả">
            <div className="mt-6 space-y-4">
              {order.items?.map((item) => (
                <div key={item._id || Math.random()} className="flex justify-between border-b pb-4 last:border-b-0">
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(item.total)}</p>
                    <p>{formatCurrency(item.price)}/cái</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Tổng đơn hàng">
            <div className="mt-6 space-y-2">
              <div className="flex justify-between"><span>Tạm tính</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><span>{formatCurrency(order.shippingFee)}</span></div>
              <div className="flex justify-between"><span>Thuế</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between font-bold text-blue-600 text-lg mt-2">
                <span>Tổng cộng</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card title="Nhân viên tiếp nhận">
            <Timeline>
              {order.statusHistory?.map((item, idx) => (
                <Timeline.Item key={idx} color="green" dot={<CheckCircleOutlined />}>
                  {item.updatedByName} - {item.status} ({formatDate(item.updatedAt)})
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReturnDetailPage;

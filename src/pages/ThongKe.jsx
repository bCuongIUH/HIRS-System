import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, Button } from "antd"; 
import dayjs from "dayjs";   
import * as XLSX from "xlsx";  // Import thư viện XLSX

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null);     

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/statistics", {
        params: {
          startDate: startDate ? startDate.format("YYYY-MM-DD") : undefined,
          endDate: endDate ? endDate.format("YYYY-MM-DD") : undefined,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = dayjs();
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchStats();
    }
  }, [startDate, endDate]);

  //xuất file excel
const exportToExcel = () => {
  // Lấy dữ liệu sản phẩm
  const productData = stats.topProducts.map((product) => ({
    Mã: product.ISSN,
    Tên: product.title,
    Số_Lượng: product.totalQuantity,
    Tổng_Tiền: `${product.totalRevenue.toLocaleString()} VNĐ`,
  }));

  // Lấy dữ liệu khách hàng
  const customerData = stats.topCustomers.map((customer) => ({
    Tên_Khách_Hàng: customer.name || "Ẩn danh",
    Email: customer.email,
    Số_Diện_Thoại: customer.phone || "Không có",
    Số_Đơn_Mua: customer.ordersCount,
    Tổng_Chi_Tiêu: `${customer.totalSpent.toLocaleString()} VNĐ`,
  }));

  // Thêm dòng tổng vào cuối dữ liệu sản phẩm
  const totalProductQuantity = stats.topProducts.reduce((sum, product) => sum + product.totalQuantity, 0);
  const totalProductRevenue = stats.topProducts.reduce((sum, product) => sum + product.totalRevenue, 0);

  productData.push({
    Tên: "Tổng",
    Mã: "",
    Số_Lượng: totalProductQuantity,
    Tổng_Tiền: `${totalProductRevenue.toLocaleString()} VNĐ`,
  });

  // Thêm dòng tổng vào cuối dữ liệu khách hàng
  const totalCustomerSpent = stats.topCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  customerData.push({
    Tên_Khách_Hàng: "Tổng",
    Email: "",
    Số_Diện_Thoại: "",
    Số_Đơn_Mua: stats.topCustomers.reduce((sum, customer) => sum + customer.ordersCount, 0),
    Tổng_Chi_Tiêu: `${totalCustomerSpent.toLocaleString()} VNĐ`,
  });

  // Tạo workbook
  const wb = XLSX.utils.book_new();

  // Tạo sheet cho sản phẩm
  const productSheet = XLSX.utils.json_to_sheet(productData, {
    header: ["Tên", "Mã", "Số_Lượng", "Tổng_Tiền"],
  });

  // Căn chỉnh cột tự động cho bảng sản phẩm
  const productSheetRange = XLSX.utils.decode_range(productSheet['!ref']);
  const colWidths = [];
  for (let col = productSheetRange.s.c; col <= productSheetRange.e.c; col++) {
    let maxLength = 0;
    for (let row = productSheetRange.s.r; row <= productSheetRange.e.r; row++) {
      const cell = productSheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.v) {
        maxLength = Math.max(maxLength, cell.v.toString().length);
      }
    }
    colWidths.push({ wpx: maxLength * 10 });
  }
  productSheet['!cols'] = colWidths;

  // Áp dụng màu vàng cho header của bảng sản phẩm
  for (let col = productSheetRange.s.c; col <= productSheetRange.e.c; col++) {
    const cell = productSheet[XLSX.utils.encode_cell({ r: 0, c: col })];
    if (cell) {
      cell.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { bgColor: { rgb: "FFD700" } } }; 
    }
  }

  // Thêm viền cho bảng sản phẩm
  for (let row = productSheetRange.s.r; row <= productSheetRange.e.r; row++) {
    for (let col = productSheetRange.s.c; col <= productSheetRange.e.c; col++) {
      const cell = productSheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell) {
        cell.s = { border: { top: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } };
      }
    }
  }

  // Tạo sheet cho khách hàng
  const customerSheet = XLSX.utils.json_to_sheet(customerData, {
    header: ["Tên_Khách_Hàng", "Email", "Số_Diện_Thoại", "Số_Đơn_Mua", "Tổng_Chi_Tiêu"],
  });

  // Căn chỉnh cột tự động cho bảng khách hàng
  const customerSheetRange = XLSX.utils.decode_range(customerSheet['!ref']);
  const customerColWidths = [];
  for (let col = customerSheetRange.s.c; col <= customerSheetRange.e.c; col++) {
    let maxLength = 0;
    for (let row = customerSheetRange.s.r; row <= customerSheetRange.e.r; row++) {
      const cell = customerSheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.v) {
        maxLength = Math.max(maxLength, cell.v.toString().length);
      }
    }
    customerColWidths.push({ wpx: maxLength * 10 }); // Điều chỉnh độ rộng cột
  }
  customerSheet['!cols'] = customerColWidths;

  // Áp dụng màu vàng cho header của bảng khách hàng
  for (let col = customerSheetRange.s.c; col <= customerSheetRange.e.c; col++) {
    const cell = customerSheet[XLSX.utils.encode_cell({ r: 0, c: col })];
    if (cell) {
      cell.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { bgColor: { rgb: "FFD700" } } }; // Màu vàng đậm
    }
  }

  // Thêm viền cho bảng khách hàng
  for (let row = customerSheetRange.s.r; row <= customerSheetRange.e.r; row++) {
    for (let col = customerSheetRange.s.c; col <= customerSheetRange.e.c; col++) {
      const cell = customerSheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell) {
        cell.s = { border: { top: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } };
      }
    }
  }

  // Thêm bảng sản phẩm và khách hàng vào workbook
  XLSX.utils.book_append_sheet(wb, productSheet, "Sản Phẩm");
  XLSX.utils.book_append_sheet(wb, customerSheet, "Khách Hàng");

  // Xuất file Excel
  XLSX.writeFile(wb, "Thong_Ke_Ban_Hang.xlsx");
};


  if (!stats && loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Đang tải dữ liệu thống kê...
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Không có dữ liệu thống kê
      </main>
    );
  }

  const booksData = stats.topProducts || [];
  const totalRevenue = stats.totalRevenue || 0;
  const totalSales = stats.totalBooksSold || 0;
  const totalCustomers = stats.totalCustomers || 0;
  const avgOrderValue = totalSales ? Math.round(totalRevenue / totalSales) : 0;
  const maxSales = Math.max(...(booksData.map((b) => b.totalQuantity) || [0]));
  const topCustomers = stats.topCustomers || [];

  const StatCard = ({ title, value, change, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 text-white`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs mt-3 opacity-75">{change}</p>
    </div>
  );

  const BarChart = ({ data, maxValue, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Sản Phẩm Bán Chạy Nhất</h3>
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.totalQuantity / maxValue) * 100;
          return (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.title}</span>
                <span className="text-sm font-bold text-gray-900">{item.totalQuantity} sp</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-full rounded-full transition-all ${color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">₫ {item.totalRevenue.toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.totalQuantity, 0);
    let startAngle = 0;
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỷ Lệ Bán Sản Phẩm</h3>
        <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto mb-4">
          {data.map((item, idx) => {
            const sliceAngle = (item.totalQuantity / total) * 360;
            const radius = 80;
            const x1 = 100 + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + radius * Math.cos(((startAngle + sliceAngle) * Math.PI) / 180);
            const y2 = 100 + radius * Math.sin(((startAngle + sliceAngle) * Math.PI) / 180);
            const largeArc = sliceAngle > 180 ? 1 : 0;
            const path = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            startAngle += sliceAngle;
            return <path key={idx} d={path} fill={colors[idx]} opacity="0.8" />;
          })}
        </svg>
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
                <span className="text-gray-700">{item.title}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {Math.round((item.totalQuantity / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CustomerTable = ({ data }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống Kê Khách Hàng</h3>
      <table className="w-full text-sm">
        <thead className="border-b border-gray-300">
          <tr className="text-gray-600 font-semibold">
            <th className="text-left py-3 px-4">Tên Khách Hàng</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Số Điện Thoại</th>
            <th className="text-center py-3 px-4">Số Đơn Mua</th>
            <th className="text-right py-3 px-4">Tổng Chi Tiêu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{customer.name || "Ẩn danh"}</td>
              <td className="py-3 px-4 text-gray-600">{customer.email}</td>
              <td className="py-3 px-4 text-gray-600">{customer.phone || "Không có"}</td>
              <td className="py-3 px-4 text-center text-gray-700">{customer.ordersCount}</td>
              <td className="py-3 px-4 text-right font-semibold text-gray-900">
                ₫ {customer.totalSpent.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-700 font-medium z-10">
          Đang tải dữ liệu...
        </div>
      )}

      <div className="max-w mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Thống Kê Bán Hàng</h1>
            <p className="text-gray-600 mt-2">Theo dõi doanh thu và hiệu suất bán sản phẩm</p>
          </div>

          {/* Bộ lọc ngày bên phải */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
            />
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày kết thúc"
            />
            <Button
              onClick={fetchStats}
              type="primary"
            >
              Lọc thống kê
            </Button>
           {/* Button to export data */}
 
          <Button onClick={exportToExcel} type="primary">
            Xuất Excel
          </Button>

          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Tổng Doanh Thu"
           value={`₫ ${totalRevenue.toLocaleString()}`}
            change="+12.5% so với kỳ trước"
            bgColor="bg-blue-600"
          />
          <StatCard
            title="Tổng Sản Phẩm Bán"
            value={totalSales}
            change="+8.3% so với kỳ trước"
            bgColor="bg-emerald-600"
          />
          <StatCard
            title="Tổng Khách Hàng"
            value={totalCustomers}
            change="+5.2% so với kỳ trước"
            bgColor="bg-orange-600"
          />
          <StatCard
            title="Giá Trung Bình"
            value={`₫ ${avgOrderValue.toLocaleString()}`}
            change="+3.1% so với kỳ trước"
            bgColor="bg-pink-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BarChart data={booksData} maxValue={maxSales} color="bg-blue-500" />
          </div>
          <div>
            <PieChart data={booksData} />
          </div>
        </div>

        {/* Bảng khách hàng */}
        <CustomerTable data={topCustomers} />
      </div>
    </main>
  );
}

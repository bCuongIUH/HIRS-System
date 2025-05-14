import { Users, Clock, Receipt, TrendingUp } from "lucide-react"
import Card from "../components/ui/Card"
import { BarChart } from "../components/charts/BarChart"
import { RecentActivity } from "../components/dashboard/RecentActivity"

function Dashboard() {
  // Dữ liệu cho biểu đồ
  const chartData = [
    { name: "Kỹ thuật", total: 42 },
    { name: "Marketing", total: 24 },
    { name: "Kinh doanh", total: 36 },
    { name: "Nhân sự", total: 18 },
    { name: "Tài chính", total: 22 },
    { name: "Sản xuất", total: 14 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Tổng quan về hệ thống quản lý nhân sự và tính lương của công ty.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng nhân viên</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-gray-500">+3 trong tháng này</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng giờ làm</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">24,360</div>
          <p className="text-xs text-gray-500">+2% so với tháng trước</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng lương</h3>
            <Receipt className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">2.4 tỷ</div>
          <p className="text-xs text-gray-500">+5% so với tháng trước</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Hiệu suất</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-gray-500">+1.2% so với tháng trước</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4" title="Tổng quan" description="Số lượng nhân viên theo phòng ban">
          <div className="h-80">
            <BarChart data={chartData} />
          </div>
        </Card>

        <Card className="lg:col-span-3" title="Hoạt động gần đây" description="Các hoạt động mới nhất trong hệ thống">
          <RecentActivity />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

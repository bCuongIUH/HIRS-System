import { Users, Clock, Receipt, TrendingUp } from "lucide-react"
import Card from "../components/ui/Card"
import { BarChart } from "../components/charts/BarChart"
import { RecentActivity } from "../components/dashboard/RecentActivity"
import { getEmployees } from "../utils/employeeApi"
import { getDepartments } from "../utils/departmentApi"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

function Dashboard() {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Tính số lượng nhân viên theo từng phòng ban từ employees API
const getEmployeeCountByDepartment = () => {
  const departmentCountMap = {}

  employees.forEach((emp) => {
    const deptName = emp.department?.name || "Không xác định"
    if (departmentCountMap[deptName]) {
      departmentCountMap[deptName] += 1
    } else {
      departmentCountMap[deptName] = 1
    }
  })

  // Trả về mảng để dùng cho biểu đồ
  return Object.entries(departmentCountMap).map(([name, total]) => ({
    name,
    total,
  }))
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Lấy danh sách nhân viên
        const employeesResponse = await getEmployees()
        setEmployees(employeesResponse.data)

        // Lấy danh sách phòng ban
        const departmentsResponse = await getDepartments()
        setDepartments(departmentsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Tổng số nhân viên
  const totalEmployees = employees.length

  // Dữ liệu biểu đồ theo phòng ban
  const chartData = getEmployeeCountByDepartment()
console.log(chartData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Tổng quan về hệ thống quản lý bán sách trực tuyến.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng nhân viên</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-gray-500">+{totalEmployees > 0 ? 3 : 0} trong tháng này</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng sản phẩm</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">24,360</div>
          <p className="text-xs text-gray-500">+2% so với tháng trước</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tổng doanh thu</h3>
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

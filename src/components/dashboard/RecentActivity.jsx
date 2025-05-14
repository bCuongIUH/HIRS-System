import Avatar from '../ui/Avatar';

const activities = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg",
      initials: "NA",
    },
    action: "đã tạo bảng lương tháng 5/2023",
    timestamp: "2 giờ trước",
  },
  {
    id: 2,
    user: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg",
      initials: "TB",
    },
    action: "đã thêm nhân viên mới",
    timestamp: "3 giờ trước",
  },
  {
    id: 3,
    user: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg",
      initials: "LC",
    },
    action: "đã cập nhật thông tin nhân viên",
    timestamp: "5 giờ trước",
  },
  {
    id: 4,
    user: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg",
      initials: "PD",
    },
    action: "đã phê duyệt đơn nghỉ phép",
    timestamp: "1 ngày trước",
  },
  {
    id: 5,
    user: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg",
      initials: "HE",
    },
    action: "đã cập nhật bảng chấm công",
    timestamp: "1 ngày trước",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar 
            src={activity.user.avatar} 
            alt={activity.user.name} 
            initials={activity.user.initials}
            size="sm"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}
            </p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

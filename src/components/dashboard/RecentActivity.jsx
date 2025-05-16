"use client"

import { useState, useEffect } from "react"
import Avatar from "../ui/Avatar"
import { getRecentTransactions } from "../../utils/transactionApi"

export function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const response = await getRecentTransactions()
        setActivities(response.data)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "Vừa xong"
    if (diffMin < 60) return `${diffMin} phút trước`
    if (diffHour < 24) return `${diffHour} giờ trước`
    if (diffDay < 7) return `${diffDay} ngày trước`

    return date.toLocaleDateString("vi-VN")
  }

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>
  }

  if (activities.length === 0) {
    return <div className="text-center py-4 text-gray-500">Không có hoạt động gần đây</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-center gap-4">
          <Avatar
            src={activity.user?.avatar}
            alt={activity.user?.name || "User"}
            initials={(activity.user?.name || "U").charAt(0)}
            size="sm"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user?.name || "Người dùng"}</span> {activity.description}
            </p>
            <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

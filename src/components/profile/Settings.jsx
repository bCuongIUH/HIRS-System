import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Settings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!")
      return
    }
    // Call API to change password
    alert("Mật khẩu đã được thay đổi thành công!")
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Cài đặt</h2>
      <div className="mt-4">
        <div className="mb-2">
          <label className="block text-sm">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  )
}

export default Settings

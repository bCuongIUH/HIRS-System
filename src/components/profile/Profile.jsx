import { useState } from "react"
import { Modal, Input, Button, message } from "antd"
import { useNavigate } from "react-router-dom"
import axios from "axios" 

function Profile() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "")
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)  
  const navigate = useNavigate()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!")
      return
    }

    if (newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }

    try {
      // Gửi yêu cầu API để thay đổi mật khẩu
      const token = localStorage.getItem("token") // Assuming the token is stored in localStorage
      const response = await axios.post(
        "http://localhost:5000/api/auth/updatepassword", 
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        }
      )

      // Xử lý phản hồi thành công
      message.success("Mật khẩu đã được thay đổi thành công!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsModalVisible(false)  // Close the modal after successful password change

    } catch (error) {
      // Xử lý lỗi từ API
      message.error(error.response?.data?.message || "Đã có lỗi xảy ra!")
    }
  }

  const showModal = () => {
    setIsModalVisible(true)  // Show the modal when "Change Password" is clicked
  }

  const handleCancel = () => {
    setIsModalVisible(false)  // Close the modal when cancel is clicked
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Thông tin người dùng</h2>

      {/* Displaying profile information in read-only mode */}
      <div className="mt-4">
        <div className="mb-2">
          <label className="block text-sm">Tên người dùng</label>
          <div className="p-2 border rounded-md">{userName}</div>  {/* Read-only */}
        </div>
        <div className="mb-2">
          <label className="block text-sm">Email</label>
          <div className="p-2 border rounded-md">{userEmail}</div>  {/* Read-only */}
        </div>
      </div>

      {/* Button to open the modal */}
      <Button
        type="default"
        onClick={showModal}
        className="mt-4"
      >
        Đổi mật khẩu
      </Button>

      {/* Modal for password change */}
      <Modal
        title="Đổi mật khẩu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleChangePassword}>
            Đổi mật khẩu
          </Button>
        ]}
      >
        <div className="mt-4">
          <div className="mb-2">
            <label className="block text-sm">Mật khẩu hiện tại</label>
            <Input.Password
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Mật khẩu mới</label>
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Xác nhận mật khẩu mới</label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile

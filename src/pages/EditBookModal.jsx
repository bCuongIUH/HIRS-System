import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, message, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const EditBookModal = ({ isOpen, onClose, book, onBookUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ISSN: "",
    category: "",
    price: 0,
    publishYear: "",
    pages: "",
    volume: "",
    description: "",
    coverImage: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Lấy danh sách category
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Lỗi khi tải thể loại:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Khi mở modal chỉnh sửa
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        ISSN: book.ISSN || "",
        category: book.category?._id || book.category || "",
        price: book.price || 0,
        publishYear: book.publishYear || "",
        pages: book.pages || "",
        volume: book.volume || "",
        description: book.description || "",
        coverImage: book.coverImage || "",
      });
      setNewImage(null);
    }
  }, [book]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (value) => {
    setFormData({ ...formData, price: value || 0 });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("ISSN", formData.ISSN);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("publishYear", formData.publishYear);
      data.append("pages", formData.pages);
      data.append("volume", formData.volume);
      data.append("description", formData.description);
      if (newImage) data.append("coverImage", newImage);

      // Debug FormData
      for (let pair of data.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      const res = await axios.patch(
        `http://localhost:5000/api/books/${book._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        message.success("Cập nhật sách thành công!");
        onBookUpdated();
        onClose();
      } else {
        message.error(res.data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi FormData:", err);
      message.error("Có lỗi khi cập nhật sách!");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      title="✏️ Chỉnh sửa thông tin sách"
      okText="Lưu thay đổi"
      cancelText="Hủy"
      centered
    >
      <div className="flex flex-col gap-3">
        <label>
          Tên sách:
          <Input name="title" value={formData.title} onChange={handleChange} />
        </label>

        <label>
          Tác giả:
          <Input name="author" value={formData.author} onChange={handleChange} />
        </label>

        <label>
          ISBN:
          <Input
            name="ISSN"
            value={formData.ISSN}
            disabled
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </label>

        <label>
          Thể loại:
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            style={{ width: "100%" }}
          >
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </label>

        <label>
          Giá:
          <InputNumber
            value={formData.price}
            onChange={handlePriceChange}
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/,/g, "")}
          />
        </label>

        <label>
          Năm xuất bản:
          <Input
            name="publishYear"
            value={formData.publishYear}
            onChange={handleChange}
          />
        </label>

        <label>
          Số trang:
          <Input name="pages" value={formData.pages} onChange={handleChange} />
        </label>

        <label>
          Tập sách:
          <Input
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            placeholder="VD: Tập 1, Quyển 2..."
          />
        </label>

        <label>
          Mô tả:
          <Input.TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Ảnh bìa:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {!newImage && formData.coverImage && (
          <div className="mt-2">
            <p className="text-gray-600 text-sm mb-1">Ảnh hiện tại:</p>
            <img
              src={formData.coverImage}
              alt="cover"
              className="w-24 h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditBookModal;

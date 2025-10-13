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
    setFormData({ ...formData, category: value }); // chỉ gửi _id
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
      data.append("category", formData.category); // _id
      data.append("price", formData.price);
      data.append("publishYear", formData.publishYear);
      data.append("pages", formData.pages);
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
          ISSN:
          <Input name="ISSN" value={formData.ISSN} onChange={handleChange} />
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
          />
        </label>
        <label>
          Năm sản xuất:
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

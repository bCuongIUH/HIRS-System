import { useState, useEffect } from "react";

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    ISSN: "",
    category: "",
    price: "",
    publishYear: "",
    pages: "",
    description: "",
    coverImage: null,
     volume: "",
  });

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Lỗi khi tải thể loại:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setMessage(null);

  try {
    const formDataToSend = new FormData();

    // 🧩 Đảm bảo gửi tất cả field, kể cả volume rỗng
    Object.keys(formData).forEach((key) => {
      if (key === "volume") {
        formDataToSend.append("volume", formData.volume || "");
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    const res = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();

    if (data.success) {
      setMessage({ type: "success", text: "Thêm sách thành công!" });
      onBookAdded();
      setTimeout(() => onClose(), 1000);
    } else {
      setMessage({ type: "error", text: data.message || "Lỗi khi thêm sách!" });
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi FormData:", error);
    setMessage({ type: "error", text: "Lỗi khi thêm sách!" });
  } finally {
    setIsSubmitting(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          📚 Thêm Sách Mới
        </h2>

        {message && (
          <div
            className={`p-3 mb-4 text-center rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + Author */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Tên sách *"
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Tác giả *"
              className="border p-2 rounded-lg"
              required
            />
          </div>

          {/* ISSN + Category */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="ISSN"
              value={formData.ISSN}
              onChange={handleInputChange}
              placeholder="ISBN *"
              className="border p-2 rounded-lg"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-lg"
            >
              <option value="">-- Chọn thể loại --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
               {/* Volume (Tập sách) */}
            <div className="grid grid-cols-2 gap-4">
              <select
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="border p-2 rounded-lg"
              >
                <option value="">Không có tập</option>
                {[...Array(50)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tập {i + 1}
                  </option>
                ))}
              </select>
            </div>

          {/* Price + Year + Pages */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Giá (VNĐ)"
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleInputChange}
              placeholder="Năm xuất bản"
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              placeholder="Số trang"
              className="border p-2 rounded-lg"
              required
            />
          </div>
             
          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả..."
            rows="3"
            className="border p-2 w-full rounded-lg"
          ></textarea>

          {/* Image */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 w-full rounded-lg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-48 object-cover rounded-lg mt-3 mx-auto"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm Sách"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

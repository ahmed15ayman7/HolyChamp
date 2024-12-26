// /app/submit-content/page.tsx
"use client"
import { useState } from "react";

const SubmitContentPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "article", // Default type is article
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the submission logic (e.g., API call to backend)
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-[#FAF3E0] rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-[#1E3A8A] text-center mb-6">
        صفحة سموط المعارف
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">عنوان المقال/البحث</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">المحتوى</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={6}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">نوع المحتوى</label>
          <select
            name="type"
            value={formData.type}
            // onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="article">مقالة</option>
            <option value="research">بحث</option>
          </select>
        </div>

        <button type="submit" className="py-2 px-4 bg-[#FFD700] text-[#1E3A8A] rounded-md">
          إرسال المحتوى
        </button>
      </form>
    </div>
  );
};

export default SubmitContentPage;

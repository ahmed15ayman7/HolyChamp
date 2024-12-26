// /app/admin/review/page.tsx
"use client";

import { useState } from "react";

const AdminReviewPage = () => {
  const [submittedContent, setSubmittedContent] = useState([
    { id: 1, title: "مقالة عن التطوع", status: "pending" },
    { id: 2, title: "بحث عن التنمية البشرية", status: "pending" },
  ]);

  const handleApproval = (id: number) => {
    console.log(`Approved content with ID: ${id}`);
    // Optionally, you can update the status in state after approval
    setSubmittedContent((prevContent) =>
      prevContent.map((content) =>
        content.id === id ? { ...content, status: "approved" } : content
      )
    );
  };

  const handleRejection = (id: number) => {
    console.log(`Rejected content with ID: ${id}`);
    // Optionally, you can update the status in state after rejection
    setSubmittedContent((prevContent) =>
      prevContent.map((content) =>
        content.id === id ? { ...content, status: "rejected" } : content
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-[#FAF3E0] rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-[#1E3A8A] text-center mb-6">مراجعة المحتوى المقدم</h1>
      <div>
        {submittedContent.map((content) => (
          <div key={content.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold text-[#1E3A8A]">{content.title}</h3>
            <p>Status: {content.status}</p>
            <div className="mt-4">
              <button
                onClick={() => handleApproval(content.id)}
                className="py-2 px-4 bg-[#28A745] text-white rounded-md"
              >
                اعتماد
              </button>
              <button
                onClick={() => handleRejection(content.id)}
                className="py-2 px-4 bg-[#DC3545] text-white rounded-md ml-4"
              >
                رفض
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewPage;

import { useState } from "react";

function ArticleList({ articles }: { articles: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // لمعرفة المقال المفتوح

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Articles Section */}
      <div className="grid gap-6">
        {articles.map((article: any, index: number) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#a5960a]">
              {article.title}
            </h3>

            {/* Metadata (createdAt, author, userName) */}
            <div className="text-sm text-[#6B7280] mt-2">
              <p>بقلم: <span className="text-[#4A4A4A] font-medium">{article.author || article.user.name}</span></p>
              <p>تاريخ النشر: <span className="text-[#4A4A4A]">{new Date(article.createdAt).toLocaleDateString("ar-EG")}</span></p>
            </div>

            {expandedIndex === index ? (
              // عرض النص الكامل للمقال
              <div
                className="text-sm text-[#4A4A4A] mt-3 overflow-hidden transition-all duration-500 ease-in-out"
              >
                {article.content}
                <button
                  className="text-[#1D4ED8] mt-4 block"
                  onClick={() => toggleExpand(index)}
                >
                  إغلاق
                </button>
              </div>
            ) : (
              // عرض الملخص فقط
              <div className="text-sm text-[#4A4A4A] mt-3 transition-all duration-500 ease-in-out">
                {article.summary}
                <button
                  className="text-[#1D4ED8] mt-4 block"
                  onClick={() => toggleExpand(index)}
                >
                  قراءة المزيد
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;

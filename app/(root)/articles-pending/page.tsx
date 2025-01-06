"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import { toast } from "react-toastify";
import ArticleList from "@/components/shared/ArticleList";
const ArticlesPendingPage = () => {
  const [userData, setUserData] = useState<User>();

  const [pendingArticlesMen, setPendingArticlesMen] = useState([]);
  const [pendingArticlesWomen, setPendingArticlesWomen] = useState([]);

  let getUser = async () => {
    let user = await getUserData();
    setUserData(user);
  };
  const handleApproval = async (
    articleId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await axios.put(`/api/articles`, { id: articleId, status });
      toast.success(
        `تم ${status === "approved" ? "الموافقة على" : "رفض"} المقال بنجاح.`
      );
      // تحديث البيانات بعد العملية
      const updatedMen = pendingArticlesMen.filter(
        (article: any) => article.id !== articleId
      );
      const updatedWomen = pendingArticlesWomen.filter(
        (article: any) => article.id !== articleId
      );
      setPendingArticlesMen(updatedMen);
      setPendingArticlesWomen(updatedWomen);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المقال:" + error);
    }
  };

  const handleDelete = async (articleId: string) => {
    try {
      await axios.delete(`/api/articles?id=${articleId}`);
      toast.success("تم حذف المقال بنجاح.");
      // تحديث البيانات بعد الحذف
      const updatedMen = pendingArticlesMen.filter(
        (article: any) => article.id !== articleId
      );
      const updatedWomen = pendingArticlesWomen.filter(
        (article: any) => article.id !== articleId
      );
      setPendingArticlesMen(updatedMen);
      setPendingArticlesWomen(updatedWomen);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المقال:" + error);
      console.error("حدث خطأ أثناء حذف المقال:", error);
    }
  };

  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        // Fetch pending articles for men
        const menResponse = await axios.get(
          "/api/articles?status=pending&gender=male"
        );
        setPendingArticlesMen(menResponse.data);
        // Fetch pending articles for women
        const womenResponse = await axios.get(
          "/api/articles?status=pending&gender=female"
        );
        setPendingArticlesWomen(womenResponse.data);
      } catch (error) {
        console.error("Failed to fetch pending articles:", error);
      }
    };

    fetchPendingArticles();
    getUser();
  }, []);

  return (
    <div className="max-w-full p-6 bg-[#fff] rounded-lg shadow-xl">
      {/* Pending Articles */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] text-center my-6">
          المقالات المعلقة
        </h2>
        <div className="space-y-8">
          {/* Men's Pending Articles */}
          <div>
            <h3 className="text-2xl font-bold text-[#a5960a]">مقالات الرجال</h3>
            {pendingArticlesMen.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {pendingArticlesMen.map((article: any) => (
                  <li
                    key={article.id}
                    className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xl font-bold">{article.title}</h4>
                      <div className="text-sm text-[#6B7280] mt-2">
              <p>بقلم: <span className="text-[#4A4A4A] font-medium">{article.author || article.user.name}</span></p>
              <p>تاريخ النشر: <span className="text-[#4A4A4A]">{new Date(article.createdAt).toLocaleDateString("ar-EG")}</span></p>
            </div>
                      <p className="text-sm text-gray-600"><strong>الملخص</strong>{article.summary}</p>

                    </div>
                    <div
                className="text-sm text-[#4A4A4A] mt-3 overflow-hidden transition-all duration-500 ease-in-out"
              >
               <strong>المقال</strong> {article.content}
              </div>
                    <div className="flex gap-4">
                      <button
                        className="bg-[#28A745] text-white py-2 px-4 rounded hover:bg-[#218838]"
                        onClick={() => handleApproval(article.id, "approved")}
                      >
                        موافقة
                      </button>
                      {/* <button
                        className="bg-[#FF5733] text-white py-2 px-4 rounded hover:bg-[#C0392B]"
                        onClick={() => handleApproval(article.id, "rejected")}
                      >
                        رفض
                      </button> */}
                      <button
                        className="bg-[#FF0000] text-white py-2 px-4 rounded hover:bg-[#CC0000]"
                        onClick={() => handleDelete(article.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-600">لا توجد مقالات معلقة للرجال.</p>
            )}
          </div>

          {/* Women's Pending Articles */}
          <div>
            <h3 className="text-2xl font-bold text-[#a5960a]">مقالات النساء</h3>
            {pendingArticlesWomen.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {pendingArticlesWomen.map((article: any) => (
                  <li
                    key={article.id}
                    className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xl font-bold">{article.title}</h4>
                      <div className="text-sm text-[#6B7280] mt-2">
              <p>بقلم: <span className="text-[#4A4A4A] font-medium">{article.author || article.user.name}</span></p>
              <p>تاريخ النشر: <span className="text-[#4A4A4A]">{new Date(article.createdAt).toLocaleDateString("ar-EG")}</span></p>
            </div>
                      <p className="text-sm text-gray-600"><strong>الملخص</strong>{article.summary}</p>
                    </div>
                    <div
                className="text-sm text-[#4A4A4A] mt-3 overflow-hidden transition-all duration-500 ease-in-out"
              >
                <strong>المقال</strong>{article.content}
          
              </div>
                    <div className="flex gap-4">
                      <button
                        className="bg-[#28A745] text-white py-2 px-4 rounded hover:bg-[#218838]"
                        onClick={() => handleApproval(article.id, "approved")}
                      >
                        موافقة
                      </button>
                      {/* <button
                        className="bg-[#FF5733] text-white py-2 px-4 rounded hover:bg-[#C0392B]"
                        onClick={() => handleApproval(article.id, "rejected")}
                      >
                        رفض
                      </button> */}
                      <button
                        className="bg-[#FF0000] text-white py-2 px-4 rounded hover:bg-[#CC0000]"
                        onClick={() => handleDelete(article.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-600">لا توجد مقالات معلقة للنساء.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticlesPendingPage;

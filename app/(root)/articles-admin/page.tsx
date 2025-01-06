"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import { toast } from "react-toastify";
import ArticleList from "@/components/shared/ArticleList";
export default function ArticlesPage() {
  const [userData, setUserData] = useState<User>();
  const [doneArticlesMen, setDoneArticlesMen] = useState([]);
  const [doneArticlesWomen, setDoneArticlesWomen] = useState([]);

  let getUser = async () => {
    let user = await getUserData();
    setUserData(user);
  };

  const handleDelete = async (articleId: string) => {
    try {
      await axios.delete(`/api/articles?id=${articleId}`);
      toast.success("تم حذف المقال بنجاح.");
      const updatedMend = doneArticlesMen.filter(
        (article: any) => article.id !== articleId
      );
      const updatedWomend = doneArticlesWomen.filter(
        (article: any) => article.id !== articleId
      );
      setDoneArticlesMen(updatedMend);
      setDoneArticlesWomen(updatedWomend);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المقال:" + error);
      console.error("حدث خطأ أثناء حذف المقال:", error);
    }
  };

  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        const menResponsed = await axios.get(
          "/api/articles?status=approved&gender=male"
        );
        setDoneArticlesMen(menResponsed.data);

        const womenResponsed = await axios.get(
          "/api/articles?status=approved&gender=female"
        );
        setDoneArticlesWomen(womenResponsed.data);
      } catch (error) {
        console.error("Failed to fetch pending articles:", error);
      }
    };

    fetchPendingArticles();
    getUser();
  }, []);

  return (
    <div className="max-w-full p-6 bg-[#fff] rounded-lg shadow-xl">
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] text-center my-6">
          المقالات
        </h2>
        <div className="space-y-8">
          {/* Men's done Articles */}
          <div>
            <h3 className="text-2xl font-bold text-[#a5960a]">مقالات الرجال</h3>
            {doneArticlesMen.length > 0 ? (
                      <ArticleList articles={doneArticlesMen}/>
            ) : (
              <p className="mt-4 text-gray-600">لا توجد مقالات للرجال.</p>
            )}
          </div>

          {/* Women's done Articles */}
          <div>
            <h3 className="text-2xl font-bold text-[#a5960a]">مقالات النساء</h3>
            {doneArticlesWomen.length > 0 ? (
                     <ArticleList articles={doneArticlesWomen}/>
            ) : (
              <p className="mt-4 text-gray-600">لا توجد مقالات للنساء.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import AuthRegister from "@/app/(auth)/auth/AuthRegister";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import { toast } from "react-toastify";
import UsersList from "@/components/shared/UserTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
const AdminPage = () => {
  const [userData, setUserData] = useState<User>();
  const [doneArticlesMen, setDoneArticlesMen] = useState([]);
  const [doneArticlesWomen, setDoneArticlesWomen] = useState([]);
  const [pendingArticlesMen, setPendingArticlesMen] = useState([]);
  const [pendingArticlesWomen, setPendingArticlesWomen] = useState([]);
  const [open, setOpen] = useState(false);
  const [isFe, setIsFe] = useState(0);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  }, [isFe]);

  return (
    <div className="max-w-full p-6 bg-[#FAF3E0] rounded-lg shadow-xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#a5960a] leading-tight">
          صفحة الإدارة
        </h1>
        <p className="mt-3 text-lg text-[#4A4A4A] max-w-2xl mx-auto">
          إدارة بيانات المشتركين والمحتوى.
        </p>
      </header>
      <UsersList />
      <div>
        <Button
          variant="contained"
          className=" bg-[#a5960a] text-[#ffffff]  hover:bg-[#cec258] "
          onClick={handleOpen}
        >
          إضافة مشترك جديد
        </Button>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <h2 className="text-2xl font-semibold text-[#a5960a]">
              إضافة مشترك جديد
            </h2>
          </DialogTitle>

          <DialogContent>
            <AuthRegister isManage setIsFe={setIsFe} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              إلغاء
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Task Management (Pause Counters, Reset Missed Pages) */}
      {/* Add functionality to pause counters and reset missed pages */}
      {/* <section className="my-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] mb-6">
          إدارة المهام
        </h2>
        <button className="w-full bg-[#FF5733] text-white py-3 rounded-lg hover:bg-[#C0392B] transition-all duration-300">
          إيقاف العداد
        </button>
        <button className="w-full bg-[#FF5733] text-white py-3 rounded-lg hover:bg-[#C0392B] transition-all duration-300 mt-4">
          حذف الفوائت
        </button>
      </section> */}

      {/* Content Approval Section */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] mb-6">
          موافقة على المقالات
        </h2>
        <button className="w-full bg-[#FFD700] text-[#a5960a] py-3 rounded-lg hover:bg-[#FFB600] transition-all duration-300">
          نشر المقالات
        </button>
      </section> */}

      {/* WhatsApp Group Messaging */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] mb-6">
          رسائل المجموعة
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-[#a5960a]">
              مجموعة الرجال
            </h3>
            <textarea
              className="w-full p-4 rounded-lg border border-[#a5960a]"
              placeholder="أسماء الرجال مع الفوائت"
              rows={6}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#a5960a]">
              مجموعة النساء
            </h3>
            <textarea
              className="w-full p-4 rounded-lg border border-[#a5960a]"
              placeholder="أسماء النساء مع الفوائت"
              rows={6}
            />
          </div>
        </div>
      </section> */}
     
      {/* Database Management */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] mb-6">
          إدارة قاعدة البيانات
        </h2>
        <button className="w-full bg-[#FF5733] text-white py-3 rounded-lg hover:bg-[#C0392B] transition-all duration-300">
          حذف البيانات
        </button>
        <button className="w-full bg-[#28A745] text-white py-3 rounded-lg hover:bg-[#218838] transition-all duration-300 mt-4">
          تصدير البيانات
        </button>
      </section> */}

      {/* Editable Reports Section */}
      {/* <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#a5960a] mb-6">
          تعديل التقارير القرائية
        </h2>
        <button className="w-full bg-[#a5960a] text-white py-3 rounded-lg hover:bg-[#1A3163] transition-all duration-300">
          تعديل التقارير
        </button>
      </section> */}
    </div>
  );
};

export default AdminPage;

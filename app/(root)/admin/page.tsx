"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AuthRegister from "@/app/(auth)/auth/AuthRegister";
import UsersList from "@/components/shared/UserTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { FaFilePdf, FaFileAlt, FaUserPlus } from "react-icons/fa";

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [isFe, setIsFe] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExport = async (gender: string, format: string,isCompletedBooks:boolean) => {
    const toastId = toast.loading("جاري التصدير ...");

    try {
      const response = await axios.get(`/api/${isCompletedBooks ? "completed-books" : "readers"}?gender=${gender}&format=${format}`, {
        responseType: format === "pdf" ? "blob" : "json",
      });

      if (response.status === 200) {
        if (format === "pdf") {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `readers_${gender}.${format}`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        }

        toast.update(toastId, {
          render: "تم تصدير البيانات بنجاح!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: "حدث خطأ أثناء التصدير!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

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

      {/* قائمة المستخدمين */}
      <UsersList isFe={isFe} />

      {/* أزرار التصدير */}
      <div className="mt-6 flex flex-wrap  gap-4">
        <Button
          variant="contained"
          className="bg-[#a5960a] text-white hover:bg-[#cec258] flex items-center gap-2"
          onClick={handleOpen}
        >
          <FaUserPlus size={18} />
          إضافة مشترك جديد
        </Button>
        </div>
      <div className="mt-6 flex  flex-wrap justify-center  gap-20">
        <div className="justify-center">
        <h2 className="text-2xl font-semibold text-center  text-[#a5960a]">
            تصدير بيانات المشتركين
          </h2>
        {/* أزرار تصدير البيانات */}
        <div className="flex flex-col items-center ">
          <h3 className="text-lg font-semibold text-gray-700">تصدير الذكور:</h3>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              className="border-[#a5960a] text-[#a5960a] hover:bg-[#a5960a] hover:text-white flex  gap-2"
              onClick={() => handleExport("male", "json",false)}
            >
              <FaFileAlt size={18} />
              JSON
            </Button>
            <Button
              variant="outlined"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex  gap-2"
              onClick={() => handleExport("male", "pdf",false)}
            >
              <FaFilePdf size={18} />
              PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center ">
          <h3 className="text-lg font-semibold text-gray-700">تصدير الإناث:</h3>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              className="border-[#a5960a] text-[#a5960a] hover:bg-[#a5960a] hover:text-white flex  gap-2"
              onClick={() => handleExport("female", "json",false)}
            >
              <FaFileAlt size={18} />
              JSON
            </Button>
            <Button
              variant="outlined"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex  gap-2"
              onClick={() => handleExport("female", "pdf",false)}
            >
              <FaFilePdf size={18} />
              PDF
            </Button>
          </div>
        </div>
        </div>
        <div className="justify-center">
        <h2 className="text-2xl font-semibold text-center  text-[#a5960a]">
            تصدير الكتب المختومه للمشتركين
          </h2>
        {/* أزرار تصدير البيانات */}

        <div className="flex flex-col items-center ">
          <h3 className="text-lg font-semibold text-gray-700">تصدير الذكور:</h3>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              className="border-[#a5960a] text-[#a5960a] hover:bg-[#a5960a] hover:text-white flex  gap-2"
              onClick={() => handleExport("male", "json",true)}
            >
              <FaFileAlt size={18} />
              JSON
            </Button>
            <Button
              variant="outlined"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex  gap-2"
              onClick={() => handleExport("male", "pdf",true)}
            >
              <FaFilePdf size={18} />
              PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center ">
          <h3 className="text-lg font-semibold text-gray-700">تصدير الإناث:</h3>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              className="border-[#a5960a] text-[#a5960a] hover:bg-[#a5960a] hover:text-white flex  gap-2"
              onClick={() => handleExport("female", "json",true)}
            >
              <FaFileAlt size={18} />
              JSON
            </Button>
            <Button
              variant="outlined"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex  gap-2"
              onClick={() => handleExport("female", "pdf",true)}
            >
              <FaFilePdf size={18} />
              PDF
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* نافذة إضافة مشترك */}
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
  );
};

export default AdminPage;

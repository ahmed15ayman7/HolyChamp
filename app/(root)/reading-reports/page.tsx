"use client";

import { useState } from "react";
import ReportForm from "./ReportForm";
import ReportTable from "./ReportTable";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ReadingReportsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFe, setIsFe] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    const toastId = toast.loading("جاري حذف جميع التقارير...");
    try {
      //change the endpoint to delete all reports
      await axios.delete("/api/daily-reports/all__");
      toast.update(toastId, {
        render: "تم حذف جميع التقارير بنجاح!",
        autoClose: 3000,
        isLoading: false,
        type: "success",
      });
      setIsFe(Math.random());
    } catch (error) {
      console.error("خطأ في حذف جميع التقارير:", error);
      toast.update(toastId, {
        autoClose: 3000,
        isLoading: false,
        type: "error",
        render: "فشل في حذف جميع التقارير!",
      });
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="max-w-full p-6 bg-[#ffffff] rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-[#a5960a] text-center mb-6">
        صفحة التقارير القرائية
      </h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleOpenForm}
          className="py-2 px-4 bg-[#a5960a] text-[#ffffff] rounded-md hover:bg-[#cec258]"
        >
          إضافة تقرير قرائي جديد
        </button>
        <button
          onClick={handleOpenDialog}
          className="py-2 px-4 bg-red-600 text-[#ffffff] rounded-md hover:bg-red-800"
        >
          حذف جميع التقارير
        </button>
      </div>

      {/* Show Form if Opened */}
      {isFormOpen && (
        <ReportForm closeForm={handleCloseForm} setIsFe={setIsFe} />
      )}

      {/* Table to display reports */}
      <ReportTable isFe={isFe} setIsFe={setIsFe} />

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <p>هل أنت متأكد أنك تريد حذف جميع التقارير؟</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            نعم، احذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReadingReportsPage;

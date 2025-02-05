"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

interface User {
  id: number;
  name: string;
  gender: string;
  totalPagesRead: number;
  finishedBooks: number;
  missedPages: number;
  excuse: string| null|undefined;
  excuseStartDate?: string;
  excuseEndDate?: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [excuse, setExcuse] = useState<string | null>(null);
  const [excuseStartDate, setExcuseStartDate] = useState<Date | null>(null);
  const [excuseEndDate, setExcuseEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user?gender=female");
        console.log("Fetched data:", response.data);
        const femaleUsers = response.data
        setUsers(femaleUsers.map((user:any) => ({
          id: user.id,
          name: user.name,
          gender: user.gender,
          missedPages: user.missedPages,
          excuse: user.excuse || undefined,
          excuseStartDate: user.excuseStartDate || undefined,
          excuseEndDate: user.excuseEndDate || undefined,
          totalPagesRead: user.DailyReport.reduce((sum:number, report:any) => sum + report.totalPagesRead, 0),
          finishedBooks: user.DailyReport.reduce((sum:number, report:any) => sum + report.finishedBooks, 0),
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setExcuse(user.excuse || null);
    setExcuseStartDate(
      user.excuseStartDate ? new Date(user.excuseStartDate) : null
    );
    setExcuseEndDate(user.excuseEndDate ? new Date(user.excuseEndDate) : null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setExcuse(null);
    setExcuseStartDate(null);
    setExcuseEndDate(null);
  };

  const handleSaveExcuse = async () => {
    if (!selectedUser) return;

    try {
      //api for  user excuse
      const res = await axios.put(`/api/user`, {
        excuse,
        id:selectedUser.id,
        excuseStartDate,
        excuseEndDate,
      });
      if (res.status==200){ toast.success("تم حفظ العذر بنجاح!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  excuse,
                  excuseStartDate: excuseStartDate ? excuseStartDate.toISOString().split('T')[0] : undefined,
                  excuseEndDate: excuseEndDate ? excuseEndDate.toISOString().split('T')[0] : undefined
                }
              : user
          )
        );
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error saving excuse:", error);
      toast.error("فشل في حفظ العذر!");
    }
  };

  const handleCancelExcuse = async (user: User) => {
    try {
      //api for  user excuse
      const res = await axios.put(`/api/user`, {
        excuse:undefined,
        id:user.id,
        excuseStartDate: null,
        excuseEndDate: null,
      });
      if (res.status==200){ toast.success("تم إلغاء العذر بنجاح!");
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  excuse: "",
                  excuseStartDate: undefined,
                  excuseEndDate: undefined
                }
              : u
          )
        );
      }
    } catch (error) {
      console.error("Error canceling excuse:", error);
      toast.error("فشل في إلغاء العذر!");
    }
  };

  return (
    <div className="max-w-full p-6 bg-[#ffffff] rounded-lg shadow-lg overflow-hidden">
      <h1 className="text-3xl font-semibold text-[#a5960a] text-center mb-6">
        بيانات القراء الإناث
      </h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-[#a5960a] text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">اسم القارئة</th>
            <th className="px-4 py-2 border border-gray-300">
              عدد الصفحات المقروءة
            </th>
            <th className="px-4 py-2 border border-gray-300">
              عدد الكتب المنجزة
            </th>
            <th className="px-4 py-2 border border-gray-300">عدد الفوائت</th>
            <th className="px-4 py-2 border border-gray-300">العذر</th>
            <th className="px-4 py-2 border border-gray-300">إدخال/إلغاء عذر</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.name}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.totalPagesRead}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.finishedBooks}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.missedPages}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.excuse}
              </td>
              <td className="px-4 py-2 border border-gray-300 flex gap-4 justify-center">
               
              {user?.excuse &&user?.excuse?.length>0 ? <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancelExcuse(user)}
                >
                  إلغاء العذر
                </Button>:<Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(user)}
                >
                  إدخال عذر
                </Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>إدخال عذر</DialogTitle>
        <DialogContent className="p-20">
          <TextField
            label="العذر"
            value={excuse}
            onChange={(e) => setExcuse(e.target.value)}
            fullWidth
            margin="normal"
          />
          <div className="flex pt-10 gap-5">

          <DatePicker
            selected={excuseStartDate}
            onChange={(date) => setExcuseStartDate(date)}
            dateFormat="yyyy/MM/dd" // You can adjust the format as needed
            placeholderText="تاريخ بدء العذر"
            />
          <DatePicker
            selected={excuseEndDate}
            onChange={(date) => setExcuseEndDate(date)}
            dateFormat="yyyy/MM/dd" // You can adjust the format as needed
            placeholderText="تاريخ انتهاء العذر"
            />
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleSaveExcuse} color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

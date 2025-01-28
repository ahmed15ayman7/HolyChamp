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
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  gender: string;
  pagesRead: number;
  booksCompleted: number;
  missedPages: number;
  excuse: string;
  excuseStartDate?: string;
  excuseEndDate?: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [excuse, setExcuse] = useState("");
  const [excuseStartDate, setExcuseStartDate] = useState<Date | null>(null);
  const [excuseEndDate, setExcuseEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users");
        console.log("Fetched data:", response.data);

        const maleUsers = response.data.users.filter(
          (user: User) => user.gender === "male"
        );
        setUsers(maleUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setExcuse(user.excuse || "");
    // setExcuseStartDate(
    //   user.excuseStartDate ? new Date(user.excuseStartDate) : null
    // );
    // setExcuseEndDate(user.excuseEndDate ? new Date(user.excuseEndDate) : null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setExcuse("");
    // setExcuseStartDate(null);
    // setExcuseEndDate(null);
  };

  const handleSaveExcuse = async () => {
    if (!selectedUser) return;

    try {
      //api for  user excuse
      await axios.put(`/api/users/${selectedUser.id}`, {
        excuse,
        excuseStartDate,
        excuseEndDate,
      });
      // toast.success("تم حفظ العذر بنجاح!");
      // setUsers((prevUsers) =>
      //   prevUsers.map((user) =>
      //     user.id === selectedUser.id
      //       ? { ...user, excuse, excuseStartDate, excuseEndDate }
      //       : user
      //   )
      // );
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving excuse:", error);
      toast.error("فشل في حفظ العذر!");
    }
  };

  return (
    <div className="max-w-full p-6 bg-[#ffffff] rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-[#a5960a] text-center mb-6">
        بيانات القراء الذكور
      </h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-[#a5960a] text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">اسم القارئ</th>
            <th className="px-4 py-2 border border-gray-300">
              عدد الصفحات المقروءة
            </th>
            <th className="px-4 py-2 border border-gray-300">
              عدد الكتب المنجزة
            </th>
            <th className="px-4 py-2 border border-gray-300">عدد الفوائت</th>
            <th className="px-4 py-2 border border-gray-300">العذر</th>
            <th className="px-4 py-2 border border-gray-300">إدخال عذر</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.name}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.pagesRead}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.booksCompleted}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.missedPages}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {user.excuse}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog(user)}
                >
                  إدخال عذر
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Excuse Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>إدخال عذر</DialogTitle>
        <DialogContent>
          <TextField
            label="العذر"
            value={excuse}
            onChange={(e) => setExcuse(e.target.value)}
            fullWidth
            margin="normal"
          />
          <DatePicker
            label="تاريخ بدء العذر"
            value={excuseStartDate}
            onChange={(date) => setExcuseStartDate(date)}
            // renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <DatePicker
            label="تاريخ انتهاء العذر"
            value={excuseEndDate}
            onChange={(date) => setExcuseEndDate(date)}
            // renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
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

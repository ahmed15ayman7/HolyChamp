"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {  toast } from "react-toastify";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // الصفحة الحالية
  const [rowsPerPage, setRowsPerPage] = useState(5); // عدد المستخدمين في كل صفحة
  const [totalUsers, setTotalUsers] = useState(0); // إجمالي عدد المستخدمين

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/users?page=${page}&limit=${rowsPerPage}`
        );
        setUsers(response.data.users);
        setTotalUsers(response.data.total); // عدد المستخدمين الكلي
        // toast.success("تم جلب المستخدمين بنجاح!");
      } catch (error) {
        console.error("خطأ في جلب المستخدمين:", error);
        // toast.error("حدث خطأ أثناء جلب المستخدمين!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]);

  const updateRole = async (id: number, role: string) => {
    try {
      toast.info("جاري تحديث الدور...");
      await axios.put(`/api/users`, { id: id, role });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, role } : user))
      );
      toast.success("تم تحديث الدور بنجاح!");
    } catch (error) {
      console.error("خطأ في تحديث الدور:", error);
      toast.error("فشل في تحديث الدور!");
    }
  };

  const deleteUser = async (id: number) => {
    try {
      toast.info("جاري حذف المستخدم...");
      await axios.delete(`/api/users?id=${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success("تم حذف المستخدم بنجاح!");
    } catch (error) {
      console.error("خطأ في حذف المستخدم:", error);
      toast.error("فشل في حذف المستخدم!");
    }
  };

  if (loading) {
    return <p>جاري التحميل...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة المستخدمين</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم المستخدم</TableCell>
              <TableCell>الاسم</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>الدور</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.role === "user" ? "مستخدم" : "مدير"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 justify-end">
                    <Tooltip
                      title={
                        user.role === "user" ? "ترقية لمدير" : "تحويل لمستخدم"
                      }
                    >
                      <Button
                        variant="contained"
                        color={user.role === "user" ? "primary" : "secondary"}
                        onClick={() =>
                          updateRole(
                            user.id,
                            user.role === "user" ? "admin" : "user"
                          )
                        }
                      >
                        {user.role === "user" ? "ترقية لمدير" : "تحويل لمستخدم"}
                      </Button>
                    </Tooltip>
                    <Tooltip title="حذف المستخدم">
                      <IconButton
                        color="error"
                        onClick={() => deleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(totalUsers / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
};

export default UsersList;

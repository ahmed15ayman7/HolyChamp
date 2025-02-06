"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import AuthRegister from "@/app/(auth)/auth/AuthRegister";
import { User } from "@prisma/client";

const UsersList = ({ isFe }: { isFe: number }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // الصفحة الحالية
  const [rowsPerPage, setRowsPerPage] = useState(5); // عدد المستخدمين في كل صفحة
  const [totalUsers, setTotalUsers] = useState(0); // إجمالي عدد المستخدمين
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // المستخدم المحدد
  const [dialogOpen, setDialogOpen] = useState(false); // حالة فتح/إغلاق الحوار
  const [userData, setUserData] = useState<User | null>(null); // بيانات المستخدم
  const [isFe2, setIsFe] = useState(0);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/users?page=${page}&limit=${rowsPerPage}`
        );
        setUsers(response.data.users);
        setTotalUsers(response.data.total); // عدد المستخدمين الكلي
        console.log("تم جلب المستخدمين بنجاح:", response.data.users);

        // toast.success("تم جلب المستخدمين بنجاح!");
      } catch (error) {
        console.error("خطأ في جلب المستخدمين:", error);
        // toast.error("حدث خطأ أثناء جلب المستخدمين!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage,isFe,isFe2]);

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

  //!#########api call to get user data################
  const userUpdate = (id: number) => {
    for (let i = 1; i <= totalUsers; i++) {
      const user = users.find((u) => u.id === id);
      if (user) {
        console.log("User found:", user);
        setUserData(user);
        setDialogOpen(true);
        return;
      }
    }
  };

  const handleCloseDialog = () => {
    setUserData(null);
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!userData) return;
    console.log("userData", userData);

    try {
      //!#############aftr submit the new user data this is api calling to add the new data to DB############
      await axios.put(`/api/users`, userData);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userData.id ? userData : user))
      );
      toast.success("تم تحديث بيانات المستخدم بنجاح!");
      handleCloseDialog();
    } catch (error) {
      console.error("خطأ في تحديث بيانات المستخدم:", error);
      toast.error("فشل في تحديث بيانات المستخدم!");
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
              <TableCell className="text-center">رقم المستخدم</TableCell>
              <TableCell className="text-center">الاسم</TableCell>
              <TableCell className="text-center">رقم الهاتف</TableCell>
              <TableCell className="text-center">الدور</TableCell>
              <TableCell className="text-center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow className="text-center" key={user.id}>
                <TableCell className="text-center">{user.id}</TableCell>
                <TableCell className="text-center">{user.name } ({user?.missedPages})</TableCell>
                <TableCell className="text-center">{user.phone}</TableCell>
                <TableCell>
                  {user.role === "user" ? "مستخدم" : "مدير"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 justify-center">
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
                    <Tooltip title="عرض بيانات المستخدم">
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                          userUpdate(user.id);
                        }}
                      >
                        عرض البيانات
                      </Button>
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
      {
        //########dialog that will show the user data############
      }
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          <h2 className="text-2xl font-semibold text-[#a5960a]">
            بيانات المستخدم
          </h2>
        </DialogTitle>
        <DialogContent>
      {  userData &&  <AuthRegister user={userData} isManage setIsFe={setIsFe} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            الغاء
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersList;

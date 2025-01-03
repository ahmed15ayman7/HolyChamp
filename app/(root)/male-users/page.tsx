"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import moment from "moment-hijri"; // استيراد مكتبة moment-hijri
import "moment/locale/ar";
moment.locale("ar");
const fetchMaleUsers = async () => {
  const { data } = await axios.get("/api/user?gender=male");
  return data;
};

export default function MaleUsersPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["maleUsers"],
    queryFn: () => fetchMaleUsers(),
  });

  const [searchText, setSearchText] = useState(""); // حالة البحث
  const [isLoadingR, setIsLoadingR] = useState(false);

  // حساب التاريخ الهجري مع اليوم باللغة العربية
  const hijriDate = moment().format("iYYYY/iMM/iDD"); // التنسيق: السنة/الشهر/اليوم
  const arabicDay = moment().locale("ar").format("dddd"); // اليوم باللغة العربية

  const resetUser = async (userId: number) => {
    let toastId = toast.loading("جاري تصفيير الفوائت للرجال ...");
    setIsLoadingR(true);
    try {
      let user = await axios.patch("/api/users", { userId, type: "male" });
      user.status === 200
        ? toast.update(toastId, {
            render: "تم تصفير الفوائت  ",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          })
        : toast.update(toastId, {
            render: "فشل التصفير",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
      refetch();
      setIsLoadingR(false);
    } catch (e) {
      toast.update(toastId, {
        render: "فشل التصفير",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setIsLoadingR(false);
    }
  };

  const resetAll = async () => {
    let toastId = toast.loading("جاري تصفيير الفوائت للرجال ...");
    setIsLoadingR(true);
    try {
      let user = await axios.put("/api/users");
      user.status === 200
        ? toast.update(toastId, {
            render: "تم تصفير الفوائت لجميع الرجال",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          })
        : toast.update(toastId, {
            render: "فشل التصفير",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
      refetch();
      setIsLoadingR(false);
    } catch (e) {
      toast.update(toastId, {
        render: "فشل التصفير",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setIsLoadingR(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Typography variant="h4">فوائت الرجال </Typography>
        <CircularProgress />
      </Container>
    );
  }

  // تصفية المستخدمين بناءً على نص البحث
  const filteredData = data.filter((user: { name: string }) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="text-center mt-8">
        فوائت الرجال
      </Typography>
      <Typography variant="h6" gutterBottom className="text-center mb-4">
        {arabicDay} - {hijriDate}
      </Typography>
      <TextField
        label="بحث بالاسم"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        startIcon={<IconRefresh />}
        onClick={() => resetAll()}
        className="bg-[#a5960a] text-[#ffffff]  hover:bg-[#cec258] flex gap-5"
        disabled={isLoadingR}
        sx={{ marginBottom: 2 }}
      >
        تصفيير كل الفوائت
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الاسم او اللقب </TableCell>
            <TableCell>الفوائت</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map(
            (user: { id: number; name: string; missedPages: number }) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.missedPages}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => resetUser(user.id)}
                    className="bg-[#a5960a] text-[#ffffff]  hover:bg-[#cec258]"
                    disabled={isLoadingR}
                  >
                    تصفيير
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Container>
  );
}

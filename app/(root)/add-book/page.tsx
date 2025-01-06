"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import {
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";

const AddBook = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    author: "",
    publisher: "",
    edition: "",
    editionYear: "",
    totalPages: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();
  let getUser = async () => {
    let user = await getUserData();
    setUser(user);
  };
  // Schema للتحقق من البيانات باستخدام Zod
  const bookSchema = z.object({
    name: z.string().min(3, "اسم الكتاب يجب أن يكون 3 أحرف على الأقل"),
    category: z.string().min(3, "تصنيف الكتاب يجب أن يكون 3 أحرف على الأقل"),
    author: z.string().min(3, "اسم المؤلف يجب أن يكون 3 أحرف على الأقل"),
    publisher: z.string().min(3, "دار النشر يجب أن يكون 3 أحرف على الأقل"),
    edition: z.string().min(1, "الطبعة مطلوبة"),
    editionYear: z.string().min(4, "سنة الطبعة يجب أن تكون 4 أرقام"),
    totalPages: z.number().min(1, "عدد الصفحات يجب أن يكون أكبر من 0"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    console.log("first");
    e.preventDefault();
    // التحقق من البيانات
    const toastId = toast.loading("جاري إضافة الكتاب...");
    try {
      const validatedData = bookSchema.parse({
        ...formData,
        totalPages: Number(formData.totalPages),
      });

      // إظهار Toast تحميل

      setIsLoading(true);
      const response = await axios.post("/api/books", {
        ...validatedData,
        userId: user?.id,
      });

      // تحديث Toast إلى نجاح
      toast.update(toastId, {
        render: "تمت إضافة الكتاب بنجاح!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setFormData({
        name: "",
        category: "",
        author: "",
        publisher: "",
        edition: "",
        editionYear: "",
        totalPages: "",
      });
    } catch (error: any) {
      // إذا كان الخطأ في التحقق من البيانات
      console.log(error);
      if (error instanceof z.ZodError) {
        toast.update(toastId, {
          render: error.errors[0].message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        // تحديث Toast إلى خطأ
        toast.update(toastId, {
          render: "حدث خطأ أثناء إضافة الكتاب",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "600px",
        mx: "auto",
        my: 8,
        p: 11,
        bgcolor: "#F5F4F1FF",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" color="#a5960a" textAlign="center" gutterBottom>
        إضافة كتاب جديد
      </Typography>
      <form>
        <Tooltip title="اسم الكتاب" arrow>
          <TextField
            fullWidth
            label="اسم الكتاب"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>
          <input
            type="hidden"
            name="category"
            value={"علمي"}
            onChange={handleChange}
          />
        <Tooltip title="اسم المؤلف" arrow>
          <TextField
            fullWidth
            label="المؤلف"
            name="author"
            value={formData.author}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>
        <Tooltip title="دار النشر" arrow>
          <TextField
            fullWidth
            label="دار النشر"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>
        <Tooltip title="الطبعة" arrow>
          <TextField
            fullWidth
            label="الطبعة"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>
        <Tooltip title="سنة الطبعة" arrow>
          <TextField
            fullWidth
            label="سنة الطبعة"
            name="editionYear"
            value={formData.editionYear}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>
        <Tooltip title="عدد الصفحات" arrow>
          <TextField
            fullWidth
            label="عدد الصفحات"
            name="totalPages"
            type="number"
            value={formData.totalPages}
            onChange={handleChange}
            margin="normal"
            required
          />
        </Tooltip>

        <Button
          type="submit"
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#a5960a",
            "&:hover": { bgcolor: "#cec258" },
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "إضافة الكتاب"}
        </Button>
      </form>
    </Box>
  );
};

export default AddBook;

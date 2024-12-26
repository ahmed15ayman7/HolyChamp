"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import Link from "next/link";
const articleSchema = z.object({
  title: z.string().min(3, "يجب أن يكون العنوان أطول من 3 أحرف"),
  summary: z.string().min(10, "يجب أن يكون الملخص أطول من 10 أحرف"),
  content: z.string().min(50, "يجب أن يكون المحتوى أطول من 50 حرفًا"),
  author: z.string().min(2, "اسم المؤلف مطلوب"),
});

const ArticleSubmissionPage = () => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState<User>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(articleSchema),
  });
  let getUser = async () => {
    let user = await getUserData();
    setUser(user);
  };
  // Fetch articles from the API
  const fetchArticles = async () => {
    try {
      const response = await axios.get("/api/articles?status=approved");
      const data = await response.data;
      setArticles(data);
    } catch (error) {
      //   toast.error("فشل في جلب المقالات");
    }
  };

  useEffect(() => {
    fetchArticles();
    getUser();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/articles", {
        ...data,
        userId: user?.id,
        status: "pending",
      });
      if (response.status === 201) {
        toast.info("تم إرسال المقال بنجاح، بانتظار مراجعة الإدارة");
        reset();
        setDialogOpen(false);
        fetchArticles(); // Refresh articles
      } else {
        toast.error("حدث خطأ أثناء إرسال المقال");
      }
    } catch (error) {
      toast.error("فشل في إرسال المقال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 4,
        bgcolor: "#FAF3E0",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, color: "#1E3A8A", fontWeight: "bold" }}
      >
        المقالات
      </Typography>

      <Button
        variant="contained"
        onClick={() => setDialogOpen(true)}
        sx={{
          bgcolor: "#1E3A8A",
          "&:hover": { bgcolor: "#163567" },
          mb: 3,
        }}
      >
        إضافة مقال جديد
      </Button>

      {/* Articles List */}
      <List>
        {articles.map((article: any, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-[#1E3A8A]">
              {article.title}
            </h3>
            <p className="text-sm text-[#4A4A4A] mt-3">{article.content}</p>
            {/* <Link
              href={"/articles"}
              className="text-[#FFD700] hover:underline mt-4 inline-block"
            >
              اقرأ المزيد
            </Link> */}
          </div>
        ))}
      </List>

      {/* Dialog for the Form */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>إضافة مقال جديد</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="py-6">
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("title")}
                label="العنوان"
                fullWidth
                error={!!errors.title}
                helperText={`${errors.title}`}
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("summary")}
                label="الملخص"
                fullWidth
                multiline
                rows={3}
                error={!!errors.summary}
                helperText={`${errors.summary?.message}`}
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("content")}
                label="المحتوى"
                fullWidth
                multiline
                rows={5}
                error={!!errors.content}
                helperText={errors.content?.message as string}
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("author")}
                label="اسم المؤلف"
                fullWidth
                error={!!errors.author}
                helperText={errors.author?.message as string}
                variant="outlined"
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: "#1E3A8A", fontWeight: "bold" }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            variant="contained"
            sx={{
              bgcolor: "#1E3A8A",
              "&:hover": { bgcolor: "#163567" },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 2 }} />
                جارٍ الإرسال...
              </>
            ) : (
              "إرسال"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleSubmissionPage;

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { toast } from "react-toastify";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import moment from "moment-hijri";

// Schema للتحقق من صحة البيانات
const reportSchema = z.object({
  id: z.string().optional(),
  readingDate: z.string().min(1, "تاريخ اليوم الهجري مطلوب"),
  bookId: z.string().min(1, "يجب اختيار كتاب"),
  totalPagesRead: z.string().min(1, "عدد الصفحات مطلوب"),
  notes: z.string().optional(),
  finishedBooks: z.enum(["yes", "no"], {
    message: "يرجى تحديد إذا انتهيت من الكتاب",
  }),
});

const ReportForm = ({
  closeForm,
  setIsFe,
  report,
  handelUpdate,
}: {
  closeForm: () => void;
  setIsFe: (i: number) => void;
  report?: any;
  handelUpdate?: (data: any,toastId:any)=>void;
}) => {
  // Local States
  console.log("report", report);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [user, setUser] = useState<User>();
  const [books, setBooks] = useState<{ id: string; name: string }[]>([]);

  // Form Methods
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: `${report?.id}` || undefined,
      readingDate: report?.date as string || moment().format("iYYYY/iMM/iDD"), // تاريخ هجري تلقائي
      bookId: `${report?.bookId}` || "",
      totalPagesRead: `${report?.pagesRead}` || "",
      notes: report?.notes as string || "",
      finishedBooks: report?.completedBooks !== 0 ? "yes" : "no",
    },
  });

  // Fetch User Data
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `/api/finished-books?userId=${report?.userId||user?.id}`
        );
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    if (user?.id) fetchReports();
  }, [user]);
  const getUser = async () => {
    const userData = await getUserData();
    setUser(userData);
  };

  const fetchBooks = async () => {
    if (!user) return setFetchTrigger((prev) => prev + 1);
    try {
      const response = await axios.get(`/api/books?id=${report?.userId||user?.id}`);
      setBooks(
        response.data.map((book: any) => ({
          id: book.id,
          name: book.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("حدث خطأ في تحميل الكتب", { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getUser();
  }, [fetchTrigger]);

  useEffect(() => {
    fetchBooks();
  }, [user]);

  // Form Submission
  const onSubmit = async (data: any) => {
    const toastId = toast.loading(report?"... جاري تحديث التقرير ":"جاري إضافة التقرير...",report ?{autoClose: 3000}:{});
    try {
      if(report){
        const validatedData = reportSchema.parse(data);
        handelUpdate &&handelUpdate(validatedData,toastId);
      }else{
      setIsLoading(true);
      const validatedData = reportSchema.parse(data);
      // مش رادي يستقبل ال بروبرتي بتاعة ال missing
      await axios.post("/api/daily-reports", {
        ...validatedData,
        finishedBooks: validatedData.finishedBooks === "yes" ? 1 : 0,
        userId: user?.id,
        
        totalPagesRead: parseInt(validatedData.totalPagesRead, 10),
        bookId: parseInt(validatedData.bookId),
      });
      setIsFe(Math.random());
      toast.update(toastId, {
        render: "تمت إضافة التقرير بنجاح!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      closeForm(); // Close the form after success
    }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.update(toastId, {
        render:
        error instanceof z.ZodError
        ? "خطأ في البيانات المدخلة"
        : "حدث خطأ أثناء الإضافة",
        isLoading: false,
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">إضافة تقرير قرائي</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Tooltip title="رقم التقرير" arrow>
            <TextField
              {...register("id")}
              disabled
              label=" رقم التقرير"
              error={!!errors.id}
              helperText={errors.id?.message}
              fullWidth
              />
              </Tooltip>
              {/* Hijri Date Field */}
          <Tooltip title="تاريخ اليوم الهجري" arrow>
            <TextField
              {...register("readingDate")}
              label="تاريخ اليوم الهجري"
              disabled
              error={!!errors.readingDate}
              helperText={errors.readingDate?.message}
              fullWidth
            />
          </Tooltip>

          {/* Book of the Day Field */}
          <Tooltip title={report?.bookOfTheDay||"كتاب اليوم"} arrow>
            <FormControl fullWidth error={!!errors.bookId}>
              <InputLabel>كتاب اليوم</InputLabel>
              <Select {...register("bookId")} defaultValue={getValues("bookId")} >
                <MenuItem value="" disabled>
                  اختر الكتاب
                </MenuItem>
                {books.map((book) => (
                  <MenuItem key={book.id} value={`${book.id}`}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
              <p className="text-red-500 text-sm">{errors.bookId?.message}</p>
            </FormControl>
          </Tooltip>

          {/* Pages Read Field */}
          <Tooltip title="الصفحات المقروءة اليوم" arrow>
            <TextField
              {...register("totalPagesRead")}
              label="الصفحات المقروءة اليوم"
              type="number"
              error={!!errors.totalPagesRead}
              helperText={errors.totalPagesRead?.message}
              fullWidth
            />
          </Tooltip>

          {/* Pages misses Read */}
          <Tooltip title="الفوائت" arrow>
            <TextField
              value={5}
              disabled
              label="الفوائت"
              type="text"
              error={!!errors.totalPagesRead}
              helperText={errors.totalPagesRead?.message}
              fullWidth
            />
          </Tooltip>

          {/* Finished Book Field */}
          <Tooltip title="هل أنهيت الكتاب؟" arrow>
            <FormControl fullWidth>
              <InputLabel>هل أنهيت الكتاب؟</InputLabel>
              <Select {...register("finishedBooks")} defaultValue={getValues("finishedBooks")}>
                <MenuItem value="no">لا</MenuItem>
                <MenuItem value="yes">نعم</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>

          {reports.length === 0 ? (
            <p>لا توجد تقارير حالياً.</p>
          ) : (
            <ReportTable reports={reports} />
          )}
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            className=" bg-[#a5960a] text-[#ffffff]  hover:bg-[#cec258]"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : report?"تعديل": "إضافة التقرير"}
          </Button>
          <Button
            variant="contained"
            className=" bg-[#f00] text-[#ffffff]  hover:bg-[#ff000090]"
            onClick={(e) => {
              e.preventDefault();
              closeForm();
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : " إلغاء"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;

const ReportTable = ({ reports }: { reports: any[] }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>تاريخ الختم</TableCell>
        <TableCell>عدد الصفحات</TableCell>
        <TableCell>المؤلف</TableCell>
        <TableCell>الكتب المقروءة</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {reports.map((report) => (
        <TableRow key={report._id}>
          <TableCell>{report.readingDate}</TableCell>
          <TableCell>{report.totalPagesRead}</TableCell>
          <TableCell>{report.author}</TableCell>
          <TableCell>{report.bookName}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

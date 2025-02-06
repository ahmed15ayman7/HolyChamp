import { useEffect, useState } from "react";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import ReportForm from "./ReportForm";


interface Report {
  id: number; // Hijri Date
  date: string; // Hijri Date
  readerName: string;
  challenge: number;
  completedBooks: number;
  pagesRead: number;
  missedPages: number;
  bookOfTheDay: string;
}

const ReportTable = ({
  isFe,
  setIsFe,
}: {
  isFe: number;
  setIsFe: (i: number) => void;
}) => {
  const [reports, setReports] = useState<any[]>([]); // State to store reports
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [user, setUser] = useState<User>();
  const [selectedReport, setSelectedReport] = useState<any | null>(null); // State to store the selected report
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State to control dialog open/close
  const [isFormOpen, setIsFormOpen] = useState(false);

  let getUser = async () => {
    let user = await getUserData();
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/daily-reports");
        console.log("Fetched data:", response.data);

        const flattenedReports = response.data.flat(); // Flatten the nested array
        const sortedReports = flattenedReports.sort((a: any, b: any) =>
          a.date.localeCompare(b.date)
        ); // Sort the reports by date
        setReports(sortedReports); // Update state with sorted data
      } catch (err: any) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchReports();
  }, [isFe]);

  if (loading)
    return <p className="text-center text-gray-700">جاري تحميل البيانات...</p>;
  if (error)
    return <p className="text-center text-red-500">حدث خطأ: {error}</p>;
  if (reports.length === 0)
    return (
      <p className="text-center text-gray-500">لا توجد تقارير لعرضها حاليًا.</p>
    );

  const deleteReport = async (id: number) => {
    const toastId = toast.loading("جاري حذف التقرير...");
    try {
      await axios.delete(`/api/daily-reports?id=${id}`);
      toast.update(toastId, {
        render: "تم حذف التقرير بنجاح!",
        autoClose: 3000,
        isLoading: false,
        type: "success",
      });
      setIsFe(Math.random());
    } catch (error) {
      console.error("خطأ في حذف التقرير:", error);
      toast.update(toastId, {
        autoClose: 3000,
        isLoading: false,
        type: "error",
        render: "فشل في حذف التقرير!",
      });
    }
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  const handleEditClick = (report: any) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReport(null);
  };

  const handleDialogSubmit = async (data:any,toastId:any) => {
    if (!selectedReport) return;
    try {
      await axios.put(`/api/daily-reports`, {...data,bookId:+data.bookId,id:+data.id,totalPagesRead:+data.totalPagesRead,finishedBooks:data.finishedBooks === "yes" ? 1 : 0});
      toast.update(toastId,{
        render:"تم تحديث التقرير بنجاح!",
        autoClose: 3000,
        isLoading: false,
        type: "success",
      });
      setIsFe(Math.random());
      handleCloseForm();
    } catch (error) {
      console.error("خطأ في تحديث التقرير:", error);
      toast.update(toastId,{
        render:"فشل في تحديث التقرير!",
        autoClose: 3000,
        isLoading: false,
        type: "error",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedReport) return;

    const { name, value } = e.target;
    setSelectedReport({ ...selectedReport, [name]: value });
  };

  const generateDateColors = (dates: string[]): { [key: string]: string } => {
    const uniqueDates = [...new Set(dates)];
    const colors = ["bg-[#EAE6BF]", "bg-[#ffff]"];
    return uniqueDates.reduce((acc, date, index) => {
      acc[date] = colors[index % colors.length];
      return acc;
    }, {} as { [key: string]: string });
  };

  // Extract dates from reports
  const dates = reports.map((report) => report.date);
  // Generate colors for each date
  const dateColors = generateDateColors(dates);

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-[#a5960a] text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">اسم القارئ</th>
            <th className="px-4 py-2 border border-gray-300">التاريخ الهجري</th>
            <th className="px-4 py-2 border border-gray-300">التحدي القرائي</th>
            <th className="px-4 py-2 border border-gray-300">الكتب المنجزة</th>
            <th className="px-4 py-2 border border-gray-300">
              الصفحات المقروءة
            </th>
            <th className="px-4 py-2 border border-gray-300">الفوائت</th>
            <th className="px-4 py-2 border border-gray-300">كتاب اليوم</th>
            {!loading && user?.role === "admin" && (
              <th className="px-4 py-2 border border-gray-300"> </th>
            )}
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report.id} className={dateColors[report.date]}>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.readerName}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.date}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.challenge}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.completedBooks}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.pagesRead}
              </td>
              <td
                className={`px-4 py-2 border border-gray-300 text-center ${
                  report.missedPages > 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {report.missedPages}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {report.bookOfTheDay}
              </td>
              {!loading && user?.role === "admin" && (
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <Tooltip title="تعديل التقرير">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(report)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="حذف التقرير">
                    <IconButton
                      color="error"
                      onClick={() => deleteReport(report.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isFormOpen && (
        <ReportForm closeForm={handleCloseForm} setIsFe={setIsFe} report={selectedReport} handelUpdate={handleDialogSubmit} />
      )}
      {/* Edit Report Dialog */}
      {/* <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>تعديل التقرير</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <div>
              <TextField
                label="اسم القارئ"
                name="readerName"
                value={selectedReport.readerName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="التاريخ الهجري"
                name="date"
                value={selectedReport.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="التحدي القرائي"
                name="challenge"
                value={selectedReport.challenge}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="الكتب المنجزة"
                name="completedBooks"
                value={selectedReport.completedBooks}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="الصفحات المقروءة"
                name="pagesRead"
                value={selectedReport.pagesRead}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="الفوائت"
                name="missedPages"
                value={selectedReport.missedPages}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="كتاب اليوم"
                name="bookOfTheDay"
                value={selectedReport.bookOfTheDay}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default ReportTable;

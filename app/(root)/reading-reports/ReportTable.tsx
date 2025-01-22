import { useEffect, useState } from "react";
import axios from "axios";
import { getUserData } from "@/lib/actions/user.action";
import { User } from "@/interfaces";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

// Define the type for a single report
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
  const [reports, setReports] = useState<Report[]>([]); // State to store reports
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [user, setUser] = useState<User>();
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
        const response = await axios.get<Report[]>("/api/daily-reports");
        const flattenedReports = response.data.flat(); // Flatten the nested array
        const sortedReports = flattenedReports.sort((a, b) =>
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
      <p className="text-center text-gray-500">لا توجد بيانات لعرضها حاليًا.</p>
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
  //sort dates of report and grouping it by date and add color to every group
  const generateDateColors = (dates: string[]): { [key: string]: string } => {
    const uniqueDates = [...new Set(dates)];
    const colors = [
      "bg-red-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-yellow-100",
      "bg-purple-100",
    ];
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
    </div>
  );
};

export default ReportTable;

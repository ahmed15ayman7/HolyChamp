import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for a single report
interface Report {
  date: string; // Hijri Date
  readerName: string;
  challenge: number;
  completedBooks: number;
  pagesRead: number;
  missedPages: number;
  bookOfTheDay: string;
}

const ReportTable = ({ isFe }: { isFe: number }) => {
  const [reports, setReports] = useState<Report[][]>([]); // State to store reports
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<Report[][]>("/api/daily-reports");
        setReports(response.data); // Update state with fetched data
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
          </tr>
        </thead>
        <tbody>
          {reports.map((readerReports, readerIndex) =>
            readerReports.map((report, index) => (
              <tr
                key={`${readerIndex}-${index}`}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;

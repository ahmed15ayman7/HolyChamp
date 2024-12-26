import { useEffect, useState } from "react";
import axios from "axios";

// Define the type for a single report
interface Report {
  date: string; // Hijri Date
  readerName: string;
  challenge: string;
  completedBooks: number;
  pagesRead: number;
  missedPages: number;
  bookOfTheDay: string;
}

const ReportTable = ({isFe}:{isFe:number}) => {
  const [reports, setReports] = useState<Report[]>([]); // State to store reports
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<Report[]>("/api/daily-reports"); 
        setReports(response.data); // Update state with fetched data
      } catch (err: any) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchReports();
  }, [isFe]);

  if (loading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p>حدث خطأ: {error}</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-[#a5960a] text-white">
          <tr>
            <th className="px-4 py-2">التاريخ الهجري</th>
            <th className="px-4 py-2">اسم القارئ</th>
            <th className="px-4 py-2">التحدي القرائي</th>
            <th className="px-4 py-2">الكتب المنجزة</th>
            <th className="px-4 py-2">الصفحات المقروءة</th>
            <th className="px-4 py-2">الفوائت</th>
            <th className="px-4 py-2">كتاب اليوم</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{report.date}</td>
              <td className="px-4 py-2">{report.readerName}</td>
              <td className="px-4 py-2">{report.challenge}</td>
              <td className="px-4 py-2">{report.completedBooks}</td>
              <td className="px-4 py-2">{report.pagesRead}</td>
              <td className="px-4 py-2">{report.missedPages}</td>
              <td className="px-4 py-2">{report.bookOfTheDay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;

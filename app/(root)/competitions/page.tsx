"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { VictoryLine, VictoryPie, VictoryChart, VictoryTheme } from "victory";
import moment from "moment-hijri";
import "moment/locale/ar";
moment.locale("ar");

const PageCompetitions = () => {
  const [readingProgressData, setReadingProgressData] = useState([
    { x: "اليوم 1", y: 20 },
    { x: "اليوم 2", y: 35 },
    { x: "اليوم 3", y: 50 },
    { x: "اليوم 4", y: 30 },
    { x: "اليوم 5", y: 40 },
  ]);
  const [readingChallengeData, setReadingChallengeData] = useState<
    { x: string; y: number }[]
  >([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // عدد العناصر المراد عرضها

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/competitions");
        const { readingProgressData, readingChallengeData, participantsData } =
          response.data;

        // Map data for VictoryLine
        setReadingProgressData(
          readingProgressData.map((item: any) => ({
            x: moment(item.readingDate, "iYYYY-iMM-iDD").format("dddd"),
            y: item.totalPagesRead,
          }))
        );

        // Map data for VictoryPie
        const totalBooks = readingChallengeData.reduce(
          (acc: number, curr: any) => acc + curr._count.id,
          0
        );
        setReadingChallengeData([
          { x: "مجموع الكتب", y: totalBooks + 10 },
          { x: "الكتب المقروءة", y: totalBooks - 5 }, // Example
        ]);

        // Map participants data
        setParticipantsData(
          participantsData
            .map((participant: any) => ({
              name: participant.name,
              booksRead: participant.DailyReport.reduce(
                (sum: number, report: any) => sum + report.finishedBooks,
                0
              ),
            }))
            .sort((a: any, b: any) => b.booksRead - a.booksRead)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-full p-8 bg-[#FAF3E0] rounded-lg shadow-xl">
      {/* Title Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#a5960a]">
          فليتنافس المتنافسون
        </h1>
        <p className="mt-3 text-lg text-[#4A4A4A]">
          تابع تقدمك في التحدي القرائي وتنافس مع الآخرين!
        </p>
      </header>

      {/* Top Section with Graphs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left - Reading Challenge Progress */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#a5960a]">
            تقدم التحدي القرائي
          </h2>
          <VictoryPie
            data={readingChallengeData}
            colorScale={["#4CAF50", "#FFC107"]}
            innerRadius={100}
            labelRadius={120}
            style={{
              labels: { fontSize: 16, fill: "#a5960a", fontWeight: "bold" },
            }}
          />
        </div>

        {/* Right - Reading Progress over 5 Days */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#a5960a]">
            تقدمك في الأيام الخمسة الماضية
          </h2>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={readingProgressData}
              style={{
                data: { stroke: "#4CAF50", strokeWidth: 3 },
                parent: { border: "1px solid #ccc" },
              }}
            />
          </VictoryChart>
        </div>
      </section>

      {/* Bottom Section - Participant Achievements */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#a5960a] mb-4">
          إنجازات المشاركين
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-[#a5960a]">
              <th className="px-4 py-2 text-right">اسم المشترك</th>
              <th className="px-4 py-2 text-right">عدد الكتب المقروءة</th>
            </tr>
          </thead>
          <tbody>
            {participantsData
              .slice(0, visibleCount)
              .map((participant: any, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{participant.name}</td>
                  <td className="px-4 py-2">{participant.booksRead}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* عرض المزيد */}
        {visibleCount < participantsData.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisibleCount(visibleCount + 10)}
              className="px-4 py-2  bg-[#a5960a] text-[#ffffff]  hover:bg-[#cec258] rounded-md transition"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PageCompetitions;

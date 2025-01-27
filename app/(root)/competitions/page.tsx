"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  VictoryLine,
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryLegend,
} from "victory";
import moment from "moment-hijri";
import "moment/locale/ar";
moment.locale("ar");

const PageCompetitions = () => {
  const [readingProgressData, setReadingProgressData] = useState([
    { x: "الأحد", y: 0 },
    { x: "الإثنين", y: 0 },
    { x: "الثلاثاء", y: 0 },
    { x: "الأربعاء", y: 0 },
    { x: "الخميس", y: 0 },
    { x: "الجمعة", y: 0 },
    { x: "السبت", y: 0 },
  ]);
  const [readingChallengeData, setReadingChallengeData] = useState<
    { x: string; y: number }[]
  >([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // عدد العناصر المراد عرضها
  const [selectedSlice, setSelectedSlice] = useState<{
    x: string;
    y: number;
    color: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/competitions");
        const { readingProgressData, readingChallengeData, participantsData } =
          response.data;
        console.log(response.data);

        const weekDays = [
          "الأحد",
          "الإثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];
        const progressData = weekDays.map((day) => {
          const dayData = readingProgressData.find(
            (item: any) =>
              moment(item.readingDate, "iYYYY-iMM-iDD").format("dddd") === day
          );
          return {
            x: day,
            y: dayData ? dayData.totalPagesRead : 0,
          };
        });

        setReadingProgressData(progressData);

        const totalBooks = readingChallengeData.reduce(
          (acc: number, curr: any) => acc + curr._count.id,
          0
        );
        setReadingChallengeData([
          { x: "مجموع الكتب", y: totalBooks + 10 },
          { x: "الكتب المقروءة", y: totalBooks - 5 }, // Example
        ]);
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
          <div className="flix justify-around w-full bg-slate-100 items-center">
            <p className="text-center text-[#4A4A4A]">
              هذا الرسم البياني يوضح تقدم التحدي القرائي. اللون الأخضر يمثل
              مجموع الكتب، بينما اللون الأصفر يمثل الكتب المقروءة.
            </p>
            {selectedSlice && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#a5960a]">
                  تفاصيل الشريحة المحددة
                </h3>
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full m-2"
                    style={{ backgroundColor: selectedSlice.color }}
                  ></div>
                  <p className="text-[#4A4A4A]">العنوان: {selectedSlice.x}</p>
                </div>
                <p className="mx-8 text-[#4A4A4A]">القيمة: {selectedSlice.y}</p>
              </div>
            )}
          </div>
          <VictoryPie
            data={readingChallengeData}
            colorScale={["#4CAF50", "#FFC107"]}
            innerRadius={100}
            labelRadius={120}
            labels={({ datum }) => `${datum.y} %`} // Display the number of elements
            padAngle={2}
            style={{
              data: {
                fillOpacity: 0.7,
                stroke: "#fff",
                strokeWidth: 2,
                cursor: "pointer",
              },
              labels: { fontSize: 16, fill: "black" },
            }}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: (event, props) => {
                    setSelectedSlice({
                      x: props.datum.x,
                      y: props.datum.y,
                      color: props.style.fill,
                    });
                    return [];
                  },
                },
              },
            ]}
          />
        </div>

        {/* Right - Reading Progress over 7 Days */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#a5960a]">
            تقدمك في الأيام السبعة الماضية
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
        <div className="overflow-x-auto">
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
        </div>

        {/* عرض المزيد */}
        {visibleCount < participantsData.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisibleCount(visibleCount + 10)}
              className="px-4 py-2 bg-[#a5960a] text-[#ffffff] hover:bg-[#cec258] rounded-md transition"
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

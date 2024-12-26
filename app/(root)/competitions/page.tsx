"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { VictoryLine, VictoryPie, VictoryChart, VictoryTheme } from "victory";

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
            x: item.readingDate,
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
          participantsData.map((participant: any) => ({
            name: participant.name,
            booksRead: participant.DailyReport.reduce(
              (sum: number, report: any) => sum + report.finishedBooks,
              0
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-[#FAF3E0] rounded-lg shadow-xl">
      {/* Title Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1E3A8A]">
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
          <h2 className="text-xl font-semibold text-[#1E3A8A]">
            تقدم التحدي القرائي
          </h2>
          <VictoryPie
            data={readingChallengeData}
            colorScale={["#4CAF50", "#FFC107"]}
            innerRadius={100}
            labelRadius={120}
            style={{
              labels: { fontSize: 16, fill: "#1E3A8A", fontWeight: "bold" },
            }}
          />
        </div>

        {/* Right - Reading Progress over 5 Days */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1E3A8A]">
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
        <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4">
          إنجازات المشاركين
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-[#1E3A8A]">
              <th className="px-4 py-2 text-right">اسم المشترك</th>
              <th className="px-4 py-2 text-right">عدد الكتب المقروءة</th>
            </tr>
          </thead>
          <tbody>
            {participantsData.map((participant: any, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{participant.name}</td>
                <td className="px-4 py-2">{participant.booksRead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PageCompetitions;

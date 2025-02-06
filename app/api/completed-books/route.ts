import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const format = url.searchParams.get("format"); // "json" أو "pdf"
    const gender = url.searchParams.get("gender"); // "male" أو "female"

    const whereClause = gender
      ? { finishedBooks: { gt: 0 }, user: { gender } }
      : { finishedBooks: { gt: 0 } };

    const completedBooks = await prisma.dailyReport.findMany({
      where: whereClause,
      select: {
        readingDate: true,
        totalPagesRead: true,
        user: {
          select: {
            name: true,
            gender: true,
          },
        },
        book: {
          select: {
            name: true,
            totalPages: true,
          },
        },
      },
      orderBy: { userId: "asc" },
    });

    if (format === "pdf") {
      const htmlContent = `
        <html dir="rtl" lang="ar">
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              direction: rtl;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f4f4f4;
            }
          </style>
        </head>
        <body>
          <h1>الكتب المختومة (${
            gender === "male"
              ? "الذكور"
              : gender === "female"
              ? "الإناث"
              : "الجميع"
          })</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>القارئ</th>
                <th>الجنس</th>
                <th>الكتاب</th>
                <th>عدد الصفحات</th>
                <th>تاريخ الختم</th>
              </tr>
            </thead>
            <tbody>
              ${completedBooks
                .map(
                  (record, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${record.user.name}</td>
                    <td>${record.user.gender === "male" ? "ذكر" : "أنثى"}</td>
                    <td>${record.book.name}</td>
                    <td>${record.book.totalPages}</td>
                    <td>${record.readingDate}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(htmlContent, { waitUntil: "load" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=completed_books_${gender || "all"}.pdf`,
        },
      });
    } else {
      return NextResponse.json(completedBooks, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch completed books: ${error.message}` }, { status: 500 });
  }
}

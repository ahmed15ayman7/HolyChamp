import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const format = url.searchParams.get("format"); // "json" or "pdf"
    const gender = url.searchParams.get("gender"); // "male" or "female"

    const whereClause = gender ? { role: "user", gender } : { role: "user" };

    const readers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        readingChallenge: true,
        missedPages: true,
      },
      orderBy: { gender: "asc" },
    });

    if (format === "pdf") {
      // Generate HTML content for the PDF
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
          <h1>قائمة القراء (${
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
                <th>الاسم</th>
                <th>الجنس</th>
                <th>الهاتف</th>
                <th>التحدي</th>
                <th>الصفحات الفائتة</th>
              </tr>
            </thead>
            <tbody>
              ${readers
                .map(
                  (reader, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${reader.name}</td>
                    <td>${reader.gender === "male" ? "ذكر" : "أنثى"}</td>
                    <td>${reader.phone}</td>
                    <td>${reader.readingChallenge}</td>
                    <td>${reader.missedPages}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Launch Puppeteer and generate PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the content of the page
      await page.setContent(htmlContent, { waitUntil: "load" });

      // Generate the PDF buffer
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      // Return the PDF response
      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=readers_list_${gender || "all"}.pdf`,
        },
      });
    } else {
      return NextResponse.json(readers, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch readers: ${error.message}` }, { status: 500 });
  }
}
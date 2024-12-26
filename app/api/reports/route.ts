import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // تأكد من إعداد Prisma في مشروعك

export async function GET() {
  try {
    // جلب عدد الكتب المقروءة لكل مستخدم
    const userReports = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        DailyReport: {
          select: {
            bookId: true,
          },
        },
      },
    });

    // حساب عدد الكتب لكل مستخدم
    const result = userReports.map((user: any) => {
      const uniqueBooks = new Set(
        user.DailyReport.map((report: any) => report.bookId)
      );
      return {
        userId: user.id,
        userName: user.name,
        totalBooksRead: uniqueBooks.size, // عدد الكتب الفريدة المقروءة
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

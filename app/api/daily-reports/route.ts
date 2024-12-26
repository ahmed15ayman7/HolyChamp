import { NextResponse } from "next/server";
import { DailyReport } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data: DailyReport = await request.json();
  try {
    const report = await prisma.dailyReport.create({ data });
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    const reports = await prisma.dailyReport.findMany({
      include: {
        user: true, // تضمين معلومات المستخدم
        book: true, // تضمين معلومات الكتاب
      },
    });

    // معالجة البيانات لتنسيقها
    const formattedReports = reports.map((report, i) => ({
      date: report.readingDate, // تاريخ القراءة
      readerName: report.user.name, // اسم القارئ
      challenge: i + 1, // تحدي افتراضي (يمكنك تغييره)
      completedBooks: report.finishedBooks, // الكتب المكتملة
      pagesRead: report.totalPagesRead, // عدد الصفحات المقروءة
      missedPages:
        report.totalPagesRead < report.book.totalPages
          ? report.book.totalPages - report.totalPagesRead
          : 0, // الصفحات الفائتة إذا كانت موجودة
      bookOfTheDay: report.book.name, // اسم الكتاب
    }));

    return NextResponse.json(formattedReports, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// تحديث تقرير يومي
export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;
  try {
    const report = await prisma.dailyReport.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(report, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// حذف تقرير يومي
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.dailyReport.delete({ where: { id } });
    return NextResponse.json(
      { message: "Daily report deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

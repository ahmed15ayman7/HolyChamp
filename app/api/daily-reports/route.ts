import { NextResponse } from "next/server";
import { DailyReport } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data: DailyReport = await request.json();
  try {
    let userId = data.userId;
    let totalPagesRead = data.totalPagesRead;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate remaining missed pages
    let remainingMissedPages = user.missedPages - totalPagesRead;
    if (remainingMissedPages < 0) remainingMissedPages = 0;

    // Update missed pages
    await prisma.user.update({
      where: { id: userId },
      data: { missedPages: remainingMissedPages },
    });
    const report = await prisma.dailyReport.create({ data });
    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    // افتراض أن كل يوم يجب قراءة 5 صفحات
    const dailyReadingGoal = 5;

    // جلب جميع التقارير مع تضمين معلومات المستخدم والكتاب
    const reports = await prisma.dailyReport.findMany({
      include: {
        user: true, // تضمين معلومات المستخدم
        book: true, // تضمين معلومات الكتاب
      },
      orderBy: {
        readingDate: "asc", // ترتيب التقارير حسب تاريخ القراءة
      },
    });

    // إنشاء خريطة لتخزين الفوائت لكل مستخدم
    const userReports = new Map();

    reports.forEach((report) => {
      const userId = report.userId;

      // إذا كان المستخدم غير موجود في الخريطة، يتم إضافته
      if (!userReports.has(userId)) {
        userReports.set(userId, {
          totalMissedPages: 0, // إجمالي الفوائت
          formattedReports: [], // تقارير المستخدم
        });
      }

      // استرجاع بيانات المستخدم من الخريطة
      const userData = userReports.get(userId);

      // حساب الفوائت بناءً على الصفحات المقروءة والفوائت السابقة
      const missedPages =
        report.totalPagesRead + userData.totalMissedPages < dailyReadingGoal
          ? dailyReadingGoal -
            (report.totalPagesRead + userData.totalMissedPages)
          : 0;

      // تحديث إجمالي الفوائت
      userData.totalMissedPages =
        missedPages > 0 ? userData.totalMissedPages + missedPages : 0;

      // إضافة التقرير إلى تقارير المستخدم
      userData.formattedReports.push({
        id: report.id,
        date: report.readingDate, // تاريخ القراءة
        readerName: report.user.name, // اسم القارئ
        challenge: userData.formattedReports.length + 1, // التحدي
        completedBooks: report.finishedBooks, // الكتب المكتملة
        pagesRead: report.totalPagesRead, // عدد الصفحات المقروءة
        missedPages, // الصفحات الفائتة
        bookOfTheDay: report.book.name, // اسم الكتاب
      });
    });

    // تحويل البيانات إلى قائمة منسقة لإرجاعها
    const allFormattedReports = Array.from(userReports.values()).map(
      (userData) => userData.formattedReports
    );

    return NextResponse.json(allFormattedReports, { status: 200 });
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
  const sercUrl = new URL(request.url);
  let id = sercUrl.searchParams.get("id");
  try {
    if (id) {
      await prisma.dailyReport.delete({ where: { id: +id } });
      return NextResponse.json(
        { message: "Daily report deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Daily report deleted faild notfound id" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

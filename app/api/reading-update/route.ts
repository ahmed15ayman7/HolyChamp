import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // تحديث الصفحات الفائتة لجميع المستخدمين
    await prisma.user.updateMany({
      where: {
        excuse: undefined,
      },
      data: {
        missedPages: {
          increment: 5, // إضافة 5 صفحات يوميًا
        },
      },
    });

    return NextResponse.json({ message: "Daily update completed: Added 5 pages to all users." }, { status: 200 });
  } catch (error) {
    console.error("Error updating missed pages:", error);
    return NextResponse.json({ error: "Failed to update pages." }, { status: 500 });
  }
}

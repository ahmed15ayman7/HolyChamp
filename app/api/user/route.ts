import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get("gender"); // تصفية حسب النوع

  try {
    if (gender) {
      const users = await prisma.user.findMany({
        where: { gender },
        select: {
          id: true,
          name: true,
          missedPages: true,
          excuse: true,
          excuseStartDate: true,
          excuseEndDate: true,
          DailyReport: {
            select: {
           finishedBooks: true,
           totalPagesRead: true,
            },
          },
        },
      });

      return NextResponse.json(users);
    } else {
      return NextResponse.json({ error: "النوع غير موجود" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { ...updates },
    });
    // Generate a JWT token

    const response = NextResponse.json(user, { status: 201 });


    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
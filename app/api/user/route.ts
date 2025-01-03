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

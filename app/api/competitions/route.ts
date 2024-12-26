// /app/api/competitions/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch data from the database
    const readingProgressData = await prisma.dailyReport.findMany({
      select: {
        readingDate: true,
        totalPagesRead: true,
      },
    });

    const readingChallengeData = await prisma.dailyReport.groupBy({
      by: ['userId'],
      _count: {
        id: true, // عدد الكتب المقروءة
      },
    });

    const participantsData = await prisma.user.findMany({
      select: {
        name: true,
        DailyReport: {
          select: { finishedBooks: true },
        },
      },
    });

    return NextResponse.json({ readingProgressData, readingChallengeData, participantsData });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

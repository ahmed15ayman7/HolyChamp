import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Fetch finished books for the specific user
    const finishedBooks = await prisma.dailyReport.findMany({
      where: {
        userId: parseInt(userId, 10), // Filter by userId
        finishedBooks: { gt: 0 }, // Ensure finished books are greater than 0
      },
      include: {
        book: true, // Include book details
      },
    });

    // Map the results to the desired format
    const result = finishedBooks.map((report) => ({
    readingDate: report.readingDate,
    totalPagesRead: report.book.totalPages,
      author: report.book.author,
      bookName: report.book.name,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch finished books." },
      { status: 500 }
    );
  }
}

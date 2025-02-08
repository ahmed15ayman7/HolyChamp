import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    // await prisma.dailyReport.deleteMany({});
    // await prisma.article.deleteMany({});
    // await prisma.book.deleteMany({});
    // await prisma.home.deleteMany({});
    return NextResponse.json({ message: "All non-user data deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ message: "Error deleting data", error: error.message }, { status: 500 });
  }
}
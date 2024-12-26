import { NextResponse } from "next/server";
import { User } from "@/interfaces";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const user = await prisma.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const skip = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      skip,
      take: limit,
    });
    const total = await prisma.user.count();

    return NextResponse.json({ users, total }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// تحديث مستخدم
export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// حذف مستخدم
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    if (id) {
      await prisma.user.delete({ where: { id: +id } });
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

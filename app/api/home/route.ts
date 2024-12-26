import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    let home = await prisma.home.findMany();
    return NextResponse.json(home, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `faild to get data home ${error.message}` },
      { status: 400 }
    );
  }
}
export async function POST(req: Request) {
  try {
    let body = await req.json();
    let home = await prisma.home.create({ data: body });
    return NextResponse.json(home, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `faild to post data home ${error.message}` },
      { status: 400 }
    );
  }
}
export async function PUT(req: Request) {
  try {
    let { id, ...update } = await req.json();
    let home = await prisma.home.update({
      data: update,
      where: {
        id: id,
      },
    });
    return NextResponse.json(home, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `faild to update data home ${error.message}` },
      { status: 400 }
    );
  }
}

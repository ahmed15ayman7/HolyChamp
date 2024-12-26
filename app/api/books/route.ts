import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data.userId) {
      const book = await prisma.book.create({
        data: {
          userId: data.userId,
          name: data.name,
          author: data.author,
          publisher: data.publisher,
          category: data.category,
          edition: data.edition,
          editionYear: data.editionYear,
          totalPages: parseInt(data.totalPages, 10),
        },
      });
      return new Response(JSON.stringify(book), { status: 201 });
    }
  } catch (error: any) {
    console.error("Error during book creation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    let w = id
      ? {
          userId: +id,
        }
      : {};
    const books = await prisma.book.findMany({
      where: w,
    });
    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;

  try {
    const book = await prisma.book.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(book, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.book.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

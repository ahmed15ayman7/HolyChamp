import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: إنشاء مقال جديد
export async function POST(req: Request) {
  try {
    const { title, summary, content, author, userId, status } =
      await req.json();

    const newArticle = await prisma.article.create({
      data: { title, summary, content, author, userId, status },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to submit article" },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const gender = searchParams.get("gender"); // إضافة فلتر للجنس

    if (id) {
      const article = await prisma.article.findUnique({
        where: { id: Number(id) },
      });
      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(article, { status: 200 });
    }

    if (status && gender) {
      const articlesByStatus = await prisma.article.findMany({
        where: {
          user: {
            gender,
          },
          status,
        },
        include: {
          user: true, // تضمين بيانات المستخدم إن احتجتها
        },
      });
      return NextResponse.json(articlesByStatus, { status: 200 });
    } else if (status) {
      const articlesByStatus = await prisma.article.findMany({
        where: { status },
      });
      return NextResponse.json(articlesByStatus, { status: 200 });
    }

    if (gender) {
      const articlesByGender = await prisma.article.findMany({
        include: {
          user: true, // تضمين بيانات المستخدم إن احتجتها
        },
        where: {
          user: {
            gender,
          },
        },
      });
      return NextResponse.json(articlesByGender, { status: 200 });
    }

    const articles = await prisma.article.findMany();
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// PUT: تحديث مقال
export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: Number(id) },
      data: updates,
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE: حذف مقال
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

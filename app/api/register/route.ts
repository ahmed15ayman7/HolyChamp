import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      name,
      phone,
      password,
      gender,
      region,
      readingChallenge,
      isPreviousParticipant,
    } = await req.json();
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "رقم الهاتف مسجل بالفعل. يرجى استخدام رقم هاتف آخر." },
        { status: 202 }
      );
    }

    // إنشاء كلمة مرور مشفرة
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        gender,
        region,
        readingChallenge: readingChallenge === "yes" ? 1 : 0,
        isPreviousParticipant: isPreviousParticipant === "yes" ? true : false,
      },
    });

    return NextResponse.json(
      { message: "تم التسجيل بنجاح! حسابك في انتظار الموافقة.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("خطأ أثناء تسجيل المستخدم:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

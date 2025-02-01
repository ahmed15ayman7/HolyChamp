import { NextResponse } from "next/server";
import { User } from "@/interfaces";

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const secret =
  process.env.JWT_SECRET ||
  "34567890iuyghjkhgfehjkjhrtyoiu5787iuujhdfhjhmhgdfgjfhj"; // Replace the default in .env
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
    // const hashedPassword = await bcrypt.hash(updates?.password, 10);
    const user = await prisma.user.update({
      where: { id },
      data: { ...updates },
    });
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role }, // Include the role in the payload
      secret,
      { expiresIn: "30d" } // Token valid for 30 days
    );

    // Create a successful login response
    const response = NextResponse.json(user, { status: 200 });

    // Set the JWT token as a secure, HTTP-only cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 60 * 60 * 24 * 30, // Cookie expires in 30 days
      sameSite: "strict", // Protect against CSRF attacks
    });

    // Optionally store user data in a separate cookie (not secure, for client use)
    response.cookies.set(
      "userData",
      JSON.stringify({
        id: user.id,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        region: user.region,
        readingChallenge: user.readingChallenge,
        isPreviousParticipant: user.isPreviousParticipant,
        role: user.role, // Include the role in the cookie
      }),
      {
        httpOnly: false, // Accessible from the client-side
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
        sameSite: "strict",
      }
    );

    return response;
  } catch (error: any) {
    console.log(error);
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

export async function PATCH(request: Request) {
  const { userId, type } = await request.json();

  try {
    if (userId) {
      await prisma.user.update({
        where: { id: userId, gender: type },
        data: { missedPages: 0 },
      });
    } else {
      await prisma.user.updateMany({
        data: { missedPages: 0 },
      });
    }

    return NextResponse.json({ message: "Missed pages reset successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset missed pages" },
      { status: 500 }
    );
  }
}

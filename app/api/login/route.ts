import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // Assuming prisma is set up in a `lib/prisma.ts` file

// Use an environment variable for JWT_SECRET with a default value for safety
const secret =
  process.env.JWT_SECRET ||
  "34567890iuyghjkhgfehjkjhrtyoiu5787iuujhdfhjhmhgdfgjfhj"; // Replace the default in .env

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    // Validate input
    if (!phone || !password) {
      return NextResponse.json(
        { message: "Phone and password are required." },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid phone or password." },
        { status: 401 }
      );
    }

    // Check the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid phone or password." },
        { status: 401 }
      );
    }
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role }, // Include the role in the payload
      secret,
      { expiresIn: "30d" } // Token valid for 30 days
    );

    // Create a successful login response
    const response = NextResponse.json(
      {
        message: "Login successful.",
        role: user.role, // Return the role in the response
      },
      { status: 200 }
    );

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
    // Log the error and return a response
    console.error("Login error:", error.message);

    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from jose

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // console.log('Token:', token); // Check if the token is retrieved

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Decode the token using jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "default_secret")
    );
    // console.log('Decoded Token:', payload); // Log the decoded token

    // Check if the user role is admin
    if (payload.role !== "admin" && payload.role !== "user") {
      // console.log('Unauthorized Access: Role is not admin', payload.role); // Log the role
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    // console.error('Token verification failed:', error); // Log the error
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/add-book/",
    "/competitions",
    "/reading-reports",
    "/submit-content",
  ],
};

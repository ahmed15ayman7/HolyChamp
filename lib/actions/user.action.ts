"use server";
import { cookies } from "next/headers";
export async function getUserData() {
  const cookieStore = cookies();
  const userDataCookie = (await cookieStore).get("userData");

  // console.error("iiiiiiiiiiiii-----",userDataCookie)
  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie.value);
      // console.log(userData)
      return userData;
    } catch (error) {
      console.error("Error parsing user data cookie:", error);
    }
  }
  return null;
}
export async function SignOut() {
  const cookieStore = cookies();
  (await cookieStore).delete("userData");
  (await cookieStore).delete("authToken");

  return null;
}

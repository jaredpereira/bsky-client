import { NextResponse } from "next/server";
export async function GET(request: Request) {
  let response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete("token");
  return response;
}

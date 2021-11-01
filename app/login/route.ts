import { BskyAgent } from "@atproto/api";
import { NextResponse } from "next/server";

export const runtime = "experimental-edge";
export async function POST(request: Request) {
  let data = (await request.json()) as { username?: string; password?: string };
  const agent = new BskyAgent({ service: "https://bsky.social" });

  if (!data.username || !data.password) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  let session = await agent.com.atproto.server.createSession({
    identifier: data.username,
    password: data.password,
  });

  let response = NextResponse.json({ success: true });
  response.cookies.set("token", JSON.stringify(session));
  return response;
}

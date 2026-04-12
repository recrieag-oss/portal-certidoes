import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  const raw = cookies().get("admin-session-id")?.value;
  if (raw) await deleteSession(raw);

  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-session-id");
  return response;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function PortalLoginPage() {
  // Already logged in? Send straight to the dashboard.
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (session?.role === "client") redirect("/portal");

  return <LoginForm />;
}

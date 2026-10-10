import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";
import ChatClient from "./ChatClient";

export default async function ChatPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login?returnTo=/chat");

  return (
    <div style={{minHeight:"100vh"}}>
      <Navbar app />
      <ChatClient
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? session.user.sub ?? ""}
      />
    </div>
  );
}

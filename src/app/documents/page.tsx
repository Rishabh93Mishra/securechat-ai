import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login?returnTo=/documents");

  return (
    <div style={{minHeight:"100vh"}}>
      <Navbar app />
      <DocumentsClient
        userEmail={session.user.email ?? session.user.sub ?? ""}
        userName={session.user.name ?? "User"}
      />
    </div>
  );
}

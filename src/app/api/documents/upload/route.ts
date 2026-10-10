import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth0 } from "@/lib/auth0";
import { grantDocumentAccess, grantPublicAccess } from "@/lib/fga";
import { saveDocument } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 160) : "";
    const content = typeof body.content === "string" ? body.content.trim().slice(0, 100000) : "";
    const isPublic = body.isPublic === true;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required." }, { status: 400 });
    }

    const ownerId = session.user.email ?? session.user.sub ?? "unknown-user";
    const id = `doc_${randomUUID().replaceAll("-", "").slice(0, 16)}`;

    await saveDocument({
      id, name, content, ownerId, isPublic, createdAt: new Date().toISOString()
    });

    try {
      await grantDocumentAccess(ownerId, id);
      if (isPublic) await grantPublicAccess(id);
    } catch {
      // FGA is optional. Owner access still works without it.
    }

    return NextResponse.json({ success: true, documentId: id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save the document." }, { status: 500 });
  }
}

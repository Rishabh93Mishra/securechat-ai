import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getAllDocuments } from "@/lib/db";
import { checkDocumentAccess } from "@/lib/fga";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userId = session.user.email ?? session.user.sub ?? "";
    const docs = await getAllDocuments();

    const visible = await Promise.all(docs.map(async (doc) => {
      if (doc.isPublic) return { ...doc, access: "public" as const };
      if (doc.ownerId === userId) return { ...doc, access: "owner" as const };

      const allowed = await checkDocumentAccess(userId, doc.id);
      return allowed ? { ...doc, access: "shared" as const } : null;
    }));

    return NextResponse.json(visible.filter(Boolean));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load documents." }, { status: 500 });
  }
}

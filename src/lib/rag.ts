import { getAllDocuments, searchDocuments } from "./db";
import { checkDocumentAccess } from "./fga";

export interface RetrievedDocument {
  id: string;
  name: string;
  content: string;
}

export async function retrieveAuthorizedDocuments(
  query: string,
  userEmail: string
): Promise<RetrievedDocument[]> {
  const candidates = await searchDocuments(query);
  const all = await getAllDocuments();

  // For broad questions, give the model a small set of accessible docs.
  const sourceDocs = candidates.length ? candidates : all.slice(0, 8);
  const results: RetrievedDocument[] = [];

  for (const doc of sourceDocs) {
    if (doc.isPublic || doc.ownerId === userEmail) {
      results.push({ id: doc.id, name: doc.name, content: doc.content });
      continue;
    }

    // FGA is optional. If configured, it can grant access to shared docs.
    const allowed = await checkDocumentAccess(userEmail, doc.id);
    if (allowed) {
      results.push({ id: doc.id, name: doc.name, content: doc.content });
    }
  }

  return results.slice(0, 6);
}

export function buildContext(docs: RetrievedDocument[]): string {
  return docs
    .map((doc) => `[Document: ${doc.name}]\n${doc.content}`)
    .join("\n\n---\n\n");
}

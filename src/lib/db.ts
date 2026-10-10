import fs from "node:fs";
import path from "node:path";

export interface Document {
  id: string;
  name: string;
  content: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "documents.json");

const seedDocuments: Document[] = [
  {
    id: "doc_public_001",
    name: "Company Overview",
    content:
      "SecureChat AI is a secure AI workspace built with Next.js, Auth0 and Gemini. It lets teams chat with AI while controlling access to their knowledge base.",
    ownerId: "system",
    isPublic: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "doc_public_002",
    name: "Product FAQ",
    content:
      "SecureChat AI supports Gemini through the Google AI SDK. Authentication is handled by Auth0. Optional Auth0 FGA can provide fine-grained access to private documents.",
    ownerId: "system",
    isPublic: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function localRead(): Document[] {
  try {
    if (!fs.existsSync(dataFile)) return [...seedDocuments];
    return JSON.parse(fs.readFileSync(dataFile, "utf8")) as Document[];
  } catch {
    return [...seedDocuments];
  }
}

function localWrite(docs: Document[]) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(docs, null, 2), "utf8");
}

async function supabaseRequest(
  method: string,
  table: string,
  body?: unknown,
  query = ""
) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return [];
  return (await response.json()) as Document[];
}

export async function saveDocument(doc: Document): Promise<void> {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await supabaseRequest("POST", "documents", doc);
    return;
  }

  const docs = localRead().filter((item) => item.id !== doc.id);
  docs.push(doc);
  localWrite(docs);
}

export async function getAllDocuments(): Promise<Document[]> {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const rows = await supabaseRequest(
      "GET",
      "documents",
      undefined,
      "?select=*&order=createdAt.desc"
    );
    return rows ?? [];
  }
  return localRead();
}

export async function getDocumentsByOwner(ownerId: string): Promise<Document[]> {
  const docs = await getAllDocuments();
  return docs.filter((d) => d.ownerId === ownerId);
}

export async function searchDocuments(query: string): Promise<Document[]> {
  const docs = await getAllDocuments();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2);

  if (!terms.length) return docs;

  return docs
    .map((doc) => {
      const haystack = `${doc.name} ${doc.content}`.toLowerCase();
      const score = terms.reduce(
        (sum, term) => sum + (haystack.includes(term) ? 1 : 0),
        0
      );
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.doc);
}

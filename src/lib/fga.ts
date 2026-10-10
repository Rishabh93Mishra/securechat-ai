import { CredentialsMethod, OpenFgaClient } from "@openfga/sdk";

let fgaClient: OpenFgaClient | null = null;

export function isFgaConfigured() {
  return Boolean(
    process.env.FGA_STORE_ID &&
      process.env.FGA_CLIENT_ID &&
      process.env.FGA_CLIENT_SECRET &&
      process.env.AUTH0_DOMAIN
  );
}

function getFgaClient() {
  if (!isFgaConfigured()) return null;

  if (!fgaClient) {
    fgaClient = new OpenFgaClient({
      apiUrl: process.env.FGA_API_URL ?? "https://api.us1.fga.dev",
      storeId: process.env.FGA_STORE_ID!,
      credentials: {
        method: CredentialsMethod.ClientCredentials,
        config: {
          clientId: process.env.FGA_CLIENT_ID!,
          clientSecret: process.env.FGA_CLIENT_SECRET!,
          apiAudience:
            process.env.FGA_API_AUDIENCE ?? "https://api.us1.fga.dev/",
          apiTokenIssuer: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        },
      },
    });
  }

  return fgaClient;
}

export async function checkDocumentAccess(
  userId: string,
  documentId: string
): Promise<boolean> {
  const client = getFgaClient();
  if (!client) return false;

  try {
    const result = await client.check({
      user: `user:${userId}`,
      relation: "can_view",
      object: `doc:${documentId}`,
    });
    return result.allowed ?? false;
  } catch {
    return false;
  }
}

export async function grantDocumentAccess(
  userId: string,
  documentId: string
): Promise<void> {
  const client = getFgaClient();
  if (!client) return;

  await client.write({
    writes: [
      {
        user: `user:${userId}`,
        relation: "owner",
        object: `doc:${documentId}`,
      },
    ],
  });
}

export async function grantPublicAccess(documentId: string): Promise<void> {
  const client = getFgaClient();
  if (!client) return;

  await client.write({
    writes: [
      {
        user: "user:*",
        relation: "viewer",
        object: `doc:${documentId}`,
      },
    ],
  });
}


import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth0 } from "@/lib/auth0";
import {
  retrieveAuthorizedDocuments,
  buildContext,
} from "@/lib/rag";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        "GOOGLE_GENERATIVE_AI_API_KEY is not configured.",
        { status: 503 }
      );
    }

    const body = await req.json();
    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

    const userEmail = session.user.email ?? session.user.sub ?? "";
    const userName = session.user.name ?? "User";

    const lastUser = [...messages].reverse().find(
      (m: { role?: string; content?: unknown }) =>
        m?.role === "user"
    );

    const query =
      typeof lastUser?.content === "string"
        ? lastUser.content
        : "";

    const docs = query
      ? await retrieveAuthorizedDocuments(query, userEmail)
      : [];

    const context = buildContext(docs);

    const system = `You are SecureChat AI, a secure assistant for ${userName}.
Be helpful, accurate and concise.
Never invent information from private documents.
Only use the document context below if it is present. It has already been filtered for the user's authorization.
If you use a document, cite its name naturally.
${
  context
    ? `\nAUTHORIZED KNOWLEDGE:\n${context}`
    : "\nNo matching authorized knowledge was found."
}`;

    const result = streamText({
      model: google(
        process.env.GEMINI_MODEL || "gemini-2.5-flash"
      ),
      system,
      messages,
      onError({ error }) {
        console.error("Gemini streaming error:", error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat route error:", error);

    return new Response(
      "Unable to process the chat request.",
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

function clean(value: unknown, max: number) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = clean(body.name, 80);
    const email = clean(body.email, 160);
    const message = clean(body.message, 4000);

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: "Name, email and message are required.",
        },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      return NextResponse.json(
        {
          error:
            "Contact email is not configured. Add RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL to .env.local.",
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `SecureChat contact from ${name}`,
        text: `Name: ${name}
Email: ${email}

${message}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Resend API error:", errorText);

      return NextResponse.json(
        {
          error: "Email provider rejected the message.",
          details:
            process.env.NODE_ENV === "development"
              ? errorText
              : undefined,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your request.",
      },
      { status: 500 }
    );
  }
}
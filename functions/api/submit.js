import { EmailMessage } from "cloudflare:email";

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const text = await request.text();
    const params = new URLSearchParams(text);
    const formName = params.get("form-name");

    let subject, body;

    if (formName === "contact") {
      const name = params.get("name") || "(no name)";
      const contact = params.get("contact") || "(no contact)";
      const message = params.get("message") || "";
      subject = `[OLI Ads] New contact from ${name}`;
      body = `Name: ${name}\nEmail / phone: ${contact}${message ? `\n\nMessage:\n${message}` : ""}`;
    } else if (formName === "vendor") {
      const name = params.get("name") || "(no name)";
      const business = params.get("business") || "(no business)";
      const email = params.get("email") || "(no email)";
      const trade = params.get("trade") || "(not specified)";
      subject = `[OLI Ads] Vendor application — ${name}, ${business}`;
      body = `Name: ${name}\nBusiness: ${business}\nEmail: ${email}\nService category: ${trade}`;
    } else {
      return new Response("Bad Request", { status: 400 });
    }

    const rawEmail = [
      `MIME-Version: 1.0`,
      `From: OLI Ads Website <noreply@oli-ads.biz>`,
      `To: hello@oli-ads.biz`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      body,
    ].join("\r\n");

    const message = new EmailMessage(
      "noreply@oli-ads.biz",
      "hello@oli-ads.biz",
      rawEmail
    );
    await env.SEND_EMAIL.send(message);

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Form submission error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

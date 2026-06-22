export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body));
    const formName = params["form-name"] || "unknown";

    let subject, message;
    if (formName === "contact") {
      subject = "New Contact Form Submission — OLI Ads";
      message = `Name: ${params.name}\nContact: ${params.contact}\n\nMessage:\n${params.message}`;
    } else if (formName === "vendor") {
      subject = "New Vendor Inquiry — OLI Ads";
      message = `Name: ${params.name}\nBusiness: ${params.business}\nEmail: ${params.email}\nTrade: ${params.trade}`;
    } else {
      subject = "New Form Submission — OLI Ads";
      message = JSON.stringify(params, null, 2);
    }

    const res = await fetch("https://formsubmit.co/ajax/hello@oli-ads.biz", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ subject, message }),
    });

    if (res.ok) {
      return new Response("OK", { status: 200 });
    } else {
      return new Response("Upstream error", { status: 502 });
    }
  } catch (err) {
    console.error("Form relay error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

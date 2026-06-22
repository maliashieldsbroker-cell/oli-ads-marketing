const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzLUUW30ZQbsQ_-hLoQcUtX9zCum7YKRbi2CvZ2iPR1rhTSWamJR1Daha2WYA--rl9K/exec";

export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.text();

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (response.ok) {
      return new Response("OK", { status: 200 });
    } else {
      return new Response("Upstream error", { status: 502 });
    }
  } catch (err) {
    console.error("Form relay error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

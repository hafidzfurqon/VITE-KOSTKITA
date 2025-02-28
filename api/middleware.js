export default async function middleware(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const userAgent = req.headers.get("user-agent") || "";

  // Daftar user-agent bot yang perlu di-prerender
  const botUserAgents = [
    "googlebot",
    "bingbot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "telegrambot",
    "whatsapp",
    "discordbot"
  ];

  const isBot = botUserAgents.some(bot => userAgent.toLowerCase().includes(bot));

  if (isBot) {
    const prerenderToken = "rAOWKB0nsSTranJ7stuh"; // Ganti dengan token asli kamu
    const prerenderUrl = `https://service.prerender.io/${url.href}`;

    try {
      const response = await fetch(prerenderUrl, {
        headers: { "X-Prerender-Token": prerenderToken }
      });

      return new Response(await response.text(), {
        status: response.status,
        headers: { "Content-Type": "text/html" }
      });
    } catch (error) {
      console.error("Prerender Error:", error);
      return new Response("Error fetching prerendered page", { status: 500 });
    }
  }

  // Redirect ke halaman utama jika bukan bot
  return Response.redirect(url.origin + pathname, 307);
}

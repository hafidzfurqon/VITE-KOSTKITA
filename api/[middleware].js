export default async function middleware(req) {
  const url = req.nextUrl.pathname;
  const userAgent = req.headers.get("user-agent") || "";
  
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
      const prerenderUrl = `https://service.prerender.io/${url}`;

      const response = await fetch(prerenderUrl, {
          headers: { "X-Prerender-Token": prerenderToken }
      });

      return new Response(await response.text(), {
          status: response.status,
          headers: { "Content-Type": "text/html" }
      });
  }

  return new Response(null, { status: 200 });
}

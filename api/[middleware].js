export default async function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const botUserAgents = [
      "googlebot", "bingbot", "facebookexternalhit",
      "twitterbot", "linkedinbot", "slackbot",
      "telegrambot", "whatsapp", "discordbot"
  ];

  const isBot = botUserAgents.some(bot => userAgent.toLowerCase().includes(bot));

  if (isBot) {
      const prerenderToken = "rAOWKB0nsSTranJ7stuh"; // Ganti dengan token asli kamu
      const prerenderUrl = `https://service.prerender.io${req.url}`;

      const response = await fetch(prerenderUrl, {
          headers: { "X-Prerender-Token": prerenderToken }
      });

      const html = await response.text();
      res.setHeader("Content-Type", "text/html");
      res.status(response.status).send(html);
      return;
  }

  res.status(404).send("Not Found");
}

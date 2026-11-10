const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

module.exports = (req, res) => {
  const required = ["TABLEAU_CLIENT_ID", "TABLEAU_SECRET_ID", "TABLEAU_SECRET_VALUE", "TABLEAU_USER"];
  const missing = required.filter((name) => !process.env[name]);
  res.setHeader("Cache-Control", "no-store");

  if (missing.length) {
    res.status(500).json({ error: "Missing environment variables: " + missing.join(", ") });
    return;
  }

  const clientId = process.env.TABLEAU_CLIENT_ID.trim();
  const token = jwt.sign(
    {
      iss: clientId,
      sub: process.env.TABLEAU_USER.trim(),
      aud: "tableau",
      exp: Math.floor(Date.now() / 1000) + 5 * 60,
      jti: randomUUID(),
      scp: ["tableau:views:embed"],
    },
    process.env.TABLEAU_SECRET_VALUE.trim(),
    {
      algorithm: "HS256",
      header: { kid: process.env.TABLEAU_SECRET_ID.trim(), iss: clientId },
    }
  );

  res.status(200).json({ token });
};

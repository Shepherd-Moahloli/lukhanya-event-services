import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.WA_TOKEN; // WhatsApp Cloud API token
const PHONE_ID = process.env.PHONE_NUMBER_ID; // phone_number_id from Meta

if (!TOKEN || !PHONE_ID) {
  console.error("Missing WA_TOKEN or PHONE_NUMBER_ID in .env");
  process.exit(1);
}

app.post("/api/send-wa", async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message)
      return res.status(400).json({ error: "to and message required" });

    const payload = {
      messaging_product: "whatsapp",
      to: to, // digits only, e.g. "27784680610"
      text: { body: message },
    };

    const resp = await fetch(
      `https://graph.facebook.com/v16.0/${PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await resp.json();
    if (!resp.ok) return res.status(500).json({ error: data });

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`WA sender listening on ${PORT}`));

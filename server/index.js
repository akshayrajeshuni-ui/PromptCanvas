require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/optimize", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const formattedMessages = req.body.messages.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.text,
    }));

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: formattedMessages,
    });

    const result = response.output_text;

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
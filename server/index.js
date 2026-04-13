require("dotenv").config();

const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/optimize", (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let result = "";

    if (prompt.includes("Compare these two prompts")) {
      result = `
Comparison Result:

👉 Better Prompt: Prompt A

Reason:
- More clarity
- Better structure
- More descriptive
`;
    } 
    else if (prompt.includes("Create a detailed prompt")) {
      result = `
Generated Prompt:

Create a detailed explanation about "${prompt}" with examples.
`;
    } 
    else {
      result = `
Improved Prompt:

Explain "${prompt}" clearly with examples and real-world use.
`;
    }

    res.json({ result });

  } catch (error) {
    res.status(500).json({ error: "Error occurred" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
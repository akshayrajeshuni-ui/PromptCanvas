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
  res.json({ result: "Hello from backend" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
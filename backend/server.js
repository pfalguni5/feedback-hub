const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./feedback.json";

function loadFeedback() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  return JSON.parse(fs.readFileSync(FILE));
}

app.get("/api/feedback", (req, res) => {
  res.json(loadFeedback());
});

app.post("/api/feedback", (req, res) => {
  const { name, message } = req.body;
  if (!name || !message)
    return res.status(400).json({ error: "Missing fields" });

  const feedback = loadFeedback();
  const newEntry = { id: Date.now(), name, message };
  feedback.push(newEntry);
  fs.writeFileSync(FILE, JSON.stringify(feedback, null, 2));
  res.status(201).json(newEntry);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

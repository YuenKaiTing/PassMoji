// server.js
const express = require("express");
const argon2 = require("argon2");
const cors = require("cors");
const path = require("path");

const app = express();

// If your frontend is served from a different origin, enable CORS
// (Adjust the origin in production if needed)
app.use(cors({
  origin: "*", // or specify your frontend domain like "http://localhost:3000"
}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.listen(9000);

// Built-in body parsing in modern Express:
app.use(express.json());

// In-memory user store: { username: { hash: '...' } }
const users = {};

/**
 * POST /api/register
 * Request body: { "username": "", "password": "" }
 */
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Normalize the password to handle emoji/unicode properly
    const normalizedPassword = password.normalize("NFC");

    // Hash the password using argon2
    const hash = await argon2.hash(normalizedPassword);

    // Save user in memory (demo only)
    // In production, store user in a real database with utf8mb4 support
    users[username] = { hash };

    return res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/login
 * Request body: { "username": "", "password": "" }
 */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userData = users[username];
    if (!userData) {
      // User not found
      return res.json({ success: false, message: "User not found" });
    }

    // Normalize the password
    const normalizedPassword = password.normalize("NFC");

    // Verify password hash
    const validPassword = await argon2.verify(userData.hash, normalizedPassword);
    if (!validPassword) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // If you want to issue a token, do it here
    // e.g. const token = jwt.sign({ username }, "secretKey");
    // but for now, just return success

    return res.json({ success: true, message: "Login success" });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

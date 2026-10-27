
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set a strong JWT_SECRET of at least 32 characters in .env");
}

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_ORIGIN ||
  "http://127.0.0.1:5500")
  .split(",")
  .map(origin => origin.trim());

app.use(cors({
  origin(origin, callback) {
    // Requests without Origin include tools such as curl/Postman.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  }
}));

app.use(express.json({ limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "MindShelf API" });
});

const path = require("path");

app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/collections", require("./routes/collections"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/knowledge", require("./routes/knowledge"));

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MindShelf API running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });

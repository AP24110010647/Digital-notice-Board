import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  }
};

const io = new Server(server, {
  cors: {
    origin: Array.from(allowedOrigins),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then((connected) => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!connected) {
        console.log("MongoDB is required for authentication and protected notice routes.");
      }
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

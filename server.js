const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    credentials: false,
  })
);

app.use(express.json());

const trackingData = new Map();
const senderAccessTimes = new Map(); // Track sender access patterns
const receiverEvents = new Map(); // Only store receiver events

// Enhanced function to detect sender vs receiver
function logTrackingData(trackingId, req) {
  const timestamp = Date.now();
  const userAgent = req.get("User-Agent") || "";
  const ip = req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
  const referer = req.get("Referer") || "";

  console.log(`🔍 DEBUG - TrackingId: ${trackingId}`);
  console.log(`🔍 DEBUG - UserAgent: ${userAgent}`);
  console.log(`🔍 DEBUG - Referer: ${referer}`);

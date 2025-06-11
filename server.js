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

  // Enhanced bot detection - EXCLUDE Google Image Proxy from bot detection
  const isBot =
    (userAgent.toLowerCase().includes("bot") ||
      userAgent.toLowerCase().includes("crawler") ||
      userAgent.toLowerCase().includes("spider") ||
      userAgent.toLowerCase().includes("gmail") ||
      userAgent.toLowerCase().includes("outlook")) &&
    !userAgent.includes("GoogleImageProxy") &&
    !userAgent.includes("ggpht.com");

  // Enhanced real browser detection - INCLUDE Google Image Proxy as legitimate
  const isRealBrowser =
    userAgent.includes("GoogleImageProxy") ||
    userAgent.includes("ggpht.com") ||
    (userAgent.includes("Mozilla") &&
      (userAgent.includes("Chrome") ||
        userAgent.includes("Firefox") ||
        userAgent.includes("Safari")) &&
      !isBot);

  console.log(`🔍 DEBUG - isBot: ${isBot}, isRealBrowser: ${isRealBrowser}`);

  // Sender detection patterns
  const isSenderAccess =
    // Gmail compose/sent folder patterns
    (referer.includes("mail.google.com") &&
      (referer.includes("compose") || referer.includes("sent"))) ||
    // Outlook compose patterns
    (referer.includes("outlook") && referer.includes("compose")) ||
    // Very quick access (likely sender checking)
    (senderAccessTimes.has(trackingId) &&
      timestamp - senderAccessTimes.get(trackingId) < 5000) ||
    // Known email client prefetch patterns
    userAgent.includes("Thunderbird") ||
    userAgent.includes("Mail/");

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import axios from "axios";
import NodeCache from "node-cache";
import rateLimit from "express-rate-limit";

const app = express();

// Cache (10 min default)
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 600,
});

// ─── Middleware ─────────────────────────────
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET"],
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

// ─── Config ────────────────────────────────
const OWM_BASE = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Check API key
if (!API_KEY) {
  console.log("❌ Missing OPENWEATHER_API_KEY in .env");
}

// ─── Helper Function ───────────────────────
const fetchWeather = async (endpoint, params) => {
  const { data } = await axios.get(`${OWM_BASE}/${endpoint}`, {
    params: {
      ...params,
      appid: API_KEY,
      units: "metric",
    },
    timeout: 8000,
  });
  return data;
};

const getCacheKey = (prefix, query) =>
  `${prefix}:${JSON.stringify(query).toLowerCase()}`;

// ─── Routes ────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiKey: API_KEY ? "✅ Set" : "❌ Missing",
    time: new Date().toISOString(),
  });
});

// Current weather
app.get("/api/weather/current", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: "Provide city or lat & lon" });
    }

    const params = city ? { q: city } : { lat, lon };
    const key = getCacheKey("current", params);

    const cached = cache.get(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const data = await fetchWeather("weather", params);
    cache.set(key, data);

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

// Forecast
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: "Provide city or lat & lon" });
    }

    const params = city ? { q: city } : { lat, lon };
    const key = getCacheKey("forecast", params);

    const cached = cache.get(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const data = await fetchWeather("forecast", params);
    cache.set(key, data);

    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
});

// Combined
app.get("/api/weather/full", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: "Provide city or lat & lon" });
    }

    const params = city ? { q: city } : { lat, lon };
    const key = getCacheKey("full", params);

    const cached = cache.get(key);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const [current, forecast] = await Promise.all([
      fetchWeather("weather", params),
      fetchWeather("forecast", params),
    ]);

    const result = {
      current,
      forecast,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(key, result);

    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// ─── Error Handler ─────────────────────────
function handleError(res, err) {
  console.error("Error:", err.message);

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    if (status === 401)
      return res.status(401).json({ error: "Invalid API key" });

    if (status === 404)
      return res.status(404).json({ error: "City not found" });

    if (status === 429)
      return res.status(429).json({ error: "Rate limit exceeded" });
  }

  res.status(500).json({ error: "Server error" });
}

// ─── Start Server ──────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// src/utils/api.js

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export const weatherApi = {
  // Full weather (current + forecast)
  byCity: (city) =>
    request(`/api/weather/full?city=${encodeURIComponent(city)}`),

  byCoords: (lat, lon) =>
    request(`/api/weather/full?lat=${lat}&lon=${lon}`),

  health: () => request("/api/health"),
};
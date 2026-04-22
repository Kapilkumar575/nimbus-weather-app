// src/utils/weather.js

export const weatherCodeMap = {
  Thunderstorm: { emoji: "⛈", label: "Thunderstorm" },
  Drizzle: { emoji: "🌦", label: "Drizzle" },
  Rain: { emoji: "🌧", label: "Rain" },
  Snow: { emoji: "❄️", label: "Snow" },
  Mist: { emoji: "🌫", label: "Mist" },
  Smoke: { emoji: "🌫", label: "Smoke" },
  Haze: { emoji: "🌫", label: "Haze" },
  Dust: { emoji: "🌪", label: "Dust" },
  Fog: { emoji: "🌫", label: "Fog" },
  Sand: { emoji: "🌪", label: "Sand" },
  Ash: { emoji: "🌋", label: "Ash" },
  Squall: { emoji: "💨", label: "Squall" },
  Tornado: { emoji: "🌪", label: "Tornado" },
  Clear: { emoji: "☀️", label: "Clear" },
  Clouds: { emoji: "☁️", label: "Cloudy" },
};

export const getWeatherMeta = (main) =>
  weatherCodeMap[main] || { emoji: "🌡", label: main };

export const msToBft = (ms) => {
  if (ms < 0.3) return 0;
  if (ms < 1.6) return 1;
  if (ms < 3.4) return 2;
  if (ms < 5.5) return 3;
  if (ms < 8.0) return 4;
  if (ms < 10.8) return 5;
  if (ms < 13.9) return 6;
  if (ms < 17.2) return 7;
  if (ms < 20.8) return 8;
  if (ms < 24.5) return 9;
  if (ms < 28.5) return 10;
  if (ms < 32.7) return 11;
  return 12;
};

export const msToKph = (ms) => (ms * 3.6).toFixed(1);

export const formatTime = (unixTs, timezone) => {
  const d = new Date((unixTs + timezone) * 1000);
  return d.toUTCString().slice(17, 22); // HH:MM
};

export const formatDay = (unixTs) => {
  const d = new Date(unixTs * 1000);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export const formatHour = (unixTs) => {
  const d = new Date(unixTs * 1000);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

/**
 * Collapse the 3-hour forecast list into daily summaries.
 * Returns an array of { date, min, max, main, description, emoji, icon }
 */
export const groupForecastByDay = (list) => {
  const days = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!days[date]) {
      days[date] = {
        dt: item.dt,
        date,
        temps: [],
        mains: {},
        descriptions: {},
        icons: {},
      };
    }
    days[date].temps.push(item.main.temp);
    const m = item.weather[0].main;
    days[date].mains[m] = (days[date].mains[m] || 0) + 1;
    days[date].descriptions[item.weather[0].description] =
      (days[date].descriptions[item.weather[0].description] || 0) + 1;
    days[date].icons[item.weather[0].icon] =
      (days[date].icons[item.weather[0].icon] || 0) + 1;
  });

  return Object.values(days).map((d) => {
    const main = Object.entries(d.mains).sort((a, b) => b[1] - a[1])[0][0];
    const description = Object.entries(d.descriptions).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const icon = Object.entries(d.icons).sort((a, b) => b[1] - a[1])[0][0];
    return {
      dt: d.dt,
      date: d.date,
      min: Math.round(Math.min(...d.temps)),
      max: Math.round(Math.max(...d.temps)),
      main,
      description,
      icon,
      emoji: getWeatherMeta(main).emoji,
    };
  });
};

export const uvIndex = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "#4ade80" };
  if (uvi <= 5) return { label: "Moderate", color: "#facc15" };
  if (uvi <= 7) return { label: "High", color: "#fb923c" };
  if (uvi <= 10) return { label: "Very High", color: "#f87171" };
  return { label: "Extreme", color: "#c084fc" };
};
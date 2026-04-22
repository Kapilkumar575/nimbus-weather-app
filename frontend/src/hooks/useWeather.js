// src/hooks/useWeather.js

import { useState, useCallback } from "react";
import { weatherApi } from "../utils/api";

const HISTORY_KEY = "weather_search_history";

// Load history safely
const loadHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save history
const saveHistory = (history) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  // Save recent searches (max 5)
  const pushHistory = (city) => {
    setHistory((prev) => {
      const next = [city, ...prev.filter((c) => c !== city)].slice(0, 5);
      saveHistory(next);
      return next;
    });
  };

  // Fetch by city
  const fetchByCity = useCallback(async (city) => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await weatherApi.byCity(city);
      setWeather(data);
      pushHistory(data.current.name);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch by location
  const fetchByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await weatherApi.byCoords(
            coords.latitude,
            coords.longitude
          );
          setWeather(data);
          pushHistory(data.current.name);
        } catch (err) {
          setError(err.message);
          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  }, []);

  const clearError = () => setError(null);

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return {
    weather,
    loading,
    error,
    history,
    fetchByCity,
    fetchByLocation,
    clearError,
    clearHistory,
  };
};
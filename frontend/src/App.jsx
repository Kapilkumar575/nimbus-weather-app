import { useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSkeleton from "./components/LoadingSkeleton";

const DEMO_CITY = "London";

export default function App() {
  const {
    weather,
    loading,
    error,
    history,
    fetchByCity,
    fetchByLocation,
    clearError,
    clearHistory,
  } = useWeather();

  useEffect(() => {
    fetchByCity(DEMO_CITY);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4">

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 text-white">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">☁ Nimbus Weather</h1>
          <p className="text-sm opacity-80">
            Real-time weather at your fingertips
          </p>
        </div>

        {/* Search */}
        <SearchBar
          onSearch={fetchByCity}
          onLocate={fetchByLocation}
          history={history}
          onHistoryClick={fetchByCity}
          onClearHistory={clearHistory}
          loading={loading}
        />

        {/* Error */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* Content */}
        <div className="mt-6 space-y-6">

          {loading ? (
            <LoadingSkeleton />
          ) : weather ? (
            <>
              <CurrentWeather data={weather.current} />
              <Forecast data={weather.forecast} />

              <p className="text-xs text-center opacity-70">
                {weather.fromCache ? "⚡ Cached · " : ""}
                Updated{" "}
                {new Date(
                  weather.fetchedAt || Date.now()
                ).toLocaleTimeString()}
              </p>
            </>
          ) : (
            !error && (
              <div className="text-center mt-10">
                <p className="text-5xl">🌍</p>
                <p className="mt-2">
                  Search a city or use your location
                </p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
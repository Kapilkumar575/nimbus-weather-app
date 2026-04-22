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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex flex-col items-center px-4 py-6 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>

      {/* Container */}
      <div className="w-full max-w-3xl z-10">

        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
            ☁ Nimbus
          </h1>
          <p className="text-sm opacity-80">
            Real-time weather at your fingertips
          </p>
        </header>

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
        <main className="mt-6 flex flex-col items-center gap-6">

          {loading ? (
            <LoadingSkeleton />
          ) : weather ? (
            <>
              <CurrentWeather data={weather.current} />
              <Forecast data={weather.forecast} />

              {/* Cache Info */}
              <p className="text-xs opacity-80">
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
                  Search for a city or use your location
                </p>
              </div>
            )
          )}

        </main>
      </div>
    </div>
  );
}
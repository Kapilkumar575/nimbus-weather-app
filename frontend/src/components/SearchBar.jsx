import { useState } from "react";

export default function SearchBar({
  onSearch,
  onLocate,
  history = [],
  onHistoryClick,
  onClearHistory,
  loading,
}) {
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setShowHistory(false);
    }
  };

  return (
    <div className="relative">

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded text-black"
          placeholder="Search city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 150)}
        />

        <button
          className="bg-white text-blue-600 px-4 py-2 rounded"
          disabled={loading}
        >
          Search
        </button>

        <button
          type="button"
          onClick={onLocate}
          className="bg-yellow-400 px-3 rounded"
        >
          📍
        </button>
      </form>

      {showHistory && history.length > 0 && (
        <div className="absolute w-full bg-white text-black rounded mt-1 shadow">
          {history.map((city) => (
            <div
              key={city}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                onHistoryClick(city);
                setInput(city);
              }}
            >
              🕐 {city}
            </div>
          ))}
          <button
            className="w-full text-red-500 text-sm py-1"
            onClick={onClearHistory}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
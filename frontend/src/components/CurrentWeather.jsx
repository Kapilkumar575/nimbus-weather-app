import { getWeatherMeta, msToKph } from "../utils/weather";

export default function CurrentWeather({ data }) {
  const meta = getWeatherMeta(data.weather[0].main);

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-center">

      <h2 className="text-2xl font-bold">
        {meta.emoji} {data.name}
      </h2>

      <p className="text-5xl font-bold">
        {Math.round(data.main.temp)}°
      </p>

      <p className="capitalize">
        {data.weather[0].description}
      </p>

      <div className="mt-4 flex justify-around text-sm">
        <div>💧 {data.main.humidity}%</div>
        <div>💨 {msToKph(data.wind.speed)} km/h</div>
      </div>

    </div>
  );
}
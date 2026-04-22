import { groupForecastByDay } from "../utils/weather";

export default function Forecast({ data }) {
  const days = groupForecastByDay(data.list).slice(0, 5);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

      {days.map((day) => (
        <div
          key={day.dt}
          className="bg-white/20 backdrop-blur-md p-3 rounded text-center"
        >
          <p>{day.emoji}</p>
          <p>{day.max}°</p>
          <p className="text-xs">{day.min}°</p>
        </div>
      ))}

    </div>
  );
}
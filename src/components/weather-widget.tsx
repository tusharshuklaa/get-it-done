import type { FC } from "react";
import { motion } from "framer-motion";
import { useWeather } from "@/hooks/use-weather";

export const WeatherWidget: FC = () => {
  const { weather, isLoading } = useWeather({
    apiKey: import.meta.env.VITE_WEATHER_API || "",
    defaultCity: "Gurugram",
    updateInterval: 30,
    units: "metric",
  });

  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg relative flex items-end justify-between"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col justify-between h-full">
        <h3 className="text-xl font-semibold">{isLoading ? '- -' : weather?.temperature}<sup>°C</sup></h3>

        <div className="flex flex-col">
          <span className="text-sm">{isLoading ? 'NA' : weather?.cityName}</span>
          <span className="text-xs">Feels like {isLoading ? '- -' : weather?.feelsLike}<sup>°C</sup></span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <img
          src={weather?.iconUrl}
          alt={weather?.description}
          className="w-16 h-16 top-4 right-4"
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          style={{ pointerEvents: "none" }}
        />
      </div>
    </motion.div>
  );
}

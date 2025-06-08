import { WEATHER_CACHE_KEY, WEATHER_DEFAULT_UPDATE_INTERVAL } from "@/utils/constants";
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatTimestamp, getWeatherIconUrl } from "@/utils/weather.utils";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type WeatherData = {
  cityName: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  iconUrl: string;
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex?: number;
  sunrise: string;
  sunset: string;
  lastUpdated: number;
};

type UseWeatherOptions = {
  apiKey: string;
  defaultCity?: string;
  updateInterval?: number; // minutes
  units?: 'metric' | 'imperial' | 'kelvin';
};

type UseWeatherReturn = {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
};

// OpenWeatherMap API response types
type OpenWeatherResponse = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
};

export const useWeather = ({
  apiKey,
  defaultCity = 'London',
  updateInterval = WEATHER_DEFAULT_UPDATE_INTERVAL,
  units = 'metric'
}: UseWeatherOptions): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { saveToStorage, loadFromStorage, clearStorage } = useLocalStorage<WeatherData>(WEATHER_CACHE_KEY);

  // Refs to prevent unnecessary re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Get cached weather data
  const getCachedWeather = useCallback((): WeatherData | null => {
    try {
      const data = loadFromStorage();
      if (!data) return null;

      const now = Date.now();
      const cacheAge = now - data.lastUpdated;

      // Check if cache is still valid (within update interval)
      if (cacheAge < updateInterval * 60 * 1000) {
        return data;
      }

      // Cache expired, remove it
      clearStorage();
      return null;
    } catch (err) {
      console.error('Error reading cached weather data:', err);
      clearStorage();
      return null;
    }
  }, [clearStorage, loadFromStorage, updateInterval]);

  // Cache weather data
  const setCachedWeather = useCallback((data: WeatherData): void => {
    try {
      saveToStorage(data);
    } catch (err) {
      console.error('Error caching weather data:', err);
    }
  }, [saveToStorage]);

  // Get user's current position
  const getCurrentPosition = useCallback((): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      // First try with high accuracy but longer timeout
      const highAccuracyOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 30000, // 30 seconds
        maximumAge: 2 * 60 * 1000 // 2 minutes
      };

      // Fallback options with lower accuracy but faster response
      const fallbackOptions: PositionOptions = {
        enableHighAccuracy: false,
        timeout: 15000, // 15 seconds
        maximumAge: 5 * 60 * 1000 // 5 minutes
      };

      let attemptCount = 0;

      const attemptLocation = (options: PositionOptions) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (err) => {
            attemptCount++;
            console.warn(`Location attempt ${attemptCount} failed:`, err.message);

            let message = 'Unable to retrieve location';
            switch (err.code) {
              case err.PERMISSION_DENIED:
                message = 'Location access denied by user';
                reject(new Error(message));
                return;
              case err.POSITION_UNAVAILABLE:
                message = 'Location information unavailable';
                break;
              case err.TIMEOUT:
                message = 'Location request timed out';
                break;
            }

            // Try with fallback options if first attempt fails and it's not a permission issue
            if (attemptCount === 1 && err.code !== err.PERMISSION_DENIED) {
              console.log('Retrying with fallback options (lower accuracy)...');
              setTimeout(() => attemptLocation(fallbackOptions), 1000);
            } else {
              reject(new Error(message));
            }
          },
          options
        );
      };

      // Start with high accuracy attempt
      attemptLocation(highAccuracyOptions);
    });
  }, []);

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = useCallback(async (
    coordinates?: Coordinates,
    cityName?: string
  ): Promise<WeatherData> => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?';

    if (coordinates) {
      url += `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    } else if (cityName) {
      url += `q=${encodeURIComponent(cityName)}`;
    } else {
      throw new Error('Either coordinates or city name must be provided');
    }

    url += `&appid=${apiKey}&units=${units}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error(`City "${cityName}" not found. Please check the city name.`);
      } else {
        throw new Error(`Weather service error: ${response.status} ${response.statusText}`);
      }
    }

    const data: OpenWeatherResponse = await response.json();

    const weatherData: WeatherData = {
      cityName: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      iconUrl: getWeatherIconUrl(data.weather[0].icon),
      humidity: data.main.humidity,
      feelsLike: Math.round(data.main.feels_like),
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      pressure: data.main.pressure,
      sunrise: formatTimestamp(data.sys.sunrise),
      sunset: formatTimestamp(data.sys.sunset),
      lastUpdated: Date.now()
    };

    return weatherData;
  }, [apiKey, units]);

  // Main function to load weather data
  const loadWeatherData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      // Try to get user's location first
      let weatherData: WeatherData;

      try {
        const coordinates = await getCurrentPosition();
        weatherData = await fetchWeatherData(coordinates);
      } catch (locationError) {
        console.warn('Location access failed, using default city now:', locationError);
        weatherData = await fetchWeatherData(undefined, defaultCity);
      }

      setWeather(weatherData);
      setLastUpdated(new Date(weatherData.lastUpdated));
      setCachedWeather(weatherData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Weather loading error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentPosition, fetchWeatherData, defaultCity, setCachedWeather]);

  // Refresh function for manual updates
  const refresh = useCallback(async (): Promise<void> => {
    await loadWeatherData();
  }, [loadWeatherData]);

  // Setup automatic refresh interval
  const setupInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      loadWeatherData();
    }, updateInterval * 60 * 1000);
  }, [loadWeatherData, updateInterval]);

  // Initialize weather data on mount
  useEffect(() => {
    const initializeWeather = async () => {
      // Check for cached data first
      const cachedData = getCachedWeather();

      if (cachedData && isInitialMount.current) {
        setWeather(cachedData);
        setLastUpdated(new Date(cachedData.lastUpdated));
        setIsLoading(false);
        isInitialMount.current = false;

        // Still setup interval for future updates
        setupInterval();
        return;
      }

      // Load fresh data
      await loadWeatherData();
      isInitialMount.current = false;
      setupInterval();
    };

    initializeWeather();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getCachedWeather, loadWeatherData, setupInterval]);

  // Update interval when it changes
  useEffect(() => {
    if (!isInitialMount.current) {
      setupInterval();
    }
  }, [setupInterval]);

  return {
    weather,
    isLoading,
    error,
    refresh,
    lastUpdated
  };
};

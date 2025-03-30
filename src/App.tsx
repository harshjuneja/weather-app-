import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { SearchHistory } from './components/SearchHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const MAX_HISTORY_ITEMS = 5;

const getWeatherBackground = (weatherCode: string, isDark: boolean) => {
  const baseColors = {
    clear: isDark 
      ? 'from-indigo-900 via-purple-900 to-blue-900'
      : 'from-blue-100 via-blue-50 to-white',
    clouds: isDark
      ? 'from-slate-900 via-gray-800 to-zinc-800'
      : 'from-gray-100 via-gray-50 to-white',
    rain: isDark
      ? 'from-blue-900 via-indigo-900 to-slate-900'
      : 'from-blue-100 via-blue-50 to-gray-100',
    snow: isDark
      ? 'from-slate-800 via-gray-900 to-zinc-900'
      : 'from-blue-50 via-gray-50 to-white',
    thunderstorm: isDark
      ? 'from-purple-900 via-indigo-900 to-slate-900'
      : 'from-purple-100 via-blue-50 to-gray-100',
    default: isDark
      ? 'from-slate-900 via-gray-900 to-zinc-900'
      : 'from-blue-50 via-indigo-50 to-white'
  };

  if (!weatherCode) return baseColors.default;
  if (weatherCode.startsWith('01')) return baseColors.clear;
  if (weatherCode.startsWith('02') || weatherCode.startsWith('03') || weatherCode.startsWith('04')) return baseColors.clouds;
  if (weatherCode.startsWith('09') || weatherCode.startsWith('10')) return baseColors.rain;
  if (weatherCode.startsWith('11')) return baseColors.thunderstorm;
  if (weatherCode.startsWith('13')) return baseColors.snow;
  return baseColors.default;
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [searchHistory, isDarkMode]);

  const fetchWeatherData = async (city: string) => {
    setIsLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const weatherData = await weatherResponse.json();
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast');
      }
      
      const forecastData = await forecastResponse.json();
      
      const dailyForecasts = forecastData.list.filter((item: any) => 
        item.dt_txt.includes('12:00:00')
      );

      setWeatherData(weatherData);
      setForecast(dailyForecasts);
      setError('');
      addToHistory(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (weatherData) {
      fetchWeatherData(weatherData.name);
    }
  };

  const addToHistory = (city: string) => {
    setSearchHistory((prev) => {
      const newHistory = [
        { city, timestamp: Date.now() },
        ...prev.filter((item) => item.city !== city),
      ].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  };

  const backgroundGradient = weatherData 
    ? getWeatherBackground(weatherData.weather[0].icon, isDarkMode)
    : getWeatherBackground('', isDarkMode);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient} transition-colors duration-1000`}
      >
        {/* Weather Animation Overlay */}
        {weatherData && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {weatherData.weather[0].icon.startsWith('09') || weatherData.weather[0].icon.startsWith('10') ? (
              <div className="rain-animation opacity-20" />
            ) : weatherData.weather[0].icon.startsWith('13') ? (
              <div className="snow-animation opacity-20" />
            ) : weatherData.weather[0].icon.startsWith('01') ? (
              <div className="sun-animation opacity-20" />
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Weather
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Check weather worldwide
            </p>
          </motion.div>

          <SearchBar onSearch={fetchWeatherData} />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl dark:bg-red-500/20 dark:border-red-500/30"
              >
                <p className="text-red-600 text-center dark:text-red-200">{error}</p>
              </motion.div>
            )}

            {weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <WeatherCard
                  weatherData={weatherData}
                  forecast={forecast}
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <SearchHistory
            history={searchHistory}
            onSelectCity={fetchWeatherData}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

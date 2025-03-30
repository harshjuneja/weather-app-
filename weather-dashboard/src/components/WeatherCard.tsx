import React, { useRef } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { WeatherData } from '../types/weather';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WeatherCardProps {
  weatherData: WeatherData;
  forecast: any[];
  onRefresh: () => void;
  isLoading: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, forecast, onRefresh, isLoading }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!weatherData) return null;

  const getWeatherIcon = (code: string) => {
    // Map weather codes to simple emoji-like icons
    if (code.startsWith('01')) return '☀️';
    if (code.startsWith('02')) return '⛅';
    if (code.startsWith('03') || code.startsWith('04')) return '☁️';
    if (code.startsWith('09') || code.startsWith('10')) return '🌧️';
    if (code.startsWith('11')) return '⛈️';
    if (code.startsWith('13')) return '❄️';
    if (code.startsWith('50')) return '🌫️';
    return '☁️';
  };

  const getDayOfWeek = (date: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(date).getDay()];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {weatherData.name}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <ArrowPathIcon className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Current Weather */}
      <div className="px-6 py-8 text-center">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center gap-6"
        >
          <div className="text-8xl font-light text-gray-800 dark:text-white">
            {Math.round(weatherData.main.temp)}°
          </div>
          <div className="text-6xl">
            {getWeatherIcon(weatherData.weather[0].icon)}
          </div>
        </motion.div>
        <p className="text-xl mt-4 capitalize text-gray-600 dark:text-gray-300">
          {weatherData.weather[0].description}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {format(new Date(), 'EEEE, MMMM d · HH:mm')}
        </p>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 px-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 dark:bg-gray-700/50 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Humidity</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            {weatherData.main.humidity}%
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 dark:bg-gray-700/50 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wind</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white">
            {Math.round(weatherData.wind.speed)} km/h
          </p>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-gray-50 border-t border-gray-100 p-6 dark:bg-gray-700/50 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            5-Day Forecast
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="overflow-x-auto flex gap-4 pb-2 hide-scrollbar"
        >
          {forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-24 p-3 bg-white rounded-xl border border-gray-200 text-center dark:bg-gray-700 dark:border-gray-600"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {getDayOfWeek(day.dt_txt)}
              </p>
              <div className="text-2xl my-2">
                {getWeatherIcon(day.weather[0].icon)}
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {Math.round(day.main.temp)}°
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard; 
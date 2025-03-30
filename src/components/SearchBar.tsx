import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Dubai',
  'Singapore', 'Hong Kong', 'Sydney', 'Toronto', 'Berlin',
  'Mumbai', 'Bangkok', 'Istanbul', 'Moscow', 'Rome'
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    onSearch(city);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={suggestionsRef}>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
        onSubmit={handleSubmit}
      >
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search city..."
            className="w-full h-14 px-12 text-lg bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 text-gray-700 placeholder-gray-400 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300 dark:text-gray-500 dark:group-hover:text-gray-400" />
          </div>
          
          {/* Animated Focus Ring */}
          <motion.div
            initial={false}
            animate={{
              scale: isFocused ? 1 : 0.98,
              opacity: isFocused ? 1 : 0
            }}
            className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 -z-10 blur-lg transition-all duration-300"
          />
        </div>

        <AnimatePresence>
          {isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 dark:bg-gray-800 dark:border-gray-700"
            >
              {suggestions.map((city, index) => (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 transition-all duration-200 dark:hover:bg-gray-700/50 dark:text-gray-200"
                >
                  {city}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Popular Cities */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex flex-wrap justify-center gap-2"
        >
          {popularCities.slice(0, 5).map((city) => (
            <motion.button
              key={city}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick(city)}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {city}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar; 
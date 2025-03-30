import { SearchHistory as SearchHistoryType } from '../types/weather';
import { ClockIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchHistoryProps {
  history: SearchHistoryType[];
  onSelectCity: (city: string) => void;
}

export const SearchHistory = ({ history, onSelectCity }: SearchHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <h3 className="text-xl font-semibold mb-6 gradient-text">Recent Searches</h3>
      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {history.map((item) => (
            <motion.button
              key={item.timestamp}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCity(item.city)}
              className="btn-tertiary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            >
              <ClockIcon className="w-4 h-4 text-purple-400" />
              <span className="text-white/90">{item.city}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 
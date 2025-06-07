import type { FC } from 'react';
import { motion } from 'framer-motion';

type FiltersProps = {
  dateFilter?: string;
  onDateFilterChange: (date: string) => void;
};

export const Filters: FC<FiltersProps> = ({ 
  dateFilter,
  onDateFilterChange,
}) => {
  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <motion.div className="flex gap-2" layout>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="bg-gray-700 rounded p-2 focus:outline-none"
          placeholder="Filter by deadline"
        />
        <button
          onClick={() => onDateFilterChange('')}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Clear Date
        </button>
      </motion.div>
    </div>
  );
};

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { type Task } from '@/services/tasks';

type FiltersProps = {
  filter: 'all' | 'completed' | 'pending';
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  tasks: Array<Task>;
  dateFilter?: string;
  onDateFilterChange: (date: string) => void;
};

export const Filters: FC<FiltersProps> = ({ 
  filter, 
  onFilterChange,
  selectedProject,
  onProjectChange,
  tasks,
  dateFilter,
  onDateFilterChange,
}) => {
  const projects = [...new Set(tasks.map(task => task.project))];

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <motion.div className="flex gap-2" layout>
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <motion.button
            key={f}
            onClick={() => onFilterChange(f)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded ${filter === f ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="flex gap-2" layout>
        <input
          type="date"
          onChange={(e) => onProjectChange(e.target.value)}
          className="bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="bg-gray-700 rounded p-2 focus:outline-none"
        />
        <button
          onClick={() => onDateFilterChange('')}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Clear Date
        </button>
      </motion.div>

      <motion.div className="flex gap-2 flex-wrap" layout>
        <motion.button
          onClick={() => onProjectChange('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded ${selectedProject === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          All Projects
        </motion.button>
        {projects.map((project) => (
          <motion.button
            key={project}
            onClick={() => onProjectChange(project)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded ${selectedProject === project ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            {project}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

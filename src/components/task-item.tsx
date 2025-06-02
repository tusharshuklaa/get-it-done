import type { FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { type Task } from '@/services/tasks';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
};

export const TaskItem: FC<TaskItemProps> = ({ task, onToggle }) => {
  const isOverdue = !task.completed && new Date(task.deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-4 rounded-lg mb-2 flex items-center justify-between 
        ${task.completed ? 'bg-gray-700' : 'bg-gray-800'}
        ${isOverdue && !task.completed ? 'border border-red-500' : ''}`}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${task.completed ? 'text-green-400' : 'text-gray-400'}`}
        >
          {task.completed ? (
            <CheckCircleIcon className="w-6 h-6" />
          ) : (
            <XCircleIcon className="w-6 h-6" />
          )}
        </motion.button>
        <div>
          <p className={`${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
            {task.completionDate && (
              <span className="ml-4">
                Completed: {new Date(task.completionDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className="text-sm bg-gray-700 px-2 py-1 rounded"
      >
        {task.project}
      </motion.span>
    </motion.div>
  );
}
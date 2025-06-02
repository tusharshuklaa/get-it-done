import type { FC } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CheckCircleIcon, CalendarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { type Task } from '@/services/tasks';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
};

export const TaskItem: FC<TaskItemProps> = ({ task, onToggle }) => {
  const isOverdue = !task.completed && new Date(task.deadline) < new Date();
  const itemClasses = clsx(
    "p-4 rounded-lg mb-2 flex items-center justify-between shadow-[inset_5px_0_0_rgba(0,0,0,0.25)]",
    {
      'bg-gray-700': task.completed,
      'bg-gray-800': !task.completed,
      'border-b-1 border-red-500': isOverdue && !task.completed,
      'shadow-blue-500': task.priority === 'low',
      'shadow-yellow-500': task.priority === 'medium',
      'shadow-red-500': task.priority === 'high',
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.01 }}
      className={itemClasses}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${task.completed ? 'text-green-400' : 'text-gray-400'}`}
        >
          {task.completed ? (
            <CheckBadgeIcon className="w-6 h-6" />
          ) : (
              <CheckCircleIcon className="w-6 h-6" />
          )}
        </motion.button>
        <div>
          <p className={clsx("mb-2", {
            "line-through text-gray-400": task.completed,
          })}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-sm text-gray-400">{task.description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <motion.span
          whileHover={{ scale: 1.03 }}
          className={clsx(
            "text-sm text-gray-300 hover:text-white transition-colors duration-100 bg-gray-700 px-2 py-1 rounded",
            {
              "bg-slate-800": task.completed
            }
          )}
        >
          {task.project}
        </motion.span>

        {task.completionDate && (
          <span className="text-sm text-gray-400">
            Completed: {new Date(task.completionDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

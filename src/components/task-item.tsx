import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CheckCircleIcon, CalendarIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { type Task } from '@/services/tasks';
import { PencilIcon } from 'lucide-react';
import { Modal } from './modal';
import { TaskForm } from './task-form';
import { DEFAULT_PROJECT } from '@/utils/constants';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
};

type ProjectNameBadgeProps = {
  completed: boolean;
  projectName: string;
};

const ProjectNameBadge: FC<ProjectNameBadgeProps> = ({ completed, projectName }) => (
  <motion.span
    whileHover={{ scale: 1.03 }}
    className={clsx(
      "text-xs text-gray-300 hover:text-white transition-colors duration-100 bg-gray-700 px-2 py-1 rounded mt-4",
      {
        "bg-slate-800": completed
      }
    )}
  >
    {projectName}
  </motion.span>
);

const EditButton: FC = () => (
  <motion.span
    whileHover={{ scale: 1.3 }}
    whileTap={{ scale: 0.9 }}
    className="p-2 rounded-full absolute right-0 top-0 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
  >
    <PencilIcon className="w-3 h-3" />
  </motion.span>
);

export const TaskItem: FC<TaskItemProps> = ({ task, onDelete, onTaskEdit, onToggle }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOverdue = !task.completed && new Date(task.deadline) < new Date();
  const itemClasses = clsx(
    "p-4 rounded-lg mb-2 flex items-center justify-between shadow-[inset_5px_0_0_rgba(0,0,0,0.25)] hover:shadow-[inset_0_0_0_2px_rgba(0,0,0,0.25)] relative",
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
      <div className="flex items-start gap-4">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 pt-0 rounded-full ${task.completed ? 'text-green-400' : 'text-gray-400'}`}
        >
          {task.completed ? (
            <CheckBadgeIcon className="w-6 h-6" />
          ) : (
              <CheckCircleIcon className="w-6 h-6" />
          )}
        </motion.button>

        <Modal
          trigger={<EditButton />}
          title="Edit task"
          description="Edit or delete an existing task"
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <TaskForm
            onSubmit={(updatedTask) => onTaskEdit({...task, ...updatedTask})}
            toggleModal={(toggleBool: boolean) => setIsEditModalOpen(toggleBool)}
            task={task}
            deleteTask={() => onDelete(task.id)}
          />
        </Modal>

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
        {
          task.project !== DEFAULT_PROJECT && <ProjectNameBadge completed={task.completed} projectName={task.project} />
        }

        {task.completionDate && (
          <span className="text-xs text-gray-400">
            Completed: {new Date(task.completionDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

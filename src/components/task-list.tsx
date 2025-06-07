import type { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { type Task } from '@/services/tasks';
import { TaskItem } from '@/components/task-item';

type TaskListProps = {
  tasks: Array<Task>;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

export const TaskList: FC<TaskListProps> = ({ tasks, onDelete, onTaskEdit, onToggle }) => {
  return (
    <div className="space-y-4 overflow-y-auto overflow-x-hidden h-[calc(100vh-15.3rem)] relative pr-2">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={onDelete}
            onTaskEdit={onTaskEdit}
          />
        ))}
      </AnimatePresence>
      
      {tasks.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No tasks found. Add a new task to get started!
        </div>
      )}
    </div>
  );
}

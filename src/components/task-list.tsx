import type { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { type Task } from '@/services/tasks';
import { TaskItem } from '@/components/task-item';

type TaskListProps = {
  tasks: Array<Task>;
  onToggle: (taskId: string) => void;
}

export const TaskList: FC<TaskListProps> = ({ tasks, onToggle }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={() => onToggle(task.id)} />
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

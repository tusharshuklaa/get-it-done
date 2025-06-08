import { useState } from "react";
import { addTask, getTasks, removeTask, toggleTaskCompletion, updateTask, type Task } from "@/services/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const loadTasks = async () => {
    const loadedTasks = await getTasks();
    setTasks(loadedTasks);
  };

  const handleTaskSubmit = async (task: Omit<Task, 'id' | 'completed'>) => {
    try {
      const newTask = await addTask(task);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    const updatedTasks = await removeTask(taskId);
    setTasks(updatedTasks);
  };

  const handleTaskEdit = async (task: Task) => {
    const updatedTask = await updateTask(task);
    setTasks(updatedTask);
  };

  const handleTaskCompletionToggle = async (taskId: string) => {
    setTasks(await toggleTaskCompletion(taskId));
  };

  return {
    tasks,
    loadTasks,
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskEdit,
    handleTaskCompletionToggle,
    updateTasks: setTasks,
  };
};

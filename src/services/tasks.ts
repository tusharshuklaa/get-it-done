import { delay } from "@/utils/common";
import type { PRIORITIES } from "@/utils/constants";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  deadline: string;
  project: string;
  priority: keyof typeof PRIORITIES;
  completionDate?: string;
}

export const getTasks = async (projectName?: string): Promise<Array<Task>> => {
  await delay();
  const allItems = JSON.parse(localStorage.getItem("tasks") || "[]");

  if (!projectName || projectName === "all") {
    return allItems;
  }

  return allItems.filter((task: Task) => task.project === projectName);
};

export const saveTasks = async (tasks: Array<Task>) => {
  await delay();
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const addTask = async (task: Omit<Task, "id" | "completed">) => {
  const tasks = await getTasks();
  const newTask = { ...task, id: Date.now().toString(), completed: false };
  await saveTasks([...tasks, newTask]);
  return newTask;
};

export const toggleTaskCompletion = async (taskId: string) => {
  const tasks = await getTasks();
  const updated = tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          completed: !task.completed,
          completionDate: !task.completed
            ? new Date().toISOString()
            : undefined,
        }
      : task
  );
  await saveTasks(updated);
  return updated;
};

export const removeTask = async (taskId: string) => {
  const tasks = await getTasks();
  const updated = tasks.filter((task) => task.id !== taskId);
  await saveTasks(updated);

  return [...updated];
};

export const updateTask = async (task: Task) => {
  const tasks = await getTasks();
  const updated = tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t));
  await saveTasks(updated);

  return [...updated];
};

import { delay } from "@/utils/common";

export const PRIORITIES = ['low', 'medium', 'high'] as const;

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  deadline: string;
  project: string;
  priority: typeof PRIORITIES[number];
  completionDate?: string;
}

export const getTasks = async (): Promise<Array<Task>> => {
  await delay();
  return JSON.parse(localStorage.getItem("tasks") || "[]");
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

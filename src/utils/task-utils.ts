import type { Task } from "@/services/tasks";
import { PRIORITIES, type SORT_OPTIONS } from "@/utils/constants";

export const getSortedTasks = (tasks: Array<Task>, sortBy: typeof SORT_OPTIONS[number]) => {
  const sortedTasks = [...tasks];

  if (sortBy === 'date') {
    sortedTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else if (sortBy === 'priority') {
    sortedTasks.sort((a, b) => PRIORITIES[b.priority] - PRIORITIES[a.priority]);
  } else if (sortBy === 'ascending') {
    sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'descending') {
    sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
  }

  return sortedTasks;
};

export const getSearchedTasks = (searchTerm: string, tasks: Array<Task>) => {
  if (!searchTerm) {
    return;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    task.description.toLowerCase().includes(lowerCaseSearchTerm) ||
    task.project.toLowerCase().includes(lowerCaseSearchTerm) ||
    task.priority.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

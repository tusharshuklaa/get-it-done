import { useMemo, useState } from "react";
import type { Task } from "@/services/tasks";
import { DEFAULT_PROJECT, DEFAULT_TASK_STATUS, SORT_OPTIONS, TASK_STATUSES } from "@/utils/constants";
import { getSearchedTasks, getSortedTasks } from "@/utils/task-utils";
import { useProjects } from "@/hooks/use-projects";

export const useTaskFiltering = (tasks: Array<Task>) => {
  const [filter, setFilter] = useState<typeof TASK_STATUSES[number]>(DEFAULT_TASK_STATUS);
  const [selectedDeadlineFilter, setSelectedDeadlineFilter] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<typeof SORT_OPTIONS[number]>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { selectedProject } = useProjects();
  
  const filteredTasks = useMemo(() => {
    const filteredItems = tasks.filter(task => {
      const matchesProject = selectedProject === DEFAULT_PROJECT || task.project === selectedProject;
      const matchesStatus = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
      const matchedDeadline = !selectedDeadlineFilter || task.deadline === selectedDeadlineFilter;

      return matchesProject && matchesStatus && matchedDeadline;
    });

    if (searchTerm) {
      return getSortedTasks(getSearchedTasks(searchTerm, filteredItems)!, currentSort);
    }

    return getSortedTasks(filteredItems, currentSort);
  }, [currentSort, filter, searchTerm, selectedDeadlineFilter, selectedProject, tasks]);
  
  return {
    filteredTasks,
    selectedProject,
    filter,
    setFilter,
    selectedDeadlineFilter,
    setSelectedDeadlineFilter,
    handleSearch: setSearchTerm,
    handleSort: setCurrentSort,
  };
};

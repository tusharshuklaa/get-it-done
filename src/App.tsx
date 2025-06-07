import { useEffect, useState } from 'react';
import { getTasks, addTask, toggleTaskCompletion, type Task, updateTask, removeTask } from '@/services/tasks';
import { TaskList } from '@/components/task-list';
import { Widgets } from '@/components/widgets';
import { ProjectsWidget } from '@/components/projects-widget';
import { Sidebar } from '@/components/sidebar';
import { InfoBar } from '@/components/info-bar';
import { Header } from '@/components/header';
import { CalendarWidget } from '@/components/calendar.widget';
import { DEFAULT_PROJECT, DEFAULT_TASK_STATUS, PRIORITIES, SORT_OPTIONS, TASK_STATUSES } from '@/utils/constants';
import { useProjects } from '@/hooks/use-projects';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(DEFAULT_PROJECT);
  const [filter, setFilter] = useState<typeof TASK_STATUSES[number]>(DEFAULT_TASK_STATUS);
  const [selectedDeadlineFilter, setSelectedDeadlineFilter] = useState<Date | null>(null);
  const { removeAProject } = useProjects();

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      const matchesProject = selectedProject === DEFAULT_PROJECT || task.project === selectedProject;
      const matchesStatus = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
      const matchedDeadline = !selectedDeadlineFilter
        || new Date(task.deadline).toISOString().split('T')[0] === selectedDeadlineFilter.toISOString().split('T')[0];

      return matchesProject && matchesStatus && matchedDeadline;
    });

    setFilteredTasks(getSortedTasks(filteredTasks, 'date'));
  }, [filter, selectedDeadlineFilter, selectedProject, tasks]);

  const onTaskFormSubmit = async (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = await addTask(task);
    setTasks([...tasks, newTask]);
  };

  const onTaskDelete = async (taskId: string) => {
    const updatedTasks = await removeTask(taskId);
    setTasks(updatedTasks);
  };

  const onTaskEdit = async (task: Task) => {
    const updatedTask = await updateTask(task);
    setTasks(updatedTask);
  };

  const onProjectRemoved = async (removedProject: string) => {
    await removeAProject(removedProject);

    const allTasks = await getTasks();

    allTasks.forEach(async (task) => {
      if (task.project === removedProject) {
        await updateTask({
          ...task,
          project: DEFAULT_PROJECT,
        });
      }
    });

    setTasks([...(allTasks || [])]);
    setSelectedProject(DEFAULT_PROJECT);
  };

  const onDateFilterChange = (date: Date | null) => {
    if (date && date.toISOString() !== selectedDeadlineFilter?.toISOString()) {
      setSelectedDeadlineFilter(date);
    } else {
      setSelectedDeadlineFilter(null);
    }
  };

  const getSortedTasks = (tasks: Array<Task>, sortBy: 'date' | 'priority' | 'ascending' | 'descending') => {
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

  const onSortingChanged = (sortBy: typeof SORT_OPTIONS[number]) => {
    const sortedTasks = getSortedTasks(filteredTasks, sortBy);

    setFilteredTasks(sortedTasks);
  };

  const onTaskSearch = (searchTerm: string) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const searchedTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      task.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      task.project.toLowerCase().includes(lowerCaseSearchTerm) ||
      task.priority.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredTasks(getSortedTasks(searchedTasks, 'date'));
  };

  return (
    <div className="min-h-screen text-gray-100 flex">
      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto w-full my-4 h-[calc(100vh-2rem)]">
        <div className="bg-slate-400 gap-8 p-6 w-full lg:col-span-2 rounded-tl-3xl rounded-bl-3xl">
          <Header createTask={onTaskFormSubmit} onSort={onSortingChanged} onSearch={onTaskSearch} />

          <div className="flex flex-col">
            <TaskList
              tasks={filteredTasks}
              onToggle={async (taskId) => {
                await toggleTaskCompletion(taskId);
                setTasks(await getTasks());
              }}
              onDelete={onTaskDelete}
              onTaskEdit={onTaskEdit}
            />
          </div>
        </div>

        <InfoBar className="flex gap-4 flex-col w-full p-6 overflow-y-auto overflow-x-hidden">
          <Widgets tasks={tasks} />

          <ProjectsWidget
            onProjectRemoved={onProjectRemoved}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
          />

          <CalendarWidget onDateChange={onDateFilterChange} tasks={tasks} />
        </InfoBar>
      </div>
    </div>
  );
}

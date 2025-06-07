import { useEffect, useState } from 'react';
import { getTasks, addTask, toggleTaskCompletion, type Task, updateTask, removeTask } from '@/services/tasks';
import { Filters } from '@/components/filters';
import { TaskList } from '@/components/task-list';
import { Widgets } from '@/components/widgets';
import { ProjectsWidget } from '@/components/projects-widget';
import { Sidebar } from '@/components/sidebar';
import { InfoBar } from '@/components/info-bar';
import { Header } from '@/components/header';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { useProjects } from '@/hooks/use-projects';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedDeadlineFilter, setSelectedDeadlineFilter] = useState<string | null>(null);
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
      const matchedDeadline = !selectedDeadlineFilter || new Date(task.deadline).toISOString().split('T')[0] === selectedDeadlineFilter;

      return matchesProject && matchesStatus && matchedDeadline;
    });

    setFilteredTasks(filteredTasks);
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

  return (
    <div className="min-h-screen text-gray-100 flex">
      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto w-full my-4 h-[calc(100vh-2rem)]">
        <div className="bg-slate-400 gap-8 p-6 w-full lg:col-span-2 rounded-tl-3xl rounded-bl-3xl">
          <Header onSubmit={onTaskFormSubmit} />

          <div className="flex flex-col">
            <Filters onDateFilterChange={setSelectedDeadlineFilter} />

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

        <InfoBar className="w-full lg:col-span-1 p-6">
          <Widgets tasks={tasks} />

          <ProjectsWidget
            onProjectRemoved={onProjectRemoved}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
          />
        </InfoBar>
      </div>
    </div>
  );
}

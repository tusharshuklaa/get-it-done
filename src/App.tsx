import { useEffect, useState } from 'react';
import { getTasks, addTask, toggleTaskCompletion, type Task } from '@/services/tasks';
import { addProject, getProjects, removeProject } from '@/services/projects';
import { Filters } from '@/components/filters';
import { TaskList } from '@/components/task-list';
import { Widgets } from '@/components/widgets';
import { ProjectsWidget } from '@/components/projects-widget';
import { Sidebar } from '@/components/sidebar';
import { InfoBar } from '@/components/info-bar';
import { Header } from '@/components/header';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [projects, setProjects] = useState<Array<string>>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const loadedProjects = await getProjects();
      setProjects(loadedProjects);
    };
    loadProjects();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject;
    const matchesStatus = filter === 'all' ||
      (filter === 'completed' ? task.completed : !task.completed);
    return matchesProject && matchesStatus;
  });

  const onDateFilterChange = (date: string) => {
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.deadline).toDateString();
      const selectedDate = new Date(date).toDateString();
      return taskDate === selectedDate;
    });
    setTasks(filtered);
  };

  const onTaskFormSubmit = async (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = await addTask(task);
    setTasks([...tasks, newTask]);
  };

  const onProjectAdded = async (newProject: string) => {
    const updatedProjects = await addProject(newProject);
    setProjects(updatedProjects);
  };

  const onProjectRemoved = async (project: string) => {
    const updatedProjects = await removeProject(project);
    setProjects(updatedProjects);
  };

  return (
    <div className="min-h-screen text-gray-100 flex">
      <Sidebar />

      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto w-full">
        <div className="bg-slate-400 gap-8 p-6 w-full lg:col-span-2 rounded-tl-3xl rounded-bl-3xl">
          <Header
            projects={projects}
            onSubmit={onTaskFormSubmit}
            addProject={onProjectAdded}
          />

          <div className="flex flex-col">
            <Filters
              filter={filter}
              onFilterChange={setFilter}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              tasks={tasks}
              onDateFilterChange={onDateFilterChange}
            />

            <TaskList
              tasks={filteredTasks}
              onToggle={async (taskId) => {
                await toggleTaskCompletion(taskId);
                setTasks(await getTasks());
              }}
            />
          </div>
        </div>

        <InfoBar className="w-full lg:col-span-1 p-6">
          <Widgets tasks={tasks} />

          <ProjectsWidget
            projects={projects}
            onProjectAdded={onProjectAdded}
            onProjectRemoved={onProjectRemoved}
          />
        </InfoBar>
      </div>
    </div>
  );
}

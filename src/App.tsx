import { useEffect } from 'react';
import { getTasks, updateTask } from '@/services/tasks';
import { TaskList } from '@/components/task-list';
import { Widgets } from '@/components/widgets';
import { ProjectsWidget } from '@/components/projects-widget';
import { Sidebar } from '@/components/sidebar';
import { InfoBar } from '@/components/info-bar';
import { Header } from '@/components/header';
import { CalendarWidget } from '@/components/calendar.widget';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { useProjects } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useTaskFiltering } from '@/hooks/use-task-filtering';
import './App.css';

export default function App() {
  const {
    tasks,
    loadTasks,
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskEdit,
    handleTaskCompletionToggle,
    updateTasks,
  } = useTasks();
  const {
    filteredTasks,
    handleSort,
    handleSearch,
    selectedDeadlineFilter,
    setSelectedDeadlineFilter,
    filter,
    setFilter,
  } = useTaskFiltering(tasks);
  const { removeAProject } = useProjects();

  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProjectRemoved = async (removedProject: string) => {
    await removeAProject(removedProject);

    const allTasks = await getTasks();

    const tasksToUpdate = allTasks.filter(task => task.project === removedProject);

    await Promise.all(
      tasksToUpdate.map(task =>
        updateTask({ ...task, project: DEFAULT_PROJECT })
      )
    );

    updateTasks([...(allTasks || [])]);
  };

  const onDateFilterChange = (date: string | null) => {
    if (date !== selectedDeadlineFilter) {
      setSelectedDeadlineFilter(date);
    } else {
      setSelectedDeadlineFilter(null);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 flex">
      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto w-full my-4 h-[calc(100vh-2rem)]">
        <div className="bg-slate-400 gap-8 p-6 w-full lg:col-span-2 rounded-tl-3xl rounded-bl-3xl">
          <Header createTask={handleTaskSubmit} onSort={handleSort} onSearch={handleSearch} />

          <div className="flex flex-col">
            <TaskList
              tasks={filteredTasks}
              onToggle={handleTaskCompletionToggle}
              onDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
            />
          </div>
        </div>

        <InfoBar className="flex gap-4 flex-col w-full p-6 overflow-y-auto overflow-x-hidden">
          <Widgets tasks={tasks} />

          <ProjectsWidget onProjectRemoved={onProjectRemoved} />

          <CalendarWidget onDateChange={onDateFilterChange} tasks={tasks} />
        </InfoBar>
      </div>
    </div>
  );
}

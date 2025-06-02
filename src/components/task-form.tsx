import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/date-picker';
import { PRIORITIES, type Task } from '@/services/tasks';

type TaskFormProps = {
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  projects: Array<string>;
  addProject: (project: string) => void;
};

export const TaskForm: FC<TaskFormProps> = ({ addProject, onSubmit, projects }) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('medium');
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const [currentProject, setCurrentProject] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !project || !deadline) return;

    // If the project is not in the list, add it
    if (!projects.includes(project)) {
      addProject(project);
      setVisibleProjects([...visibleProjects, project]);
    }

    onSubmit({
      title,
      project,
      priority,
      deadline: new Date(deadline).toISOString(),
      description,
    });

    setTitle('');
    setProject('');
    setPriority('medium');
    setDeadline(null);
    setDescription('');
    setCurrentProject('');
    setVisibleProjects(projects);
  };

  /**
   * input text should be filtered by project name
   * unless exact match, input text should be shown as a possible option
   * if input text and project name are same then do not show input text separately
   * if input text is empty then show all projects
   * @param e 
   * @returns 
   */

  const onProjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const projectName = e.target.value.trim();
    setCurrentProject(projectName);

    if (projectName === '') {
      setVisibleProjects(projects);
      return;
    }

    const filteredProjects = projects.filter(project => project.toLowerCase().includes(projectName.toLowerCase()));

    if (filteredProjects.length === 0) {
      setVisibleProjects([projectName]);
    } else {
      const hasAtLeastOneExactMatch = filteredProjects.some(project => project.toLowerCase() === projectName.toLowerCase());

      if (!hasAtLeastOneExactMatch) {
        setVisibleProjects([projectName, ...filteredProjects]);
      } else {
        setVisibleProjects(filteredProjects);
      }
    }
  };

  const onPriorityChange = (value: typeof PRIORITIES[number]) => {
    if (PRIORITIES.includes(value)) {
      setPriority(value);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Input
            type='text'
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />

          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="flex-1/3 w-auto">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>

            <SelectContent className="relative">
              <Input
                type="text"
                value={currentProject}
                onChange={onProjectSearch}
                placeholder="Search project"
                className="mb-2"
              />
              {
                visibleProjects
                  .map(project => (
                    <SelectItem
                      key={project}
                      value={project}
                      className="text-white hover:text-black"
                    >
                      {project}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="capitalize flex-1/3 w-auto">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              {PRIORITIES.map(priority => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            value={deadline}
            onChange={setDeadline}
            className="w-full"
          />
        </div>

        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        className="mt-4 w-full"
      >
        Add Task
      </Button>
    </motion.form>
  );
};

import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { DEFAULT_PROJECT } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/hooks/use-projects';

type ProjectsWidgetProps = {
  onProjectRemoved: (project: string) => void;
};

export const ProjectsWidget: FC<ProjectsWidgetProps> = ({ onProjectRemoved }) => {
  const [newProject, setNewProject] = useState('');
  const { addNewProject, projects, selectedProject, updateSelectedProject } = useProjects();

  const getProjectItemClasses = (project: string) => {
    return cn(
      "p-3 bg-gray-700 rounded-lg flex items-center justify-between hover:bg-blue-600",
      selectedProject === project && 'bg-blue-600 text-white'
    );
  };

  const onAddNewProject = (event: React.FormEvent) => {
    event.preventDefault();
    addNewProject(newProject);
    setNewProject('');
  };

  const handleProjectRemoved = (project: string) => {
    if (project !== DEFAULT_PROJECT) {
      onProjectRemoved(project);
      setNewProject(DEFAULT_PROJECT);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-2xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <PlusCircleIcon className="w-6 h-6" />
        Projects
      </h2>

      <form className="flex gap-2 mb-4" onSubmit={onAddNewProject}>
        <Input
          type="text"
          placeholder="New project"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="bg-gray-700 rounded-lg p-2 flex-1"
        />
        <Button
          type="submit"
          variant="default"
        >
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {!projects?.length && (
          <motion.p>
            No projects available. Create one!
          </motion.p>
        )}

        {!!projects?.length && [DEFAULT_PROJECT, ...projects].map((project) => (
          <motion.div
            key={project}
            className={getProjectItemClasses(project)}
            whileHover={{ rotate: 1, scale: 1.02 }}
            onClick={() => updateSelectedProject(project)}
          >
            <span className='capitalize'>{project}</span>
            {
              project !== DEFAULT_PROJECT && (
                <motion.button
                  type="button"
                  className='w-6 h-6 cursor-pointer text-red-400 hover:text-red-500'
                  aria-label={`Remove project ${project}`}
                  onClick={() => handleProjectRemoved(project)}
                  whileHover={{ rotate: 180, scale: 1.02 }}
                >
                  <XMarkIcon />
                </motion.button>
              )
            }
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

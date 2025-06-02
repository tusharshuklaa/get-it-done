import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';

type ProjectsWidgetProps = {
  projects: Array<string>;
  onProjectAdded: (project: string) => void;
  onProjectRemoved: (project: string) => void;
};

export const ProjectsWidget: FC<ProjectsWidgetProps> = ({ projects, onProjectAdded, onProjectRemoved }) => {
  const [newProject, setNewProject] = useState('');

  const onAddNewProject = () => {
    if (newProject.trim()) {
      onProjectAdded(newProject.trim());
      setNewProject('');
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

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New project"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          className="bg-gray-700 rounded-lg p-2 flex-1"
        />
        <Button
          onClick={onAddNewProject}
          type="button"
          variant="default"
        >
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {!projects?.length && (
          <motion.p>
            No projects available. Create one!
          </motion.p>
        )}

        {!!projects?.length && projects.map((project) => (
          <motion.div
            key={project}
            className="p-3 bg-gray-700 rounded-lg flex items-center justify-between"
            whileHover={{ rotate: 1, scale: 1.02 }}
          >
            <span>{project}</span>
            <span className="text-gray-400 text-sm">
              {project === 'Inbox' ? 'Default' : ''}
            </span>
            <motion.button
              type="button"
              className='w-6 h-6 cursor-pointer text-red-400 hover:text-red-500'
              aria-label={`Remove project ${project}`}
              onClick={() => onProjectRemoved(project)}
              whileHover={{ rotate: 180, scale: 1.02 }}
            >
              <XMarkIcon />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

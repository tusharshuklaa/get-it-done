import { createContext, useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";
import { delay } from "@/utils/common";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_PROJECT } from "@/utils/constants";

type ProjectsProviderProps = {
  children: React.ReactNode;
};

type ProjectStore = {
  selectedProject: string;
  updateSelectedProject: (project: string) => void;
  projects: Array<string>;
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  addNewProject: (newProject: string) => Promise<void>;
  removeAProject: (removedProject: string) => Promise<void>;
};

const PROJECTS_KEY = 'projects';

export const ProjectsContext = createContext<ProjectStore>({
  selectedProject: '',
  updateSelectedProject: () => {},
  projects: [],
  isLoading: false,
  isAdding: false,
  isRemoving: false,
  addNewProject: async () => {},
  removeAProject: async () => {},
});

type TProjects = ProjectStore["projects"];

export const ProjectsProvider: FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<TProjects>([]);
  const [selectedProject, setSelectedProject] = useState<string>(DEFAULT_PROJECT);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isInitialized = useRef(false);
  const { saveToStorage, loadFromStorage } = useLocalStorage<TProjects>(PROJECTS_KEY);

  // Load projects only once on mount
  useEffect(() => {
    if (isInitialized.current) return;

    const loadProjects = async () => {
      setIsLoading(true);
      await delay();

      const loadedProjects = loadFromStorage();

      if (loadedProjects?.length) {
        setProjects(loadedProjects);
      }

      setIsLoading(false);
      isInitialized.current = true;
    };

    loadProjects();
  }, [loadFromStorage]);

  const addNewProject = useCallback(async (newProject: string) => {
    const trimmedValue = newProject.trim();

    if (!trimmedValue) {
      throw new Error('Project name cannot be empty');
    }

    if (isAdding) {
      return;
    }

    try {
      await delay();

      setProjects(currentProjects => {
        if (currentProjects.includes(trimmedValue)) {
          return currentProjects;
        }

        const updatedProjects = [...currentProjects, trimmedValue];
        saveToStorage(updatedProjects);
        return updatedProjects;
      });
    } finally {
      setIsAdding(false);
    }
  }, [isAdding, saveToStorage]);

  const removeAProject = useCallback(async (removedProject: string) => {
    const trimmedValue = removedProject.trim();

    if (!trimmedValue) {
      throw new Error('Project name cannot be empty');
    }

    if (isRemoving) {
      return;
    }

    setIsRemoving(true);
    
    try {
      await delay();

      setProjects(currentProjects => {
        const updatedProjects = currentProjects.filter(p => p !== trimmedValue);
        saveToStorage(updatedProjects);

        return updatedProjects;
      });

      setSelectedProject(DEFAULT_PROJECT);
    } finally {
      setIsRemoving(false);
    }
  }, [isRemoving, saveToStorage]);

  const projectStore = useMemo(() => ({
    projects,
    selectedProject,
    updateSelectedProject: setSelectedProject,
    isLoading,
    isAdding,
    isRemoving,
    addNewProject,
    removeAProject,
  }), [addNewProject, isAdding, isLoading, isRemoving, projects, removeAProject, selectedProject]);

  return (
    <ProjectsContext.Provider value={projectStore}>
      {children}
    </ProjectsContext.Provider>
  );
};

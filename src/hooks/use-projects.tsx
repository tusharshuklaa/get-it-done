import { ProjectsContext } from "@/providers/project-provider";
import { useContext } from "react";

export const useProjects = () => {
  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }

  return context;
};

import { delay } from "@/utils/common";

const PROJECTS_KEY = 'projects';

export const getProjects = async (): Promise<string[]> => {
  await delay();
  return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
};

export const addProject = async (project: string) => {
  const projects = await getProjects();

  if (!projects.includes(project)) {
    projects.push(project);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([...projects]));
  }

  return projects;
};

export const removeProject = async (project: string) => {
  const projects = await getProjects();
  const updatedProjects = projects.filter(p => p !== project);
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

  return updatedProjects
};

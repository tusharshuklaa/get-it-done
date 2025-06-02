import type { FC } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/search-bar";
import { Modal } from "@/components/modal";
import { TaskForm } from "@/components/task-form";
import type { Task } from "@/services/tasks";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

type HeaderProps = {
  className?: string;
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  projects: Array<string>;
  addProject: (project: string) => void;
};

export const Header: FC<HeaderProps> = ({
  className,
  onSubmit,
  projects,
  addProject,
}) => {
  const headerClasses = cn(
    "flex items-center w-full mb-12 text-white gap-12",
    className
  );

  const triggerClasses = cn(
    buttonVariants({ variant: "default", size: "lg", className: "cursor-pointer" }),
    "tracking-wide"
  );

  const TriggerBtn = () => (
    <span className={triggerClasses}>Create Task</span>
  );

  return (
    <motion.header
      className={headerClasses}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SearchBar />

      <Modal
        trigger={<TriggerBtn />}
        title="Create a task"
        description="Add a new task to your project"
      >
        <TaskForm
          projects={projects}
          onSubmit={onSubmit}
          addProject={addProject}
        />
      </Modal>
    </motion.header>
  );
};

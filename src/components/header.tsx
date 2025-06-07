import { useState, type FC } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search-bar";
import { Modal } from "@/components/modal";
import { TaskForm } from "@/components/task-form";
import type { Task } from "@/services/tasks";
import { buttonVariants } from "@/components/ui/button";

type HeaderProps = {
  className?: string;
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
};

export const Header: FC<HeaderProps> = ({
  className,
  onSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <TaskForm
          onSubmit={onSubmit}
          toggleModal={(toggleBool: boolean) => setIsModalOpen(toggleBool)}
        />
      </Modal>
    </motion.header>
  );
};

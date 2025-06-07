import { useState, type FC } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search-bar";
import { Modal } from "@/components/modal";
import { TaskForm } from "@/components/task-form";
import type { Task } from "@/services/tasks";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS } from "@/utils/constants";

type HeaderProps = {
  className?: string;
  createTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onSort: (sortBy: typeof SORT_OPTIONS[number]) => void;
  onSearch: (searchTerm: string) => void;
};

export const Header: FC<HeaderProps> = ({
  className,
  createTask,
  onSort,
  onSearch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerClasses = cn(
    "flex items-center w-full mb-6 text-white gap-12",
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
      <SearchBar
        onSearch={onSearch}
        placeholder="Search by task name, description, priority or project"
      />

      <div className="flex gap-2 items-center justify-between">
        <Select onValueChange={onSort} defaultValue="date">
          <SelectTrigger className="data-[placeholder]:text-gray-900 [&_svg:not([class*='text-'])]:text-gray-900 w-[187px]">
            <span className="flex gap-2 text-gray-900">
              Sort By: <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {
              SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Modal
          trigger={<TriggerBtn />}
          title="Create a task"
          description="Add a new task to your project"
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        >
          <TaskForm
            onSubmit={createTask}
            toggleModal={(toggleBool: boolean) => setIsModalOpen(toggleBool)}
          />
        </Modal>
      </div>
    </motion.header>
  );
};

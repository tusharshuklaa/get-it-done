import type { FC } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { TASK_STATUSES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type TaskStatus = typeof TASK_STATUSES[number];

type SidebarProps = {
  filter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
};

export const Sidebar: FC<SidebarProps> = ({filter, onFilterChange}) => {
  const getBtnClasses = (item: TaskStatus) => {
    return cn(
      buttonVariants({ variant: 'default' }),
      "px-4 py-2 rounded capitalize [writing-mode:sideways-lr] text-white h-fit w-fit",
      {
        "bg-teal-800": filter === item,
      }
    );
  };

  return (
    <motion.aside
      className="flex flex-col items-center justify-center w-[100px] px-4 py-6 h-screen text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-sm mb-8">Get It Done</h1>

      <motion.ul className="flex flex-col w-full h-full list-none gap-4 items-center">
        {TASK_STATUSES.map((ts: TaskStatus) => (
          <motion.button
            key={ts}
            onClick={() => onFilterChange(ts)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={getBtnClasses(ts)}
          >
            {ts}
          </motion.button>
        ))}
      </motion.ul>
    </motion.aside>
  );
};
import type { FC } from "react";
import { motion } from "framer-motion";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

type SidebarProps = {
  color?: string;
};

export const Sidebar: FC<SidebarProps> = () => {
  console.log('sidebar');

  return (
    <motion.aside
      className="flex flex-col items-center justify-center w-[100px] px-4 py-6 h-screen text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-sm mb-8">Get It Done</h1>

      <ul className="flex flex-col w-full h-full gap-6 list-none">
        <li className="flex items-center justify-between flex-col">
          <button className="w-full h-full"><CheckBadgeIcon /></button>
          <span>Label</span>
        </li>
        <li className="flex items-center justify-between flex-col">
          <button className="w-full h-full"><CheckBadgeIcon /></button>
          <span>Label</span>
        </li>
        <li className="flex items-center justify-between flex-col">
          <button className="w-full h-full"><CheckBadgeIcon /></button>
          <span>Label</span>
        </li>
      </ul>
    </motion.aside>
  );
};
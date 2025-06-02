import type { FC } from "react";
import { motion } from "framer-motion";

type InfoBarProps = {
  className?: string;
  children?: React.ReactNode;
};

export const InfoBar: FC<InfoBarProps> = ({ className, children }) => {
  const infoBarClassName = `bg-slate-600 ${className}`;

  return (
    <motion.aside className={ infoBarClassName }>
      {children}
    </motion.aside>
  );
};

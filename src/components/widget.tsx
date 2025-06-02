import type { FC } from "react";
import { motion } from "framer-motion";

type WidgetProps = {
  title: string;
  value: string | number;
  valueClassName?: string;
};

export const Widget: FC<WidgetProps> = ({ title, value, valueClassName }) => (
  <motion.div 
    className="p-4 bg-gray-800 rounded-lg"
    whileHover={{ scale: 1.02 }}
  >
    <h3 className="text-lg font-semibold">{ title }</h3>
    <p className={ `text-2xl ${valueClassName}` }>{ value }</p>
  </motion.div>
);
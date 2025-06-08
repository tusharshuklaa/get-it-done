import { useMemo, useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Modifiers } from 'react-day-picker';
import type { Task } from '@/services/tasks';
import { getPlainDate } from '@/lib/utils';

type CalendarWidgetProps = {
  onDateChange?: (date: string | null) => void;
  tasks: Array<Task>;
};

export const CalendarWidget: FC<CalendarWidgetProps> = ({ onDateChange, tasks }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const selectedDateTasks = useMemo(() => tasks.filter(
    task => !!selectedDate && task.deadline === getPlainDate(selectedDate)
  ), [selectedDate, tasks]);

  const formattedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(selectedDate);

  const dateText = selectedDate
    ? `for ${formattedDate}`
    : 'for today';

  const handleDayClick = (day: Date, modifiers: Modifiers) => {
    const value = modifiers.selected ? null : getPlainDate(day);

    if (onDateChange) {
      onDateChange(value);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-2xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6" />
        Calendar
      </h2>

      <div className="flex gap-2">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={setSelectedDate}
          onDayClick={handleDayClick}
          todayClassName="[&>button]:bg-teal-400 [&>button]:text-black"
        />
        <span className="text-gray-300 text-sm p-4 flex items-center justify-center">
          {selectedDateTasks.length} task{selectedDateTasks.length > 1 ? 's' : ''}
          <br />
          {dateText}
        </span>
      </div>
    </motion.div>
  );
};

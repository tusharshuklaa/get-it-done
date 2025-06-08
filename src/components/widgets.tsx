import type { FC } from "react";
import type { Task } from "@/services/tasks";
import { Widget } from "@/components/widget";
import { WeatherWidget } from "@/components/weather-widget";

type WidgetsProps = {
  tasks: Array<Task>;
};

export const Widgets: FC<WidgetsProps> = ({ tasks }) => {
  const pendingToday = tasks.filter(task => 
    !task.completed && 
    new Date(task.deadline).toDateString() === new Date().toDateString()
  ).length;

  const overdue = tasks.filter(task => 
    !task.completed && 
    new Date(task.deadline) < new Date()
  ).length;

  const pendingThisWeek = tasks.filter(task => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const taskDeadline = new Date(task.deadline);
    return !task.completed && taskDeadline >= startOfWeek && taskDeadline <= endOfWeek;
  }).length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <WeatherWidget />

      <Widget
        title="Due Today"
        value={pendingToday}
        valueClassName="text-blue-400"
      />

      <Widget
        title="Overdue Tasks"
        value={overdue}
        valueClassName="text-red-400"
      />

      <Widget
        title="Due This Week"
        value={pendingThisWeek}
        valueClassName="text-yellow-400"
      />
    </div>
  );
};

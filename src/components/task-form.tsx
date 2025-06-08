import { useRef, useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/date-picker';
import { ComboBox } from '@/components/combobox';
import { useProjects } from "@/hooks/use-projects";
import { PRIORITIES } from '@/utils/constants';
import type { Task } from '@/services/tasks';
import { getPlainDate } from '@/lib/utils';

type TaskFormProps = {
  onSubmit: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleModal: (toggleBool: boolean) => void;
  task?: Task | null;
  deleteTask? : () => void;
};

export const TaskForm: FC<TaskFormProps> = ({ deleteTask, onSubmit, toggleModal, task }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [project, setProject] = useState(task?.project || '');
  const [priority, setPriority] = useState<keyof typeof PRIORITIES>(task?.priority || 'medium');
  const [deadline, setDeadline] = useState<string | null>(task ? task.deadline : null);
  const [description, setDescription] = useState(task?.description || '');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { projects } = useProjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMsg('Title is required');
      return;
    }

    if (!deadline) {
      setErrorMsg('Deadline is required');
      return;
    }

    onSubmit({
      title,
      project,
      priority,
      deadline,
      description,
    });

    toggleModal(false);

    setTitle('');
    setProject('');
    setPriority('medium');
    setDeadline(null);
    setDescription('');
  };

  const onPriorityChange = (value: keyof typeof PRIORITIES) => {
    if (Object.keys(PRIORITIES).includes(value)) {
      setPriority(value);
    }
  };

  const onDateChange = (date: Date | null) => {
    const deadLineDate = date ? getPlainDate(date) : null;
    setDeadline(deadLineDate);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      ref={formRef}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Input
            type='text'
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />

          <ComboBox
            value={project}
            onChange={setProject}
            options={projects}
            placeholder="Select a project"
            emptyMessage='No projects found'
            containerRef={formRef}
          />
        </div>

        <div className="flex gap-4">
          <Select value={priority} onValueChange={onPriorityChange} required>
            <SelectTrigger className="capitalize flex-1/3 w-auto">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              {Object.keys(PRIORITIES).map(priority => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            value={deadline ? new Date(deadline) : null}
            onChange={onDateChange}
            className="w-full"
            containerRef={formRef}
          />
        </div>

        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {
          errorMsg && (
            <span className="text-red-500 text-sm w-full">
              <sup>* </sup>{errorMsg}
            </span>
          )
        }
      </div>

      <div className="flex gap-4 justify-around items-center overflow-hidden">
        {
          !!task && (
            <Button
              type="button"
              variant="destructive"
              className="mt-4 min-w-[30%]"
              onClick={deleteTask}
            >
              Delete Task
            </Button>
          )
        }

        <Button
          type="submit"
          variant="default"
          className="mt-4 min-w-[30%]"
        >
          {
            task ? 'Update Task' : 'Add Task'
          }
        </Button>
      </div>
    </motion.form>
  );
};

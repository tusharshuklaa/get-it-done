import { useState, type FC } from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
};

export const DatePicker: FC<DatePickerProps> = ({ onChange, value, containerRef }) => {
  const [date, setDate] = useState<Date | null>(value);

  const onDateChange = (day: Date | undefined) => {
    const selectedDate = day || null;
    setDate(selectedDate);

    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-transparent text-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-white" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 z-55"
        container={containerRef.current}
      >
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
};

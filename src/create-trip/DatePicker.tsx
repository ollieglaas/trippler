import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (range: DateRange) => void;
}

export function DatePicker({
  className,
  startDate,
  endDate,
  onDateChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate && onDateChange) {
      onDateChange({
        from: newDate.from ? format(newDate.from, "dd MMMM yyyy") : undefined,
        to: newDate.to ? format(newDate.to, "dd MMMM yyyy") : undefined,
      } as DateRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <div className="flex flex-row justify-between items-center w-full">
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </div>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={[{ before: new Date() }]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

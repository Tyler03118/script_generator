"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

export function Calendar24({ value, onValueChange, placeholder }: Calendar24Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [time, setTime] = React.useState<string>("10:00")

  // 用于防止无限循环的ref
  const lastValueRef = React.useRef<string>("")

  // 初始化时间值
  React.useEffect(() => {
    if (value && value !== lastValueRef.current) {
      const dateTime = new Date(value);
      if (!isNaN(dateTime.getTime())) {
        setDate(dateTime);
        // 提取时间部分 (HH:MM)
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      }
      lastValueRef.current = value;
    }
  }, [value]);

  // 使用useCallback优化性能
  const handleValueChange = React.useCallback((newValue: string) => {
    if (newValue !== lastValueRef.current) {
      lastValueRef.current = newValue;
      onValueChange(newValue);
    }
  }, [onValueChange]);

  // 当日期或时间变化时，更新value
  React.useEffect(() => {
    if (date && time) {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const newValue = `${dateStr} ${time}`;
      handleValueChange(newValue);
    }
  }, [date, time, handleValueChange]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-normal h-[42px] px-3 py-2.5"
            >
              {date ? date.toLocaleDateString() : placeholder}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1">
        <input
          type="time"
          step="60"
          value={time}
          onChange={handleTimeChange}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 h-[42px] text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-time-picker-indicator]:hidden"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
            backgroundImage: 'none'
          }}
        />
      </div>
    </div>
  )
}

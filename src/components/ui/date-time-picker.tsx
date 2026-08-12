import DatePicker from './date-picker';
import TimePicker from './time-picker';

interface DateTimePickerProps {
  date: Date | null;
  time: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  label,
  disabled,
  required,
  className,
}: DateTimePickerProps) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <DatePicker
            selectedDate={date}
            onDateChange={onDateChange}
            disabled={disabled}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div className="w-36">
          <TimePicker
            value={time}
            onChange={onTimeChange}
            disabled={disabled}
            placeholder="HH:MM"
          />
        </div>
      </div>
    </div>
  );
}

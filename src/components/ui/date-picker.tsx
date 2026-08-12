import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

function DatePicker({
  selectedDate,
  onDateChange,
  label,
  disabled = false,
  placeholder = 'DD/MM/YYYY',
  className = '',
  required = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'days' | 'month-select' | 'year-select'>('days');
  const [currentMonth, setCurrentMonth] = useState(selectedDate ?? new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setViewMode('days');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getStartDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const days = (() => {
    const count = getDaysInMonth(currentMonth);
    const start = getStartDay(currentMonth);
    const arr: (number | null)[] = [];
    for (let i = 0; i < start; i++) arr.push(null);
    for (let i = 1; i <= count; i++) arr.push(i);
    return arr;
  })();

  const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'short' }),
  );

  const prevMonth = () => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1));
  const prevYear = () => setCurrentMonth(p => new Date(p.getFullYear() - 1, p.getMonth(), 1));
  const nextYear = () => setCurrentMonth(p => new Date(p.getFullYear() + 1, p.getMonth(), 1));

  const selectMonth = (i: number) => {
    setCurrentMonth(p => new Date(p.getFullYear(), i, 1));
    setViewMode('days');
  };

  const selectDay = (day: number) => {
    onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setIsOpen(false);
    setViewMode('days');
  };

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth.getMonth() &&
    selectedDate.getFullYear() === currentMonth.getFullYear();

  const isToday = (day: number) => {
    const t = new Date();
    return t.getDate() === day && t.getMonth() === currentMonth.getMonth() && t.getFullYear() === currentMonth.getFullYear();
  };

  const year = currentMonth.getFullYear();

  return (
    <div className="relative w-full" ref={pickerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => { if (!disabled) { setIsOpen(o => !o); } }}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors',
          'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', selectedDate ? 'text-foreground' : 'text-muted-foreground')}>
          {selectedDate ? selectedDate.toLocaleDateString('en-GB') : placeholder}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={viewMode === 'days' ? prevMonth : prevYear}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setViewMode('month-select')}
                className="rounded px-2 py-0.5 transition-colors hover:bg-surface-raised hover:text-primary"
              >
                {currentMonth.toLocaleString('default', { month: 'long' })}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('year-select')}
                className="rounded px-2 py-0.5 transition-colors hover:bg-surface-raised hover:text-primary"
              >
                {year}
              </button>
            </div>

            <button
              type="button"
              onClick={viewMode === 'days' ? nextMonth : nextYear}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {viewMode === 'days' && (
            <>
              <div className="mb-1 grid grid-cols-7 text-center">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-[11px] font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day ? (
                      <button
                        type="button"
                        onClick={() => selectDay(day)}
                        className={cn(
                          'h-8 w-8 rounded-full text-xs transition-colors',
                          isSelected(day)
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : isToday(day)
                              ? 'bg-primary/15 text-primary font-semibold'
                              : 'text-foreground hover:bg-surface-raised',
                        )}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === 'month-select' && (
            <div className="grid grid-cols-3 gap-1">
              {MONTH_NAMES.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectMonth(i)}
                  className={cn(
                    'rounded-lg py-2 text-xs transition-colors',
                    currentMonth.getMonth() === i
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-foreground hover:bg-surface-raised',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'year-select' && (
            <div className="flex items-center justify-center gap-6 py-4">
              <button type="button" onClick={prevYear} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-base font-semibold">{year}</span>
              <button type="button" onClick={nextYear} className="text-muted-foreground hover:text-foreground">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(DatePicker);

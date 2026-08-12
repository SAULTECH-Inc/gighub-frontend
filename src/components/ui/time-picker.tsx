import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const TIMES: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIMES.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
}

export default function TimePicker({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select time',
  className = '',
  required = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll selected item into view when dropdown opens
  useEffect(() => {
    if (open && value && listRef.current) {
      const idx = TIMES.indexOf(value);
      if (idx !== -1) {
        const itemHeight = 36;
        listRef.current.scrollTop = Math.max(0, idx * itemHeight - 80);
      }
    }
  }, [open, value]);

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          readOnly
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && setOpen(o => !o)}
          className={cn(
            'w-full cursor-pointer rounded-lg border border-border bg-surface py-2.5 pl-3 pr-10 text-sm transition-colors',
            'placeholder:text-muted-foreground text-foreground',
            'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        />
        <Clock
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
          onClick={() => !disabled && setOpen(o => !o)}
        />

        {open && (
          <div
            ref={listRef}
            className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-surface shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {TIMES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { onChange(t); setOpen(false); }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  t === value
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-surface-raised',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

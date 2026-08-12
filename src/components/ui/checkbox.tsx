import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  size = 18,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer select-none items-center gap-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />

      <div
        className="flex shrink-0 items-center justify-center rounded border-2 transition-all peer-checked:border-primary peer-checked:bg-primary"
        style={{ width: size, height: size, borderColor: checked ? undefined : 'hsl(var(--border))' }}
      >
        {checked && (
          <svg
            className="h-3/4 w-3/4"
            fill="none"
            stroke="white"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}

import { cn } from '@/lib/utils';

interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export default function RadioButton({
  name,
  value,
  checked,
  onChange,
  label,
  size = 18,
  disabled = false,
  className = '',
}: RadioButtonProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer select-none items-center gap-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="sr-only"
      />

      <div
        className="flex shrink-0 items-center justify-center rounded-full border-2 transition-all"
        style={{
          width: size,
          height: size,
          borderColor: checked ? 'hsl(var(--primary))' : 'hsl(var(--border))',
        }}
      >
        {checked && (
          <div
            className="rounded-full bg-primary"
            style={{ width: size * 0.5, height: size * 0.5 }}
          />
        )}
      </div>

      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}

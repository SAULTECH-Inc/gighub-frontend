import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: SelectOption[];
  selected: SelectOption[];
  onChange: (items: SelectOption[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  label,
  required = false,
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    opt =>
      opt.label.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some(s => s.value === opt.value),
  );

  const canAdd =
    search.trim() !== '' &&
    !options.some(o => o.label.toLowerCase() === search.toLowerCase()) &&
    !selected.some(s => s.label.toLowerCase() === search.toLowerCase());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt: SelectOption) => {
    if (disabled) return;
    if (!selected.some(s => s.value === opt.value)) {
      onChange([...selected, opt]);
    }
    setSearch('');
  };

  const handleAdd = () => {
    if (disabled || !search.trim()) return;
    const newOpt: SelectOption = {
      label: search.trim(),
      value: search.trim().toLowerCase().replace(/\s+/g, '-'),
    };
    if (!selected.some(s => s.value === newOpt.value)) {
      onChange([...selected, newOpt]);
    }
    setSearch('');
    setOpen(false);
  };

  const handleRemove = (value: string) => {
    if (disabled) return;
    onChange(selected.filter(s => s.value !== value));
  };

  return (
    <div className={cn('w-full', className)} ref={ref}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(o => !o)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-left text-sm transition-colors',
            'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span className={cn(selected.length > 0 ? 'text-foreground font-medium' : 'text-muted-foreground')}>
            {selected.length > 0
              ? `${selected.length} item${selected.length > 1 ? 's' : ''} selected`
              : placeholder}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>

        {open && !disabled && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="border-b border-border p-2">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search or type to add..."
                className="w-full rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className="w-full border-b border-border/50 px-4 py-2.5 text-left text-sm text-foreground last:border-b-0 transition-colors hover:bg-surface-raised"
                  >
                    {opt.label}
                  </button>
                ))
              ) : search.trim() === '' ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Start typing to search options
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No matching options found
                </div>
              )}

              {canAdd && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4" />
                  Add "{search.trim()}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {selected.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {selected.map(item => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {item.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.value)}
                  className="rounded-full p-0.5 transition-colors hover:bg-primary/25"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

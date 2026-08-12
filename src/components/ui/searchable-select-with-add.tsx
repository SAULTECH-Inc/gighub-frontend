import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectWithAddProps {
  options: SelectOption[];
  value?: string;
  onChange?: (option: SelectOption) => void;
  onAddOption?: (option: SelectOption) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function SearchableSelectWithAdd({
  options,
  value,
  onChange,
  onAddOption,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  required = false,
  className = '',
}: SearchableSelectWithAddProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) ?? null;

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const canAdd =
    search.trim() !== '' &&
    !options.some(o => o.label.toLowerCase() === search.toLowerCase());

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
    onChange?.(opt);
    setOpen(false);
    setSearch('');
  };

  const handleAdd = () => {
    if (!search.trim()) return;
    const newOpt: SelectOption = {
      label: search.trim(),
      value: search.trim().replace(/\s+/g, '-').toLowerCase(),
    };
    onAddOption?.(newOpt);
    onChange?.(newOpt);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors',
          'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {selected ? selected.label : placeholder}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search or type to add..."
                className="w-full rounded-md border border-border bg-surface-raised py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt, i) => (
                <button
                  key={`${opt.value}-${i}`}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    'w-full border-b border-border/50 px-4 py-2.5 text-left text-sm last:border-b-0 transition-colors',
                    opt.value === value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-surface-raised',
                  )}
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
  );
}

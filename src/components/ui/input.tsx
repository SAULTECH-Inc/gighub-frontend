import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const inputBase =
  'flex h-10 w-full rounded-xl border border-border bg-input px-3 py-1 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/60 focus-visible:shadow-[0_0_0_4px_hsl(262_83%_58%/0.08)] disabled:cursor-not-allowed disabled:opacity-50';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, ...props }, ref) => {
    if (icon || suffix) {
      return (
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              inputBase,
              icon && 'pl-9',
              suffix && 'pr-9',
              className,
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-muted-foreground">{suffix}</span>
          )}
        </div>
      );
    }
    return (
      <input
        type={type}
        className={cn(inputBase, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };


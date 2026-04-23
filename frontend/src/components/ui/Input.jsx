import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border-subtle bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-amber focus:border-transparent transition-all",
          error && "border-accent-rose focus:ring-accent-rose",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-accent-rose">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

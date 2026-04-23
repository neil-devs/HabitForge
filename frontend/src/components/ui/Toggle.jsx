import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';

export const Toggle = React.forwardRef(({ className, color = 'var(--accent-amber)', ...props }, ref) => (
  <Switch.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-amber data-[state=unchecked]:bg-bg-tertiary",
      className
    )}
    {...props}
    ref={ref}
  >
    <Switch.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </Switch.Root>
));
Toggle.displayName = Switch.Root.displayName;

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils/cn';

export const Dropdown = ({ trigger, children, align = 'end', className }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className={cn(
            "z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-glass-border bg-bg-elevated/80 backdrop-blur-2xl saturate-[1.8] p-2 text-text-primary shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)] data-[state=open]:animate-dropdownOpen data-[state=closed]:animate-dropdownClose origin-top-right",
            className
          )}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const DropdownItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200 ease-out focus:bg-accent-amber/10 focus:text-accent-amber data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent-amber/10 hover:text-accent-amber hover:translate-x-1",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownItem.displayName = DropdownMenu.Item.displayName;

export const DropdownSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
    {...props}
  />
));
DropdownSeparator.displayName = DropdownMenu.Separator.displayName;

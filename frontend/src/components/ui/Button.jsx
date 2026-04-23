import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, variant = 'primary', size = 'md', isLoading, children, ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    primary: "bg-accent-amber text-black hover:bg-amber-400",
    secondary: "bg-bg-tertiary text-text-primary hover:bg-bg-elevated border border-border-subtle",
    ghost: "bg-transparent text-text-primary hover:bg-bg-tertiary",
    danger: "bg-accent-rose text-white hover:bg-rose-600",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      ref={ref}
      whileTap={!props.disabled && !isLoading ? { scale: 0.95 } : undefined}
      whileHover={!props.disabled && !isLoading ? { scale: 1.02 } : undefined}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

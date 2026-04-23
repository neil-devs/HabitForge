import React from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

export const Avatar = ({ src, fallback, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl'
  };

  const [error, setError] = React.useState(false);

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full bg-bg-tertiary overflow-hidden border border-border-subtle",
      sizes[size],
      className
    )}>
      {src && !error ? (
        <img 
          src={src} 
          alt="Avatar" 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : fallback ? (
        <span className="font-semibold text-text-secondary uppercase">{fallback.substring(0, 2)}</span>
      ) : (
        <User className="text-text-muted w-1/2 h-1/2" />
      )}
    </div>
  );
};

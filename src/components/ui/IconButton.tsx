import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  tooltip?: string;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export function IconButton({
  children,
  className,
  size = 'md',
  active = false,
  tooltip,
  as: Component = 'button',
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm', // standard 44px
    lg: 'w-14 h-14 text-base',
  };

  return (
    <Component
      title={tooltip}
      className={twMerge(
        clsx(
          'glass-pill inline-flex items-center justify-center rounded-full transition-all duration-300 tap-apple select-none cursor-pointer',
          sizeClasses[size],
          active
            ? 'bg-white/80 dark:bg-white/20 text-[var(--text)] border-white dark:border-white/40 shadow-md'
            : 'text-[var(--text-2)] hover:text-[var(--text)] hover:scale-105',
          className
        )
      )}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}

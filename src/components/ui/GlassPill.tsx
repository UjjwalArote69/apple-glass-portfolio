import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'div' | 'a';
  href?: string;
}

export function GlassPill({
  children,
  className,
  active = false,
  size = 'md',
  as: Component = 'button',
  ...props
}: GlassPillProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const activeClasses = active
    ? 'bg-white/80 dark:bg-white/20 text-[var(--text)] shadow-md border-white dark:border-white/40'
    : 'text-[var(--text-2)] hover:text-[var(--text)]';

  return (
    <Component
      className={twMerge(
        clsx(
          'glass-pill inline-flex items-center justify-center font-medium transition-all duration-300 tap-apple select-none cursor-pointer',
          sizeClasses[size],
          activeClasses,
          className
        )
      )}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}

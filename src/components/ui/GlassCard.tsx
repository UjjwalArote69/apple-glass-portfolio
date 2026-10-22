import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'interactive';
  hasNoise?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hasNoise = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card relative overflow-hidden transition-all duration-500',
          hasNoise && 'glass-noise',
          variant === 'interactive' &&
            'hover:-translate-y-1 hover:shadow-2xl cursor-pointer group',
          variant === 'subtle' && 'bg-[var(--glass-bg-subtle)]',
          className
        )
      )}
      {...props}
    >
      {/* Top inner gradient highlight hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

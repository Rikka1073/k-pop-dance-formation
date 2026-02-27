'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary:
    'bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 focus:ring-pink-400',
  secondary: 'bg-[var(--background-tertiary)] text-[var(--foreground)] border border-[var(--card-border)] hover:border-pink-400/60 hover:bg-[var(--background-secondary)] hover:-translate-y-0.5 focus:ring-pink-400/50',
  ghost:
    'bg-transparent text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/20',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          variantClasses[variant],
          sizeClasses[size],
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

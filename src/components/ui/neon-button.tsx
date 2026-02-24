'use client'

import { cn } from '@/lib/utils/cn'
import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes } from 'react'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'cyan' | 'violet' | 'lime' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  pink: 'bg-pink-500/20 border-pink-500 text-pink-300 hover:bg-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)]',
  cyan: 'bg-cyan-500/20 border-cyan-500 text-cyan-300 hover:bg-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]',
  violet:
    'bg-violet-500/20 border-violet-500 text-violet-300 hover:bg-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]',
  lime: 'bg-lime-500/20 border-lime-500 text-lime-300 hover:bg-lime-500/40 shadow-[0_0_15px_rgba(132,204,22,0.4)] hover:shadow-[0_0_25px_rgba(132,204,22,0.7)]',
  ghost:
    'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export function NeonButton({
  variant = 'pink',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        'relative border rounded-lg font-semibold tracking-wide transition-all duration-200 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...(props as Parameters<typeof motion.button>[0])}
    >
      {children}
    </motion.button>
  )
}

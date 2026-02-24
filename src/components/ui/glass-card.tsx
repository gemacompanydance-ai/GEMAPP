'use client'

import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'pink' | 'cyan' | 'violet' | 'none'
}

const glowClasses = {
  pink: 'border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)]',
  cyan: 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
  violet: 'border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)]',
  none: 'border-white/10',
}

export function GlassCard({
  glow = 'none',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/5 border rounded-2xl',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

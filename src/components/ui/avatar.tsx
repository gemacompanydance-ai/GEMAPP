import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0',
        'bg-gradient-to-br from-pink-500 via-violet-500 to-cyan-500',
        'border-2 border-white/20',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-white">{initials}</span>
      )}
    </div>
  )
}

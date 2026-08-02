import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  glow?: 'none' | 'blue' | 'indigo' | 'cyan' | 'amber'
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  glow = 'none',
  ...props
}: GlassCardProps) {
  const glowClasses = {
    none: '',
    blue: 'hover:shadow-blue-500/20 hover:border-blue-500/30',
    indigo: 'hover:shadow-indigo-500/20 hover:border-indigo-500/30',
    cyan: 'hover:shadow-cyan-500/20 hover:border-cyan-500/30',
    amber: 'hover:shadow-orange-500/20 hover:border-orange-500/30',
  }

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
      className={cn(
        'glass-card p-6 transition-all duration-200',
        glowClasses[glow],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  )
}

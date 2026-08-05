import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type GlowIntensity = 'sm' | 'md' | 'lg'
type ShadowIntensity = 'sm' | 'md' | 'lg'
type BlurIntensity = 'sm' | 'md' | 'lg'

interface LiquidGlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  glowIntensity?: GlowIntensity
  shadowIntensity?: ShadowIntensity
  borderRadius?: string
  blurIntensity?: BlurIntensity
  draggable?: boolean
}

const glowMap: Record<GlowIntensity, string> = {
  sm: 'shadow-[0_0_12px_rgba(255,255,255,0.12)]',
  md: 'shadow-[0_0_18px_rgba(255,255,255,0.14)]',
  lg: 'shadow-[0_0_24px_rgba(255,255,255,0.16)]',
}

const shadowMap: Record<ShadowIntensity, string> = {
  sm: 'shadow-[0_8px_20px_rgba(15,23,42,0.12)]',
  md: 'shadow-[0_12px_28px_rgba(15,23,42,0.16)]',
  lg: 'shadow-[0_16px_36px_rgba(15,23,42,0.2)]',
}

const blurMap: Record<BlurIntensity, string> = {
  sm: '10px',
  md: '16px',
  lg: '22px',
}

export function LiquidGlassCard({
  children,
  className,
  glowIntensity = 'md',
  shadowIntensity = 'md',
  borderRadius = '20px',
  blurIntensity = 'md',
  draggable = false,
  ...props
}: LiquidGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden border border-white/20 bg-white/10 text-slate-800 dark:text-white backdrop-blur-md',
        glowMap[glowIntensity],
        shadowMap[shadowIntensity],
        className
      )}
      style={{
        borderRadius,
        backdropFilter: `blur(${blurMap[blurIntensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[blurIntensity]})`,
      }}
      draggable={draggable}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/8 to-transparent opacity-80 pointer-events-none" />
      <div className="absolute inset-x-6 top-2 h-8 rounded-full bg-white/20 blur-xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

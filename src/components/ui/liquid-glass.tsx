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
  sm: 'shadow-[0_0_24px_rgba(255,255,255,0.16)]',
  md: 'shadow-[0_0_32px_rgba(255,255,255,0.2)]',
  lg: 'shadow-[0_0_40px_rgba(255,255,255,0.24)]',
}

const shadowMap: Record<ShadowIntensity, string> = {
  sm: 'shadow-[0_16px_36px_rgba(15,23,42,0.18)]',
  md: 'shadow-[0_20px_44px_rgba(15,23,42,0.24)]',
  lg: 'shadow-[0_24px_56px_rgba(15,23,42,0.3)]',
}

const blurMap: Record<BlurIntensity, string> = {
  sm: '20px',
  md: '28px',
  lg: '36px',
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden border border-white/30 bg-white/15 text-white backdrop-blur-xl',
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-white/12 to-transparent" />
      <div className="absolute inset-x-6 top-2 h-10 rounded-full bg-white/25 blur-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

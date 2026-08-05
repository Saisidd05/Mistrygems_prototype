import React, { useEffect, useMemo, useRef } from 'react'

export function AnimatedBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const particles = useMemo(() => Array.from({ length: 20 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 61) % 100}%`,
    size: 2 + (index % 4),
    duration: 10 + (index % 8) * 1.5,
    delay: (index % 6) * -1.2,
    opacity: 0.18 + (index % 5) * 0.09,
  })), [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 18
      parallaxRef.current?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg">
        <div ref={parallaxRef} className="plasma-parallax">
          <div className="aurora" />
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left, top: particle.top, width: particle.size, height: particle.size,
              animationDuration: `${particle.duration}s`, animationDelay: `${particle.delay}s`, opacity: particle.opacity,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,180,216,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>
    </>
  )
}

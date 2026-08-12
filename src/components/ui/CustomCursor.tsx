import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let x = -100
    let y = -100
    let ringX = x
    let ringY = y
    let frame = 0

    const render = () => {
      ringX += (x - ringX) * 0.85
      ringY += (y - ringY) * 0.85
      dotRef.current?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`)
      ringRef.current?.style.setProperty('transform', `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`)
      frame = requestAnimationFrame(render)
    }
    const move = (event: MouseEvent) => { x = event.clientX; y = event.clientY }
    const hover = (event: MouseEvent) => ringRef.current?.classList.toggle('hovered', Boolean((event.target as Element).closest('a, button, input, select, textarea, [role="button"]')))
    const click = (event: MouseEvent) => {
      const id = Date.now()
      setRipples((current) => [...current, { id, x: event.clientX, y: event.clientY }])
      window.setTimeout(() => setRipples((current) => current.filter((ripple) => ripple.id !== id)), 650)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', hover, { passive: true })
    window.addEventListener('click', click, { passive: true })
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', hover)
      window.removeEventListener('click', click)
    }
  }, [])

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
      {ripples.map((ripple) => <span key={ripple.id} className="cursor-ripple" style={{ left: ripple.x, top: ripple.y }} />)}
    </div>
  )
}

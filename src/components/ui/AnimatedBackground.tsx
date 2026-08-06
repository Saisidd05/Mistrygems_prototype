import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; phase: number }
type Blueprint = { x: number; y: number; size: number; kind: number; start: number; duration: number; drift: number }

const COLORS = {
  deep: '#03045E',
  blue: '#0077B6',
  teal: '#00B4D8',
  frost: '#90E0EF',
  cyan: '#CAF0F8',
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    let width = 0
    let height = 0
    let animationFrame = 0
    let lastTime = 0
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 }
    let nodes: Point[] = []
    let blueprints: Blueprint[] = []
    let particles: Point[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const random = (min: number, max: number) => min + Math.random() * (max - min)

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(scale, 0, 0, scale, 0, 0)

      nodes = Array.from({ length: Math.min(22, Math.max(12, Math.round(width / 90))) }, () => ({
        x: random(width * 0.05, width * 0.95), y: random(height * 0.12, height * 0.9), phase: random(0, Math.PI * 2),
      }))
      blueprints = Array.from({ length: Math.min(10, Math.max(6, Math.round(width / 170))) }, (_, index) => ({
        x: random(width * 0.04, width * 0.9), y: random(height * 0.12, height * 0.86), size: random(34, 98),
        kind: index % 5, start: random(0, 12), duration: random(7, 12), drift: random(-10, 10),
      }))
      particles = Array.from({ length: 38 }, () => ({ x: random(0, width), y: random(0, height), phase: random(0, Math.PI * 2) }))
    }

    const line = (x1: number, y1: number, x2: number, y2: number, alpha: number, lineWidth = 1) => {
      context.strokeStyle = `rgba(0, 180, 216, ${alpha})`
      context.lineWidth = lineWidth
      context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke()
    }

    const blueprint = (item: Blueprint, time: number) => {
      const cycle = ((time / 1000 + item.start) % item.duration) / item.duration
      const reveal = clamp(cycle * 4, 0, 1) * clamp((1 - cycle) * 5, 0, 1)
      const alpha = reveal * 0.18
      if (alpha < 0.01) return
      const x = item.x + Math.sin(time / 8000 + item.start) * item.drift
      const y = item.y + Math.cos(time / 9000 + item.start) * item.drift
      const s = item.size
      context.save()
      context.globalAlpha = alpha
      context.strokeStyle = COLORS.frost
      context.fillStyle = COLORS.teal
      context.lineWidth = 1
      context.setLineDash([4, 5])

      if (item.kind === 0) {
        context.beginPath(); context.arc(x, y, s * 0.42, 0, Math.PI * 2 * reveal); context.stroke()
        context.setLineDash([]); line(x - s * 0.62, y, x + s * 0.62, y, 0.55); line(x, y - s * 0.62, x, y + s * 0.62, 0.55)
        context.fillRect(x - 1.5, y - 1.5, 3, 3)
      } else if (item.kind === 1) {
        context.setLineDash([]); context.strokeRect(x - s * 0.55, y - s * 0.32, s * 1.1 * reveal, s * 0.64)
        line(x - s * 0.67, y + s * 0.48, x + s * 0.67, y + s * 0.48, 0.5)
        line(x - s * 0.67, y + s * 0.42, x - s * 0.67, y + s * 0.54, 0.5); line(x + s * 0.67, y + s * 0.42, x + s * 0.67, y + s * 0.54, 0.5)
      } else if (item.kind === 2) {
        context.setLineDash([]); context.beginPath()
        for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; const px = x + Math.cos(a) * s * 0.45; const py = y + Math.sin(a) * s * 0.45; i ? context.lineTo(px, py) : context.moveTo(px, py) }
        context.closePath(); context.stroke()
        context.beginPath(); context.arc(x, y, 2.5, 0, Math.PI * 2); context.fill()
      } else if (item.kind === 3) {
        context.setLineDash([]); line(x - s * 0.5, y + s * 0.36, x, y - s * 0.36, 0.7); line(x, y - s * 0.36, x + s * 0.5, y + s * 0.36, 0.7); line(x + s * 0.5, y + s * 0.36, x - s * 0.5, y + s * 0.36, 0.7)
        line(x, y - s * 0.36, x, y + s * 0.58, 0.4); line(x - s * 0.68, y + s * 0.58, x + s * 0.68, y + s * 0.58, 0.4)
      } else {
        context.setLineDash([]); line(x - s * 0.5, y, x + s * 0.5, y, 0.7); line(x, y - s * 0.5, x, y + s * 0.5, 0.7)
        context.beginPath(); context.arc(x, y, s * 0.28, 0, Math.PI * 2); context.stroke()
        context.fillRect(x - s * 0.58, y - 1, 5, 2); context.fillRect(x + s * 0.53, y - 1, 5, 2)
      }
      context.restore()
    }

    const draw = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      mouse.x += (mouse.targetX - mouse.x) * 0.045
      mouse.y += (mouse.targetY - mouse.y) * 0.045
      const gradient = context.createRadialGradient(width * 0.5, height * 0.35, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8)
      gradient.addColorStop(0, '#03045E'); gradient.addColorStop(0.65, '#03045E'); gradient.addColorStop(1, '#03045E')
      context.fillStyle = gradient; context.fillRect(0, 0, width, height)

      const parallaxX = clamp((mouse.x - width / 2) * 0.012, -9, 9)
      const parallaxY = clamp((mouse.y - height / 2) * 0.009, -7, 7)
      context.save(); context.translate(parallaxX, parallaxY)
      const spacing = 54
      const gridShift = (time / 1000) * 2.2 % spacing
      context.lineWidth = 1
      for (let x = -spacing; x < width + spacing; x += spacing) line(x + gridShift, 0, x + gridShift, height, 0.075)
      for (let y = -spacing; y < height + spacing; y += spacing) line(0, y + gridShift * 0.35, width, y + gridShift * 0.35, 0.065)
      context.strokeStyle = 'rgba(0, 119, 182, 0.14)'; context.beginPath()
      const horizon = height * 0.72
      for (let x = -width; x < width * 2; x += 92) { context.moveTo(width / 2, horizon); context.lineTo(x, height + 80) }
      for (let y = 0; y < 9; y++) { const p = y / 9; const yy = horizon + Math.pow(p, 1.8) * (height - horizon + 80); context.moveTo(0, yy); context.lineTo(width, yy) }
      context.stroke()

      blueprints.forEach((item) => blueprint(item, time))
      context.setLineDash([])
      nodes.forEach((node, index) => {
        const nearest = nodes.slice(index + 1).sort((a, b) => Math.hypot(a.x - node.x, a.y - node.y) - Math.hypot(b.x - node.x, b.y - node.y)).slice(0, 2)
        nearest.forEach((other, linkIndex) => {
          const distance = Math.hypot(other.x - node.x, other.y - node.y)
          if (distance > Math.min(width, height) * 0.42) return
          const proximity = clamp(1 - Math.hypot(mouse.x - (node.x + other.x) / 2, mouse.y - (node.y + other.y) / 2) / 230, 0, 1)
          line(node.x, node.y, other.x, other.y, 0.07 + proximity * 0.14)
          const pulse = ((time / 1700 + index * 0.23 + linkIndex * 0.37) % 1)
          const px = node.x + (other.x - node.x) * pulse; const py = node.y + (other.y - node.y) * pulse
          context.fillStyle = `rgba(144, 224, 239, ${0.32 + proximity * 0.35})`; context.beginPath(); context.arc(px, py, 1.5 + proximity, 0, Math.PI * 2); context.fill()
        })
        const nearby = clamp(1 - Math.hypot(mouse.x - node.x, mouse.y - node.y) / 150, 0, 1)
        const pulse = 0.45 + Math.sin(time / 850 + node.phase) * 0.18 + nearby * 0.35
        context.fillStyle = `rgba(144, 224, 239, ${pulse})`; context.shadowColor = COLORS.teal; context.shadowBlur = 5 + nearby * 10
        context.beginPath(); context.arc(node.x, node.y, 1.8 + nearby * 1.8, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0
      })
      particles.forEach((particle) => { const py = particle.y + Math.sin(time / 3200 + particle.phase) * 8; context.fillStyle = 'rgba(202, 240, 248, 0.18)'; context.fillRect(particle.x, py, 1.2, 1.2) })
      context.restore()

      const scanY = ((time / 7000) % 1.15) * (height + 100) - 50
      const scan = context.createLinearGradient(0, scanY - 14, 0, scanY + 14)
      scan.addColorStop(0, 'rgba(0, 180, 216, 0)'); scan.addColorStop(0.5, 'rgba(0, 180, 216, 0.13)'); scan.addColorStop(1, 'rgba(0, 180, 216, 0)')
      context.fillStyle = scan; context.fillRect(0, scanY - 14, width, 28)

      if (!reducedMotion && delta < 100) animationFrame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => { mouse.targetX = event.clientX; mouse.targetY = event.clientY }
    const onVisibility = () => { if (!document.hidden && !animationFrame) { lastTime = performance.now(); animationFrame = requestAnimationFrame(draw) } }
    resize(); draw(performance.now())
    window.addEventListener('resize', resize, { passive: true }); window.addEventListener('pointermove', onPointerMove, { passive: true }); document.addEventListener('visibilitychange', onVisibility)
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onPointerMove); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return <div className="engineering-background" aria-hidden="true"><canvas ref={canvasRef} /></div>
}

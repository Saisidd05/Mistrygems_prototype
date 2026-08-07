import { useEffect, useRef } from 'react'

const PALETTE = {
  deep: '#03045E',
  primary: '#0077B6',
  teal: '#00B4D8',
  frost: '#90E0EF',
  cyan: '#CAF0F8',
}

const RGBA = {
  deep: (a: number) => `rgba(3, 4, 94, ${Math.max(0, Math.min(1, a))})`,
  primary: (a: number) => `rgba(0, 119, 182, ${Math.max(0, Math.min(1, a))})`,
  teal: (a: number) => `rgba(0, 180, 216, ${Math.max(0, Math.min(1, a))})`,
  frost: (a: number) => `rgba(144, 224, 239, ${Math.max(0, Math.min(1, a))})`,
  cyan: (a: number) => `rgba(202, 240, 248, ${Math.max(0, Math.min(1, a))})`,
}

interface NodePoint {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  phase: number
  pulseGlow: number
  neighbors: number[]
}

interface CircuitPulse {
  fromIndex: number
  toIndex: number
  progress: number
  speed: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  maxAlpha: number
  life: number
  decay: number
  size: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  phase: number
  layer: number
}

interface BlueprintItem {
  id: number
  x: number
  y: number
  size: number
  kind: number
  rotation: number
  rotSpeed: number
  progress: number
  duration: number
  state: 'drawing' | 'holding' | 'fading'
  alpha: number
  label1: string
  label2: string
}

interface GridIntersection {
  x: number
  y: number
  glow: number
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))
const random = (min: number, max: number) => min + Math.random() * (max - min)

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let width = 0
    let height = 0
    let animFrameId = 0
    let lastTime = performance.now()

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    }

    let nodes: NodePoint[] = []
    let pulses: CircuitPulse[] = []
    let sparks: Spark[] = []
    let particles: Particle[] = []
    let blueprints: BlueprintItem[] = []
    let gridIntersections: GridIntersection[] = []

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createBlueprint = (w: number, h: number, index: number): BlueprintItem => {
      const kinds = 6
      const kind = index % kinds
      const labels = [
        ['Ø 84.5mm', 'RAD: 42.25'],
        ['W: 160mm', 'H: 95mm'],
        ['HEX-SEC', '0x4F8A'],
        ['MCU-32B', 'CLK 480MHz'],
        ['TARGET-A1', 'POS: 48.2'],
        ['ARC 120°', 'RADIUS 65'],
      ]
      return {
        id: Math.random(),
        x: random(w * 0.08, w * 0.92),
        y: random(h * 0.12, h * 0.88),
        size: random(55, 120),
        kind,
        rotation: random(0, Math.PI * 2),
        rotSpeed: random(-0.005, 0.005),
        progress: 0,
        duration: random(6000, 10000),
        state: 'drawing',
        alpha: 0,
        label1: labels[kind][0],
        label2: labels[kind][1],
      }
    }

    const initScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 1. Nodes & Circuit Network
      const nodeCount = Math.min(32, Math.max(16, Math.round(width / 75)))
      nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: random(width * 0.05, width * 0.95),
        y: random(height * 0.08, height * 0.92),
        vx: random(-0.15, 0.15),
        vy: random(-0.15, 0.15),
        baseRadius: random(2.2, 4),
        phase: random(0, Math.PI * 2),
        pulseGlow: 0,
        neighbors: [],
      }))

      // Connect nodes to nearest neighbors
      nodes.forEach((node) => {
        const sorted = [...nodes]
          .filter((n) => n.id !== node.id)
          .sort((a, b) => Math.hypot(a.x - node.x, a.y - node.y) - Math.hypot(b.x - node.x, b.y - node.y))
        node.neighbors = sorted.slice(0, random(2, 4) > 2.5 ? 3 : 2).map((n) => n.id)
      })

      // 2. Circuit Pulses
      pulses = Array.from({ length: Math.min(12, Math.max(6, Math.round(nodeCount / 3))) }, () => {
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)]
        const toId = fromNode.neighbors[Math.floor(Math.random() * fromNode.neighbors.length)] || 0
        return {
          fromIndex: fromNode.id,
          toIndex: toId,
          progress: Math.random(),
          speed: random(0.004, 0.012),
        }
      })

      // 3. Floating Particles
      const particleCount = Math.min(65, Math.max(35, Math.round(width / 30)))
      particles = Array.from({ length: particleCount }, () => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.25, 0.25),
        vy: random(-0.4, -0.1),
        size: random(1.2, 3),
        alpha: random(0.15, 0.55),
        phase: random(0, Math.PI * 2),
        layer: Math.floor(random(1, 4)),
      }))

      // 4. Blueprint Drawings
      const blueprintCount = Math.min(9, Math.max(5, Math.round(width / 220)))
      blueprints = Array.from({ length: blueprintCount }, (_, i) => createBlueprint(width, height, i))

      // 5. Grid Intersections
      const spacing = 55
      gridIntersections = []
      for (let gx = spacing; gx < width; gx += spacing * 2) {
        for (let gy = spacing; gy < height; gy += spacing * 2) {
          if (Math.random() > 0.45) {
            gridIntersections.push({ x: gx, y: gy, glow: random(0.1, 0.8) })
          }
        }
      }

      sparks = []
    }

    const spawnSparks = (x: number, y: number, count = 4) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = random(0.8, 2.5)
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          maxAlpha: random(0.7, 1),
          life: 0,
          decay: random(0.02, 0.05),
          size: random(1, 2.2),
        })
      }
    }

    // Helper line drawer with HSL/RGB colors strictly from palette
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, width = 1, dash: number[] = []) => {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.setLineDash(dash)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Render individual blueprint drawing with animated CAD sketching phase
    const renderBlueprint = (bp: BlueprintItem, time: number, dt: number) => {
      // Update blueprint progress state
      bp.progress += dt / bp.duration
      if (bp.progress >= 1) {
        // Respawn blueprint in a new position
        Object.assign(bp, createBlueprint(width, height, Math.floor(Math.random() * 6)))
        return
      }

      // State transitions: 0..0.3 drawing, 0.3..0.7 holding, 0.7..1.0 fading
      if (bp.progress < 0.3) {
        bp.state = 'drawing'
        bp.alpha = (bp.progress / 0.3) * 0.45
      } else if (bp.progress < 0.7) {
        bp.state = 'holding'
        bp.alpha = 0.45 + Math.sin(time * 0.002 + bp.id) * 0.08
      } else {
        bp.state = 'fading'
        bp.alpha = ((1 - bp.progress) / 0.3) * 0.45
      }

      if (bp.alpha <= 0.01) return

      const drawProgress = bp.state === 'drawing' ? bp.progress / 0.3 : 1
      bp.rotation += bp.rotSpeed

      // Slow drift movement
      const driftX = Math.sin(time * 0.0005 + bp.id) * 15
      const driftY = Math.cos(time * 0.0006 + bp.id) * 12
      const cx = bp.x + driftX
      const cy = bp.y + driftY
      const s = bp.size

      // Mouse proximity interaction (glowing brighter when mouse is near)
      const mouseDist = Math.hypot(mouse.x - cx, mouse.y - cy)
      const mouseGlow = clamp(1 - mouseDist / 200, 0, 1)
      const effectiveAlpha = clamp(bp.alpha + mouseGlow * 0.35, 0, 0.85)

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(bp.rotation)
      ctx.globalAlpha = effectiveAlpha
      ctx.strokeStyle = PALETTE.frost
      ctx.fillStyle = PALETTE.cyan
      ctx.shadowColor = PALETTE.teal
      ctx.shadowBlur = 6 + mouseGlow * 12

      if (bp.kind === 0) {
        // Kind 0: Rotating Gear & Concentric Compass
        const maxAngle = Math.PI * 2 * drawProgress
        ctx.lineWidth = 1.2
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.5, 0, maxAngle)
        ctx.stroke()

        ctx.setLineDash([])
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.35, 0, maxAngle)
        ctx.stroke()

        // Gear teeth
        const teeth = 8
        ctx.beginPath()
        for (let i = 0; i < teeth; i++) {
          const a = (i / teeth) * Math.PI * 2
          if (a <= maxAngle) {
            const rx1 = Math.cos(a) * (s * 0.35)
            const ry1 = Math.sin(a) * (s * 0.35)
            const rx2 = Math.cos(a) * (s * 0.44)
            const ry2 = Math.sin(a) * (s * 0.44)
            ctx.moveTo(rx1, ry1)
            ctx.lineTo(rx2, ry2)
          }
        }
        ctx.stroke()

        // Center crosshair
        if (drawProgress > 0.4) {
          drawLine(-s * 0.65, 0, s * 0.65, 0, RGBA.cyan(effectiveAlpha * 0.9), 1)
          drawLine(0, -s * 0.65, 0, s * 0.65, RGBA.cyan(effectiveAlpha * 0.9), 1)
          ctx.fillRect(-2, -2, 4, 4)
        }
      } else if (bp.kind === 1) {
        // Kind 1: Dimensioned CAD Rectangle
        const w = s * 1.2
        const h = s * 0.7
        const perimeter = 2 * (w + h)
        const currentLen = perimeter * drawProgress

        ctx.lineWidth = 1.4
        ctx.setLineDash([])

        // Draw rectangle side-by-side
        ctx.beginPath()
        let rLen = currentLen
        // Top
        ctx.moveTo(-w / 2, -h / 2)
        const topSeg = Math.min(rLen, w)
        ctx.lineTo(-w / 2 + topSeg, -h / 2)
        rLen = Math.max(0, rLen - w)
        // Right
        if (rLen > 0) {
          const rightSeg = Math.min(rLen, h)
          ctx.lineTo(w / 2, -h / 2 + rightSeg)
          rLen = Math.max(0, rLen - h)
        }
        // Bottom
        if (rLen > 0) {
          const botSeg = Math.min(rLen, w)
          ctx.lineTo(w / 2 - botSeg, h / 2)
          rLen = Math.max(0, rLen - w)
        }
        // Left
        if (rLen > 0) {
          const leftSeg = Math.min(rLen, h)
          ctx.lineTo(-w / 2, h / 2 - leftSeg)
        }
        ctx.stroke()

        // Extension & dimension lines
        if (drawProgress > 0.6) {
          const off = 16
          drawLine(-w / 2 - 5, h / 2 + off, w / 2 + 5, h / 2 + off, RGBA.frost(effectiveAlpha * 0.8), 1, [3, 3])
          drawLine(-w / 2, h / 2 + 4, -w / 2, h / 2 + off + 5, RGBA.frost(effectiveAlpha * 0.7), 1)
          drawLine(w / 2, h / 2 + 4, w / 2, h / 2 + off + 5, RGBA.frost(effectiveAlpha * 0.7), 1)
        }
      } else if (bp.kind === 2) {
        // Kind 2: Hexagonal Wireframe Node
        const sides = 6
        const radius = s * 0.48
        ctx.lineWidth = 1.3
        ctx.setLineDash([])
        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const a = (i / sides) * Math.PI * 2
          const p = i / sides
          if (p <= drawProgress) {
            const px = Math.cos(a) * radius
            const py = Math.sin(a) * radius
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
          }
        }
        ctx.stroke()

        // Inner spokes
        if (drawProgress > 0.5) {
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2
            drawLine(0, 0, Math.cos(a) * radius, Math.sin(a) * radius, RGBA.teal(effectiveAlpha * 0.7), 1, [2, 3])
          }
          ctx.beginPath()
          ctx.arc(0, 0, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (bp.kind === 3) {
        // Kind 3: Microchip IC Diagram
        const cw = s * 0.8
        const ch = s * 0.8
        ctx.lineWidth = 1.5
        ctx.setLineDash([])
        ctx.strokeRect(-cw / 2, -ch / 2, cw * drawProgress, ch)

        // Pins
        if (drawProgress > 0.4) {
          const pins = 4
          const pinLen = 12
          for (let i = 0; i < pins; i++) {
            const py = -ch / 2 + (ch / (pins + 1)) * (i + 1)
            drawLine(-cw / 2, py, -cw / 2 - pinLen, py, RGBA.cyan(effectiveAlpha * 0.8), 1.2)
            drawLine(cw / 2, py, cw / 2 + pinLen, py, RGBA.cyan(effectiveAlpha * 0.8), 1.2)
          }
        }
      } else if (bp.kind === 4) {
        // Kind 4: Radar Reticle / Target Bracket
        ctx.lineWidth = 1.2
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2 * drawProgress)
        ctx.stroke()

        // Target Brackets
        if (drawProgress > 0.5) {
          const bSize = 12
          const hs = s * 0.52
          ctx.setLineDash([])
          // Top Left
          drawLine(-hs, -hs, -hs + bSize, -hs, RGBA.cyan(effectiveAlpha), 1.8)
          drawLine(-hs, -hs, -hs, -hs + bSize, RGBA.cyan(effectiveAlpha), 1.8)
          // Bottom Right
          drawLine(hs, hs, hs - bSize, hs, RGBA.cyan(effectiveAlpha), 1.8)
          drawLine(hs, hs, hs, hs - bSize, RGBA.cyan(effectiveAlpha), 1.8)
        }
      } else {
        // Kind 5: Protractor Arc & Angle Vector
        const radius = s * 0.5
        const startAngle = -Math.PI / 3
        const endAngle = startAngle + Math.PI * 0.85 * drawProgress
        ctx.lineWidth = 1.4
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.stroke()

        if (drawProgress > 0.3) {
          drawLine(0, 0, Math.cos(endAngle) * (radius + 8), Math.sin(endAngle) * (radius + 8), RGBA.frost(effectiveAlpha), 1.5)
        }
      }

      // Technical Dimension Text Label
      if (drawProgress > 0.5) {
        ctx.rotate(-bp.rotation)
        ctx.font = "10px 'Space Grotesk', monospace"
        ctx.fillStyle = PALETTE.cyan
        ctx.fillText(bp.label1, s * 0.4, -s * 0.4)
        ctx.fillStyle = PALETTE.frost
        ctx.fillText(bp.label2, s * 0.4, -s * 0.4 + 12)
      }

      ctx.restore()
    }

    // MAIN ANIMATION LOOP
    const draw = (time: number) => {
      const dt = Math.min(time - lastTime, 50)
      lastTime = time

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      // Parallax shifts
      const parallaxX = clamp((mouse.x - width / 2) * 0.018, -12, 12)
      const parallaxY = clamp((mouse.y - height / 2) * 0.014, -10, 10)

      // ==========================================
      // LAYER 1: Dark Animated Background Gradient
      // ==========================================
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + parallaxX * 2,
        height * 0.4 + parallaxY * 2,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      )
      bgGrad.addColorStop(0, '#03045E')
      bgGrad.addColorStop(0.5, '#03045E')
      bgGrad.addColorStop(1, '#03045E')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Dynamic radial ambient pools
      const pool1X = width * 0.3 + Math.sin(time * 0.0004) * (width * 0.15)
      const pool1Y = height * 0.35 + Math.cos(time * 0.0005) * (height * 0.12)
      const pool1Grad = ctx.createRadialGradient(pool1X, pool1Y, 0, pool1X, pool1Y, width * 0.45)
      pool1Grad.addColorStop(0, RGBA.primary(0.18))
      pool1Grad.addColorStop(0.6, RGBA.teal(0.08))
      pool1Grad.addColorStop(1, 'rgba(3, 4, 94, 0)')
      ctx.fillStyle = pool1Grad
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(parallaxX, parallaxY)

      // ==========================================
      // LAYER 2: Moving Grid & Perspective Grid
      // ==========================================
      const spacing = 55
      const gridDriftX = (time * 0.012) % spacing
      const gridDriftY = (time * 0.008) % spacing

      // Scanline wave highlights across grid
      const waveX = (time * 0.08) % (width + spacing * 4) - spacing * 2
      const waveY = (time * 0.06) % (height + spacing * 4) - spacing * 2

      // Vertical Grid Lines
      for (let x = -spacing; x < width + spacing * 2; x += spacing) {
        const gx = x + gridDriftX
        const distToWave = Math.abs(gx - waveX)
        const waveGlow = clamp(1 - distToWave / 140, 0, 1)

        const distToMouse = Math.abs(gx - mouse.x)
        const mouseLineGlow = clamp(1 - distToMouse / 120, 0, 1)

        const isMajor = Math.round(gx) % (spacing * 3) < spacing
        const alpha = isMajor
          ? 0.22 + waveGlow * 0.25 + mouseLineGlow * 0.2
          : 0.14 + waveGlow * 0.18 + mouseLineGlow * 0.15

        const strokeColor = isMajor ? RGBA.teal(alpha) : RGBA.primary(alpha)
        drawLine(gx, 0, gx, height, strokeColor, isMajor ? 1.2 : 1)
      }

      // Horizontal Grid Lines
      for (let y = -spacing; y < height + spacing * 2; y += spacing) {
        const gy = y + gridDriftY
        const distToWave = Math.abs(gy - waveY)
        const waveGlow = clamp(1 - distToWave / 140, 0, 1)

        const distToMouse = Math.abs(gy - mouse.y)
        const mouseLineGlow = clamp(1 - distToMouse / 120, 0, 1)

        const isMajor = Math.round(gy) % (spacing * 3) < spacing
        const alpha = isMajor
          ? 0.20 + waveGlow * 0.22 + mouseLineGlow * 0.2
          : 0.12 + waveGlow * 0.16 + mouseLineGlow * 0.15

        const strokeColor = isMajor ? RGBA.teal(alpha) : RGBA.primary(alpha)
        drawLine(0, gy, width, gy, strokeColor, isMajor ? 1.2 : 1)
      }

      // Glowing Grid Intersections
      gridIntersections.forEach((gi) => {
        const ix = gi.x + gridDriftX
        const iy = gi.y + gridDriftY
        const pulse = 0.5 + Math.sin(time * 0.003 + gi.x + gi.y) * 0.5
        const alpha = 0.25 + pulse * gi.glow * 0.5
        ctx.fillStyle = RGBA.cyan(alpha)
        ctx.shadowColor = PALETTE.cyan
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(ix, iy, 1.8, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // 3D Perspective Grid at Bottom Horizon
      const horizonY = height * 0.72
      ctx.strokeStyle = RGBA.primary(0.18)
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let px = -width * 0.5; px < width * 1.5; px += 85) {
        ctx.moveTo(width * 0.5, horizonY)
        ctx.lineTo(px, height + 80)
      }
      for (let row = 0; row < 10; row++) {
        const progress = (row / 10 + (time * 0.00015) % 0.1)
        const ry = horizonY + Math.pow(progress, 2.2) * (height - horizonY + 80)
        ctx.moveTo(0, ry)
        ctx.lineTo(width, ry)
      }
      ctx.stroke()

      // ==========================================
      // LAYER 3: Blueprint Drawings
      // ==========================================
      blueprints.forEach((bp) => renderBlueprint(bp, time, dt))

      // ==========================================
      // LAYER 4: Circuit Network & Nodes
      // ==========================================
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        if (node.x < width * 0.04 || node.x > width * 0.96) node.vx *= -1
        if (node.y < height * 0.06 || node.y > height * 0.94) node.vy *= -1

        if (node.pulseGlow > 0) node.pulseGlow = Math.max(0, node.pulseGlow - dt * 0.003)

        const distToMouse = Math.hypot(mouse.x - node.x, mouse.y - node.y)
        const mouseNear = clamp(1 - distToMouse / 180, 0, 1)

        node.neighbors.forEach((targetId) => {
          const target = nodes[targetId]
          if (!target) return
          const dist = Math.hypot(target.x - node.x, target.y - node.y)
          if (dist > width * 0.45) return

          const midX = (node.x + target.x) / 2
          const midY = (node.y + target.y) / 2
          const midMouseDist = Math.hypot(mouse.x - midX, mouse.y - midY)
          const lineMouseGlow = clamp(1 - midMouseDist / 200, 0, 1)

          const lineAlpha = 0.14 + lineMouseGlow * 0.35 + (node.pulseGlow + target.pulseGlow) * 0.25
          drawLine(node.x, node.y, target.x, target.y, RGBA.teal(lineAlpha), 1 + lineMouseGlow)
        })

        const baseAlpha = 0.5 + Math.sin(time * 0.002 + node.phase) * 0.25 + mouseNear * 0.4 + node.pulseGlow
        const radius = node.baseRadius + mouseNear * 2 + node.pulseGlow * 2.5

        ctx.fillStyle = RGBA.cyan(clamp(baseAlpha, 0.4, 1))
        ctx.shadowColor = PALETTE.cyan
        ctx.shadowBlur = 8 + mouseNear * 14 + node.pulseGlow * 16
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // ==========================================
      // LAYER 5: Energy Pulses & Sparks
      // ==========================================
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed
        if (pulse.progress >= 1) {
          const toNode = nodes[pulse.toIndex]
          if (toNode) {
            toNode.pulseGlow = 1.0
            spawnSparks(toNode.x, toNode.y, 4)
            pulse.fromIndex = toNode.id
            const nextNeighbor = toNode.neighbors[Math.floor(Math.random() * toNode.neighbors.length)]
            pulse.toIndex = nextNeighbor !== undefined ? nextNeighbor : (toNode.id + 1) % nodes.length
          }
          pulse.progress = 0
        }

        const fromNode = nodes[pulse.fromIndex]
        const toNode = nodes[pulse.toIndex]
        if (fromNode && toNode) {
          const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress
          const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress

          ctx.fillStyle = PALETTE.cyan
          ctx.shadowColor = PALETTE.cyan
          ctx.shadowBlur = 12
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fill()

          const tailLen = 0.15
          const tailProg = Math.max(0, pulse.progress - tailLen)
          const tx = fromNode.x + (toNode.x - fromNode.x) * tailProg
          const ty = fromNode.y + (toNode.y - fromNode.y) * tailProg
          drawLine(tx, ty, px, py, RGBA.cyan(0.7), 2)
        }
      })
      ctx.shadowBlur = 0

      sparks.forEach((spark, index) => {
        spark.x += spark.vx
        spark.y += spark.vy
        spark.life += spark.decay
        spark.alpha = (1 - spark.life) * spark.maxAlpha

        if (spark.life >= 1) {
          sparks.splice(index, 1)
          return
        }

        ctx.fillStyle = RGBA.cyan(spark.alpha)
        ctx.fillRect(spark.x, spark.y, spark.size, spark.size)
      })

      // ==========================================
      // LAYER 6: Floating Ambient Particles
      // ==========================================
      particles.forEach((p) => {
        const speedMult = p.layer === 3 ? 1.4 : p.layer === 2 ? 1.0 : 0.6
        p.x += (p.vx + Math.sin(time * 0.001 + p.phase) * 0.15) * speedMult
        p.y += p.vy * speedMult

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 150 && dist > 0) {
          const force = (1 - dist / 150) * 2
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        if (p.y < -10) p.y = height + 10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const alpha = p.alpha * (0.6 + Math.sin(time * 0.002 + p.phase) * 0.4)
        ctx.fillStyle = p.layer === 3 ? RGBA.cyan(alpha) : p.layer === 2 ? RGBA.frost(alpha) : RGBA.teal(alpha)
        ctx.fillRect(p.x, p.y, p.size, p.size)
      })

      ctx.restore()

      // ==========================================
      // LAYER 7: Scanner Beams & Cursor Aura
      // ==========================================
      const scanY = ((time * 0.00012) % 1.2 - 0.1) * height
      const hScanGrad = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 25)
      hScanGrad.addColorStop(0, 'rgba(0, 180, 216, 0)')
      hScanGrad.addColorStop(0.5, RGBA.teal(0.14))
      hScanGrad.addColorStop(1, 'rgba(0, 180, 216, 0)')
      ctx.fillStyle = hScanGrad
      ctx.fillRect(0, scanY - 25, width, 50)
      drawLine(0, scanY, width, scanY, RGBA.frost(0.25), 1, [8, 8])

      const scanX = ((time * 0.00009) % 1.2 - 0.1) * width
      const vScanGrad = ctx.createLinearGradient(scanX - 25, 0, scanX + 25, 0)
      vScanGrad.addColorStop(0, 'rgba(0, 119, 182, 0)')
      vScanGrad.addColorStop(0.5, RGBA.primary(0.12))
      vScanGrad.addColorStop(1, 'rgba(0, 119, 182, 0)')
      ctx.fillStyle = vScanGrad
      ctx.fillRect(scanX - 25, 0, 50, height)

      if (mouse.x > 0 && mouse.y > 0) {
        const mouseAura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220)
        mouseAura.addColorStop(0, RGBA.teal(0.18))
        mouseAura.addColorStop(0.5, RGBA.primary(0.08))
        mouseAura.addColorStop(1, 'rgba(3, 4, 94, 0)')
        ctx.fillStyle = mouseAura
        ctx.fillRect(0, 0, width, height)

        const sortedNodes = [...nodes]
          .map((n) => ({ node: n, dist: Math.hypot(n.x + parallaxX - mouse.x, n.y + parallaxY - mouse.y) }))
          .filter((item) => item.dist < 200)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)

        sortedNodes.forEach(({ node, dist }) => {
          const lineAlpha = clamp(1 - dist / 200, 0, 1) * 0.45
          const nx = node.x + parallaxX
          const ny = node.y + parallaxY
          drawLine(mouse.x, mouse.y, nx, ny, RGBA.cyan(lineAlpha), 1.2, [4, 4])

          const p = (time * 0.003 + node.id) % 1
          const ipx = mouse.x + (nx - mouse.x) * p
          const ipy = mouse.y + (ny - mouse.y) * p
          ctx.fillStyle = PALETTE.cyan
          ctx.beginPath()
          ctx.arc(ipx, ipy, 2, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      if (!reducedMotion) {
        animFrameId = requestAnimationFrame(draw)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX
        mouse.targetY = e.touches[0].clientY
      }
    }

    const onVisibility = () => {
      if (!document.hidden && !animFrameId) {
        lastTime = performance.now()
        animFrameId = requestAnimationFrame(draw)
      }
    }

    initScene()
    draw(performance.now())

    window.addEventListener('resize', initScene, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', initScene)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="engineering-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

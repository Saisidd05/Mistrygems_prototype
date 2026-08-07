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
    let lastTimestamp = 0

    // Continuous real-time movement accumulators
    let gridOffset = 0
    let waveOffset = 0
    let hScanY = 0
    let vScanX = 0
    let diagScanPos = 0

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    }

    let nodes: any[] = []
    let pulses: any[] = []
    let sparks: any[] = []
    let particles: any[] = []
    let blueprints: any[] = []
    let gridDots: any[] = []

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createBlueprint = (w: number, h: number, index: number) => {
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
        x: random(w * 0.05, w * 0.95),
        y: random(h * 0.1, h * 0.9),
        vx: random(-0.4, 0.4),
        vy: random(-0.3, 0.3),
        size: random(65, 135),
        kind,
        rotation: random(0, Math.PI * 2),
        rotSpeed: random(-0.012, 0.012),
        progress: 0,
        duration: random(4000, 7000),
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

      hScanY = 0
      vScanX = 0
      diagScanPos = 0

      // 1. Dynamic Circuit Nodes
      const nodeCount = Math.min(36, Math.max(18, Math.round(width / 65)))
      nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: random(width * 0.05, width * 0.95),
        y: random(height * 0.08, height * 0.92),
        vx: random(-0.8, 0.8),
        vy: random(-0.8, 0.8),
        baseRadius: random(2.5, 4.5),
        phase: random(0, Math.PI * 2),
        pulseGlow: 0,
        neighbors: [],
      }))

      nodes.forEach((node) => {
        const sorted = [...nodes]
          .filter((n) => n.id !== node.id)
          .sort((a, b) => Math.hypot(a.x - node.x, a.y - node.y) - Math.hypot(b.x - node.x, b.y - node.y))
        node.neighbors = sorted.slice(0, random(2, 4) > 2.5 ? 3 : 2).map((n) => n.id)
      })

      // 2. High-Speed Racing Pulses
      pulses = Array.from({ length: Math.min(18, Math.max(10, Math.round(nodeCount / 2))) }, () => {
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)]
        const toId = fromNode.neighbors[Math.floor(Math.random() * fromNode.neighbors.length)] || 0
        return {
          fromIndex: fromNode.id,
          toIndex: toId,
          progress: Math.random(),
          speed: random(0.018, 0.04),
        }
      })

      // 3. Floating Particles
      const particleCount = Math.min(80, Math.max(45, Math.round(width / 22)))
      particles = Array.from({ length: particleCount }, () => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.8, 0.8),
        vy: random(-1.6, -0.6),
        size: random(1.5, 3.8),
        alpha: random(0.25, 0.7),
        phase: random(0, Math.PI * 2),
        layer: Math.floor(random(1, 4)),
      }))

      // 4. Blueprint Drawings
      const bpCount = Math.min(10, Math.max(6, Math.round(width / 180)))
      blueprints = Array.from({ length: bpCount }, (_, i) => createBlueprint(width, height, i))

      // 5. Grid Intersections
      const spacing = 55
      gridDots = []
      for (let gx = spacing; gx < width; gx += spacing * 2) {
        for (let gy = spacing; gy < height; gy += spacing * 2) {
          gridDots.push({ x: gx, y: gy, glow: random(0.3, 0.95), phase: random(0, Math.PI * 2) })
        }
      }
      sparks = []
    }

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w = 1, dash: number[] = []) => {
      ctx.strokeStyle = color
      ctx.lineWidth = w
      ctx.setLineDash(dash)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const renderBlueprint = (bp: any, dt: number, time: number) => {
      bp.x += bp.vx * (dt / 16)
      bp.y += bp.vy * (dt / 16)
      bp.rotation += bp.rotSpeed * (dt / 16)

      if (bp.x < -100) bp.x = width + 100
      if (bp.x > width + 100) bp.x = -100
      if (bp.y < -100) bp.y = height + 100
      if (bp.y > height + 100) bp.y = -100

      bp.progress += dt / bp.duration
      if (bp.progress >= 1) {
        Object.assign(bp, createBlueprint(width, height, Math.floor(Math.random() * 6)))
        return
      }

      if (bp.progress < 0.3) {
        bp.alpha = (bp.progress / 0.3) * 0.6
      } else if (bp.progress < 0.75) {
        bp.alpha = 0.6 + Math.sin(time * 0.004 + bp.id) * 0.12
      } else {
        bp.alpha = ((1 - bp.progress) / 0.25) * 0.6
      }

      if (bp.alpha <= 0.01) return

      const drawProgress = bp.progress < 0.3 ? bp.progress / 0.3 : 1

      const mouseDist = Math.hypot(mouse.x - bp.x, mouse.y - bp.y)
      const mouseGlow = clamp(1 - mouseDist / 220, 0, 1)
      const effectiveAlpha = clamp(bp.alpha + mouseGlow * 0.35, 0, 0.95)

      ctx.save()
      ctx.translate(bp.x, bp.y)
      ctx.rotate(bp.rotation)
      ctx.globalAlpha = effectiveAlpha
      ctx.strokeStyle = PALETTE.frost
      ctx.fillStyle = PALETTE.cyan
      ctx.shadowColor = PALETTE.teal
      ctx.shadowBlur = 8 + mouseGlow * 15

      const s = bp.size

      if (bp.kind === 0) {
        const maxAngle = Math.PI * 2 * drawProgress
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.5, 0, maxAngle)
        ctx.stroke()

        ctx.setLineDash([])
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.35, 0, maxAngle)
        ctx.stroke()

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

        if (drawProgress > 0.4) {
          drawLine(-s * 0.65, 0, s * 0.65, 0, RGBA.cyan(effectiveAlpha), 1.2)
          drawLine(0, -s * 0.65, 0, s * 0.65, RGBA.cyan(effectiveAlpha), 1.2)
          ctx.fillRect(-2.5, -2.5, 5, 5)
        }
      } else if (bp.kind === 1) {
        const w = s * 1.2
        const h = s * 0.7
        const perimeter = 2 * (w + h)
        const currentLen = perimeter * drawProgress

        ctx.lineWidth = 1.6
        ctx.setLineDash([])
        ctx.beginPath()
        let rLen = currentLen
        ctx.moveTo(-w / 2, -h / 2)
        const topSeg = Math.min(rLen, w)
        ctx.lineTo(-w / 2 + topSeg, -h / 2)
        rLen = Math.max(0, rLen - w)
        if (rLen > 0) {
          const rightSeg = Math.min(rLen, h)
          ctx.lineTo(w / 2, -h / 2 + rightSeg)
          rLen = Math.max(0, rLen - h)
        }
        if (rLen > 0) {
          const botSeg = Math.min(rLen, w)
          ctx.lineTo(w / 2 - botSeg, h / 2)
          rLen = Math.max(0, rLen - w)
        }
        if (rLen > 0) {
          const leftSeg = Math.min(rLen, h)
          ctx.lineTo(-w / 2, h / 2 - leftSeg)
        }
        ctx.stroke()

        if (drawProgress > 0.6) {
          const off = 16
          drawLine(-w / 2 - 5, h / 2 + off, w / 2 + 5, h / 2 + off, RGBA.frost(effectiveAlpha * 0.85), 1, [3, 3])
          drawLine(-w / 2, h / 2 + 4, -w / 2, h / 2 + off + 5, RGBA.frost(effectiveAlpha * 0.8), 1)
          drawLine(w / 2, h / 2 + 4, w / 2, h / 2 + off + 5, RGBA.frost(effectiveAlpha * 0.8), 1)
        }
      } else if (bp.kind === 2) {
        const sides = 6
        const radius = s * 0.48
        ctx.lineWidth = 1.5
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

        if (drawProgress > 0.5) {
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2
            drawLine(0, 0, Math.cos(a) * radius, Math.sin(a) * radius, RGBA.teal(effectiveAlpha * 0.75), 1, [2, 3])
          }
          ctx.beginPath()
          ctx.arc(0, 0, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (bp.kind === 3) {
        const cw = s * 0.8
        const ch = s * 0.8
        ctx.lineWidth = 1.8
        ctx.setLineDash([])
        ctx.strokeRect(-cw / 2, -ch / 2, cw * drawProgress, ch)

        if (drawProgress > 0.4) {
          const pins = 4
          const pinLen = 14
          for (let i = 0; i < pins; i++) {
            const py = -ch / 2 + (ch / (pins + 1)) * (i + 1)
            drawLine(-cw / 2, py, -cw / 2 - pinLen, py, RGBA.cyan(effectiveAlpha * 0.9), 1.5)
            drawLine(cw / 2, py, cw / 2 + pinLen, py, RGBA.cyan(effectiveAlpha * 0.9), 1.5)
          }
        }
      } else if (bp.kind === 4) {
        ctx.lineWidth = 1.4
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2 * drawProgress)
        ctx.stroke()

        if (drawProgress > 0.5) {
          const bSize = 14
          const hs = s * 0.52
          ctx.setLineDash([])
          drawLine(-hs, -hs, -hs + bSize, -hs, RGBA.cyan(effectiveAlpha), 2.2)
          drawLine(-hs, -hs, -hs, -hs + bSize, RGBA.cyan(effectiveAlpha), 2.2)
          drawLine(hs, hs, hs - bSize, hs, RGBA.cyan(effectiveAlpha), 2.2)
          drawLine(hs, hs, hs, hs - bSize, RGBA.cyan(effectiveAlpha), 2.2)
        }
      } else {
        const radius = s * 0.5
        const startAngle = -Math.PI / 3
        const endAngle = startAngle + Math.PI * 0.85 * drawProgress
        ctx.lineWidth = 1.6
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.stroke()

        if (drawProgress > 0.3) {
          drawLine(0, 0, Math.cos(endAngle) * (radius + 10), Math.sin(endAngle) * (radius + 10), RGBA.frost(effectiveAlpha), 1.8)
        }
      }

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

    // MAIN CONTINUOUS ANIMATION LOOP
    const draw = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const dt = Math.min(timestamp - lastTimestamp, 50)
      lastTimestamp = timestamp

      // Real-time motion accumulators
      const deltaSec = dt / 1000
      gridOffset += deltaSec * 35
      waveOffset += deltaSec * 160

      hScanY = (hScanY + deltaSec * 220) % (height + 100)
      vScanX = (vScanX + deltaSec * 260) % (width + 100)
      diagScanPos = (diagScanPos + deltaSec * 180) % (width + height + 200)

      mouse.x += (mouse.targetX - mouse.x) * 0.14
      mouse.y += (mouse.targetY - mouse.y) * 0.14

      const parallaxX = clamp((mouse.x - width / 2) * 0.02, -15, 15)
      const parallaxY = clamp((mouse.y - height / 2) * 0.016, -12, 12)

      // Layer 1: Background Base & Shifting Gradient Pools
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

      const pool1X = width * 0.3 + Math.sin(timestamp * 0.001) * (width * 0.22)
      const pool1Y = height * 0.35 + Math.cos(timestamp * 0.0012) * (height * 0.18)
      const pool1Grad = ctx.createRadialGradient(pool1X, pool1Y, 0, pool1X, pool1Y, width * 0.45)
      pool1Grad.addColorStop(0, RGBA.primary(0.24))
      pool1Grad.addColorStop(0.6, RGBA.teal(0.12))
      pool1Grad.addColorStop(1, 'rgba(3, 4, 94, 0)')
      ctx.fillStyle = pool1Grad
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.translate(parallaxX, parallaxY)

      // Layer 2: CONTINUOUSLY MOVING GRID
      const spacing = 55
      const gridShiftX = gridOffset % spacing
      const gridShiftY = (gridOffset * 0.7) % spacing

      // Vertical Grid Lines
      for (let x = -spacing; x < width + spacing * 2; x += spacing) {
        const gx = x + gridShiftX
        const distToWave = Math.abs(gx - (waveOffset % (width + spacing * 4)))
        const waveGlow = clamp(1 - distToWave / 140, 0, 1)

        const distToMouse = Math.abs(gx - mouse.x)
        const mouseLineGlow = clamp(1 - distToMouse / 120, 0, 1)

        const isMajor = Math.round(gx) % (spacing * 3) < spacing
        const alpha = isMajor
          ? 0.28 + waveGlow * 0.3 + mouseLineGlow * 0.25
          : 0.18 + waveGlow * 0.22 + mouseLineGlow * 0.2

        drawLine(gx, 0, gx, height, isMajor ? RGBA.teal(alpha) : RGBA.primary(alpha), isMajor ? 1.4 : 1)
      }

      // Horizontal Grid Lines
      for (let y = -spacing; y < height + spacing * 2; y += spacing) {
        const gy = y + gridShiftY
        const distToWave = Math.abs(gy - (waveOffset % (height + spacing * 4)))
        const waveGlow = clamp(1 - distToWave / 140, 0, 1)

        const distToMouse = Math.abs(gy - mouse.y)
        const mouseLineGlow = clamp(1 - distToMouse / 120, 0, 1)

        const isMajor = Math.round(gy) % (spacing * 3) < spacing
        const alpha = isMajor
          ? 0.26 + waveGlow * 0.28 + mouseLineGlow * 0.25
          : 0.16 + waveGlow * 0.2 + mouseLineGlow * 0.2

        drawLine(0, gy, width, gy, isMajor ? RGBA.teal(alpha) : RGBA.primary(alpha), isMajor ? 1.4 : 1)
      }

      // Glowing Grid Intersection Dots
      gridDots.forEach((gd) => {
        const ix = gd.x + gridShiftX
        const iy = gd.y + gridShiftY
        const pulse = 0.5 + Math.sin(timestamp * 0.005 + gd.phase) * 0.5
        const alpha = 0.35 + pulse * gd.glow * 0.55
        ctx.fillStyle = RGBA.cyan(alpha)
        ctx.shadowColor = PALETTE.cyan
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(ix, iy, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // 3D Perspective Grid
      const horizonY = height * 0.72
      ctx.strokeStyle = RGBA.primary(0.25)
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let px = -width * 0.5; px < width * 1.5; px += 80) {
        ctx.moveTo(width * 0.5, horizonY)
        ctx.lineTo(px, height + 80)
      }
      for (let row = 0; row < 10; row++) {
        const progress = (row / 10 + (timestamp * 0.0008) % 0.1)
        const ry = horizonY + Math.pow(progress, 2.2) * (height - horizonY + 80)
        ctx.moveTo(0, ry)
        ctx.lineTo(width, ry)
      }
      ctx.stroke()

      // Layer 3: MOVING BLUEPRINT SCHEMATICS
      blueprints.forEach((bp) => renderBlueprint(bp, dt, timestamp))

      // Layer 4: CONTINUOUSLY FLOATING NODES & TRACES
      nodes.forEach((node) => {
        node.x += node.vx * (dt / 16)
        node.y += node.vy * (dt / 16)

        if (node.x < width * 0.04 || node.x > width * 0.96) node.vx *= -1
        if (node.y < height * 0.06 || node.y > height * 0.94) node.vy *= -1

        if (node.pulseGlow > 0) node.pulseGlow = Math.max(0, node.pulseGlow - dt * 0.004)

        const distToMouse = Math.hypot(mouse.x - node.x, mouse.y - node.y)
        const mouseNear = clamp(1 - distToMouse / 200, 0, 1)

        node.neighbors.forEach((targetId: number) => {
          const target = nodes[targetId]
          if (!target) return
          const dist = Math.hypot(target.x - node.x, target.y - node.y)
          if (dist > width * 0.45) return

          const midX = (node.x + target.x) / 2
          const midY = (node.y + target.y) / 2
          const midMouseDist = Math.hypot(mouse.x - midX, mouse.y - midY)
          const lineMouseGlow = clamp(1 - midMouseDist / 220, 0, 1)

          const lineAlpha = 0.2 + lineMouseGlow * 0.4 + (node.pulseGlow + target.pulseGlow) * 0.3
          drawLine(node.x, node.y, target.x, target.y, RGBA.teal(lineAlpha), 1.2 + lineMouseGlow * 0.8)
        })

        const baseAlpha = 0.65 + Math.sin(timestamp * 0.004 + node.phase) * 0.3 + mouseNear * 0.4 + node.pulseGlow
        const radius = node.baseRadius + mouseNear * 2.5 + node.pulseGlow * 3.5

        ctx.fillStyle = RGBA.cyan(clamp(baseAlpha, 0.45, 1))
        ctx.shadowColor = PALETTE.cyan
        ctx.shadowBlur = 10 + mouseNear * 16 + node.pulseGlow * 20
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // Layer 5: FAST RACING CIRCUIT PULSES & SPARKS
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed * (dt / 16)
        if (pulse.progress >= 1) {
          const toNode = nodes[pulse.toIndex]
          if (toNode) {
            toNode.pulseGlow = 1.0
            for (let i = 0; i < 5; i++) {
              const angle = Math.random() * Math.PI * 2
              const speed = random(1.5, 4.2)
              sparks.push({
                x: toNode.x,
                y: toNode.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                maxAlpha: random(0.8, 1),
                life: 0,
                decay: random(0.03, 0.07),
                size: random(1.2, 2.8),
              })
            }
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
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.arc(px, py, 3.5, 0, Math.PI * 2)
          ctx.fill()

          const tailLen = 0.2
          const tailProg = Math.max(0, pulse.progress - tailLen)
          const tx = fromNode.x + (toNode.x - fromNode.x) * tailProg
          const ty = fromNode.y + (toNode.y - fromNode.y) * tailProg
          drawLine(tx, ty, px, py, RGBA.cyan(0.85), 2.5)
        }
      })
      ctx.shadowBlur = 0

      // Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]
        spark.x += spark.vx * (dt / 16)
        spark.y += spark.vy * (dt / 16)
        spark.life += spark.decay
        spark.alpha = (1 - spark.life) * spark.maxAlpha

        if (spark.life >= 1) {
          sparks.splice(i, 1)
          continue
        }

        ctx.fillStyle = RGBA.cyan(spark.alpha)
        ctx.fillRect(spark.x, spark.y, spark.size, spark.size)
      }

      // Layer 6: CONTINUOUSLY RISING PARTICLES
      particles.forEach((p) => {
        const speedMult = p.layer === 3 ? 1.6 : p.layer === 2 ? 1.1 : 0.7
        p.x += (p.vx + Math.sin(timestamp * 0.003 + p.phase) * 0.5) * speedMult * (dt / 16)
        p.y += p.vy * speedMult * (dt / 16)

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 160 && dist > 0) {
          const force = (1 - dist / 160) * 3
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        if (p.y < -10) p.y = height + 10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const alpha = p.alpha * (0.6 + Math.sin(timestamp * 0.004 + p.phase) * 0.4)
        ctx.fillStyle = p.layer === 3 ? RGBA.cyan(alpha) : p.layer === 2 ? RGBA.frost(alpha) : RGBA.teal(alpha)
        ctx.fillRect(p.x, p.y, p.size, p.size)
      })

      ctx.restore()

      // Layer 7: CONTINUOUS SCANNER LASERS & CURSOR AURA
      // 1. Horizontal Laser
      const hScanYPos = (hScanY - 50) % (height + 100)
      const hScanGrad = ctx.createLinearGradient(0, hScanYPos - 30, 0, hScanYPos + 30)
      hScanGrad.addColorStop(0, 'rgba(0, 180, 216, 0)')
      hScanGrad.addColorStop(0.5, RGBA.teal(0.22))
      hScanGrad.addColorStop(1, 'rgba(0, 180, 216, 0)')
      ctx.fillStyle = hScanGrad
      ctx.fillRect(0, hScanYPos - 30, width, 60)
      drawLine(0, hScanYPos, width, hScanYPos, RGBA.frost(0.4), 1.8, [12, 8])

      // 2. Vertical Laser
      const vScanXPos = (vScanX - 50) % (width + 100)
      const vScanGrad = ctx.createLinearGradient(vScanXPos - 30, 0, vScanXPos + 30, 0)
      vScanGrad.addColorStop(0, 'rgba(0, 119, 182, 0)')
      vScanGrad.addColorStop(0.5, RGBA.primary(0.2))
      vScanGrad.addColorStop(1, 'rgba(0, 119, 182, 0)')
      ctx.fillStyle = vScanGrad
      ctx.fillRect(vScanXPos - 30, 0, 60, height)
      drawLine(vScanXPos, 0, vScanXPos, height, RGBA.frost(0.3), 1.5, [10, 8])

      // 3. Diagonal Laser Sweep
      const dPos = diagScanPos % (width + height + 200) - 100
      ctx.strokeStyle = RGBA.cyan(0.18)
      ctx.lineWidth = 2
      ctx.setLineDash([15, 10])
      ctx.beginPath()
      ctx.moveTo(dPos, 0)
      ctx.lineTo(dPos - height, height)
      ctx.stroke()

      // Interactive Mouse Laser Aura & Magnetic Connectors
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseAura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240)
        mouseAura.addColorStop(0, RGBA.teal(0.24))
        mouseAura.addColorStop(0.5, RGBA.primary(0.12))
        mouseAura.addColorStop(1, 'rgba(3, 4, 94, 0)')
        ctx.fillStyle = mouseAura
        ctx.fillRect(0, 0, width, height)

        const sortedNodes = [...nodes]
          .map((n) => ({ node: n, dist: Math.hypot(n.x + parallaxX - mouse.x, n.y + parallaxY - mouse.y) }))
          .filter((item) => item.dist < 220)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)

        sortedNodes.forEach(({ node, dist }) => {
          const lineAlpha = clamp(1 - dist / 220, 0, 1) * 0.6
          const nx = node.x + parallaxX
          const ny = node.y + parallaxY
          drawLine(mouse.x, mouse.y, nx, ny, RGBA.cyan(lineAlpha), 1.5, [4, 4])

          const p = (timestamp * 0.006 + node.id) % 1
          const ipx = mouse.x + (nx - mouse.x) * p
          const ipy = mouse.y + (ny - mouse.y) * p
          ctx.fillStyle = PALETTE.cyan
          ctx.beginPath()
          ctx.arc(ipx, ipy, 2.8, 0, Math.PI * 2)
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
      if (!document.hidden) {
        lastTimestamp = performance.now()
        cancelAnimationFrame(animFrameId)
        animFrameId = requestAnimationFrame(draw)
      }
    }

    initScene()
    animFrameId = requestAnimationFrame(draw)

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

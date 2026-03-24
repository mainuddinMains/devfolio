"use client"

import { useEffect, useRef } from "react"

interface Pulse {
  x: number
  y: number
  r: number
  a: number
}

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let t = 0
    let frameCount = 0
    const pulses: Pulse[] = []
    let rafId = 0
    let paused = false

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function draw() {
      if (!canvas || !ctx) return

      const W = canvas.width
      const H = canvas.height
      const cell = 28

      // Step 1 — clear
      ctx.clearRect(0, 0, W, H)

      // Step 2 — grid dots
      const cols = Math.ceil(W / cell)
      const rows = Math.ceil(H / cell)
      for (let xi = 0; xi <= cols; xi++) {
        for (let yi = 0; yi <= rows; yi++) {
          const wave = Math.sin(xi * 0.04 + t) * Math.cos(yi * 0.04 + t * 0.7)
          const alpha = Math.max(0, wave * 0.25 + 0.06)
          ctx.beginPath()
          ctx.arc(xi * cell, yi * cell, 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(129,140,248,${alpha.toFixed(3)})`
          ctx.fill()
        }
      }

      // Step 3 — horizontal scan line
      const scanY = ((Math.sin(t * 0.4) + 1) / 2) * H
      const hGrad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12)
      hGrad.addColorStop(0, "rgba(110,231,183,0)")
      hGrad.addColorStop(0.5, "rgba(110,231,183,0.08)")
      hGrad.addColorStop(1, "rgba(110,231,183,0)")
      ctx.fillStyle = hGrad
      ctx.fillRect(0, scanY - 12, W, 24)
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(W, scanY)
      ctx.strokeStyle = "rgba(110,231,183,0.15)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Step 4 — vertical scan line
      const scanX = ((Math.sin(t * 0.3 + 1.5) + 1) / 2) * W
      const vGrad = ctx.createLinearGradient(scanX - 12, 0, scanX + 12, 0)
      vGrad.addColorStop(0, "rgba(129,140,248,0)")
      vGrad.addColorStop(0.5, "rgba(129,140,248,0.06)")
      vGrad.addColorStop(1, "rgba(129,140,248,0)")
      ctx.fillStyle = vGrad
      ctx.fillRect(scanX - 12, 0, 24, H)
      ctx.beginPath()
      ctx.moveTo(scanX, 0)
      ctx.lineTo(scanX, H)
      ctx.strokeStyle = "rgba(129,140,248,0.1)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Step 5 — pulse rings
      if (frameCount % 100 === 0) {
        const gx = Math.floor(Math.random() * cols) * cell
        const gy = Math.floor(Math.random() * rows) * cell
        pulses.push({ x: gx, y: gy, r: 0, a: 0.35 })
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(244,114,182,${p.a.toFixed(3)})`
        ctx.lineWidth = 1
        ctx.stroke()
        p.r += 0.9
        p.a -= 0.004
        if (p.a <= 0) pulses.splice(i, 1)
      }

      // Step 6 — advance time
      t += 0.016
      frameCount++
    }

    function loop() {
      if (!paused) draw()
      rafId = requestAnimationFrame(loop)
    }

    function handleVisibility() {
      paused = document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibility)

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.55,
      }}
    />
  )
}

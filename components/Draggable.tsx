"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface DraggableProps {
  id: string
  children: React.ReactNode
  handlePos?: "top-right" | "top-left"
}

export default function Draggable({ id, children, handlePos = "top-right" }: DraggableProps) {
  const [pos, setPos]         = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const movedRef = useRef(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`drag_${id}`)
      if (saved) setPos(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [id])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    movedRef.current = false
    setDragging(true)
    const startX = e.clientX - pos.x
    const startY = e.clientY - pos.y

    function onMove(ev: MouseEvent) {
      movedRef.current = true
      const next = { x: ev.clientX - startX, y: ev.clientY - startY }
      setPos(next)
      localStorage.setItem(`drag_${id}`, JSON.stringify(next))
    }
    function onUp() {
      setDragging(false)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }, [pos, id])

  // Block child click events when a drag actually moved the element
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (movedRef.current) {
      e.stopPropagation()
      e.preventDefault()
      movedRef.current = false
    }
  }, [])

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const zero = { x: 0, y: 0 }
    setPos(zero)
    localStorage.removeItem(`drag_${id}`)
  }, [id])

  const side = handlePos === "top-left"
    ? { left: 8, right: "auto" }
    : { right: 8, left: "auto" }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClickCapture={onClickCapture}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        position: "relative",
        zIndex: dragging ? 999 : undefined,
      }}
    >
      {/* ── Drag handle ── */}
      <div
        style={{
          position: "absolute",
          top: 8,
          ...side,
          zIndex: 60,
          opacity: hovered || dragging ? 1 : 0,
          transition: "opacity 0.15s ease",
          pointerEvents: hovered || dragging ? "auto" : "none",
        }}
      >
        <span
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
          title="Drag · Double-click to reset"
          style={{
            cursor: dragging ? "grabbing" : "grab",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.2rem",
            background: "rgba(6,6,8,0.75)",
            border: "1px solid rgba(129,140,248,0.35)",
            borderRadius: 5,
            padding: "0.18rem 0.4rem",
            fontSize: "0.62rem",
            color: "#818cf8",
            userSelect: "none",
            backdropFilter: "blur(6px)",
            whiteSpace: "nowrap",
          }}
        >
          ⠿
        </span>
      </div>

      {children}
    </div>
  )
}

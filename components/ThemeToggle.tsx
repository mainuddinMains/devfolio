"use client"

import { useState, useEffect } from "react"

const LS_KEY = "devfolio_theme"

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function ThemeToggle() {
  // Start as dark (matches default CSS); will be corrected on mount
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light")
    setIsDark(!isLight)
    setMounted(true)
  }, [])

  function toggle() {
    const html = document.documentElement
    if (isDark) {
      html.classList.add("light")
      localStorage.setItem(LS_KEY, "light")
    } else {
      html.classList.remove("light")
      localStorage.setItem(LS_KEY, "dark")
    }
    setIsDark((v) => !v)
  }

  // Render a placeholder with same dimensions while unmounted to avoid layout shift
  if (!mounted) {
    return <div style={{ width: 32, height: 32 }} />
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        border: "1px solid var(--border2)",
        background: "var(--s2)",
        color: "var(--muted)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = isDark ? "var(--a4)" : "var(--a2)"
        el.style.color       = isDark ? "var(--a4)" : "var(--a2)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = "var(--border2)"
        el.style.color       = "var(--muted)"
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

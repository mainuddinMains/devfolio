"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { personalInfo } from "@/data/personal"
import GlowingAvatar from "@/components/GlowingAvatar"

const LS_NAME        = "devfolio_hero_name"
const LS_TAGLINE     = "devfolio_hero_tagline"
const LS_NAME_POS    = "devfolio_hero_name_pos"
const LS_TAGLINE_POS = "devfolio_hero_tagline_pos"

type Pos = { x: number; y: number }

function useDraggable(lsKey: string): [Pos, (e: React.MouseEvent) => void, React.Dispatch<React.SetStateAction<Pos>>] {
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(lsKey)
      if (saved) setPos(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [lsKey])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX - pos.x
    const startY = e.clientY - pos.y

    function onMove(ev: MouseEvent) {
      const next = { x: ev.clientX - startX, y: ev.clientY - startY }
      setPos(next)
      localStorage.setItem(lsKey, JSON.stringify(next))
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }, [pos, lsKey])

  return [pos, onMouseDown, setPos]
}

interface Stats {
  projects: number
  disciplines: number
  years: number
  technologies: number
}

interface HeroSectionProps {
  stats: Stats
}

const STAT_COLORS = ["#6ee7b7", "#818cf8", "#f472b6", "#fbbf24"]

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible]         = useState(false)
  const [heroName, setHeroName]       = useState(personalInfo.name)
  const [tagline, setTagline]         = useState("Love to build things")
  const [editingName, setEditingName] = useState(false)
  const [editingTag, setEditingTag]   = useState(false)
  const [namePos, onDragName]         = useDraggable(LS_NAME_POS)
  const [tagPos,  onDragTag]          = useDraggable(LS_TAGLINE_POS)

  // Load saved text values from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem(LS_NAME)
    const savedTag  = localStorage.getItem(LS_TAGLINE)
    if (savedName) setHeroName(savedName)
    if (savedTag)  setTagline(savedTag)
  }, [])

  const saveName = useCallback((val: string) => {
    const trimmed = val.trim() || personalInfo.name
    setHeroName(trimmed)
    localStorage.setItem(LS_NAME, trimmed)
    setEditingName(false)
  }, [])

  const saveTagline = useCallback((val: string) => {
    const trimmed = val.trim() || "Love to build things"
    setTagline(trimmed)
    localStorage.setItem(LS_TAGLINE, trimmed)
    setEditingTag(false)
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const statItems = [
    { label: "Projects",     value: stats.projects },
    { label: "Disciplines",  value: stats.disciplines },
    { label: "Years Exp",    value: stats.years },
    { label: "Technologies", value: stats.technologies },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.7s ease-out forwards;
        }

        /* ── Wrapper ── */
        .hero-wrap {
          width: 100%;
          padding: 5rem 1.5rem 3.5rem;
          opacity: 0;
        }
        .hero-wrap.visible { opacity: 1; }

        @media (min-width: 640px)  { .hero-wrap { padding: 6rem 2.5rem 4rem; } }
        @media (min-width: 1024px) { .hero-wrap { padding: 7rem 4rem 5rem; } }
        @media (min-width: 1440px) { .hero-wrap { padding: 7rem 6rem 5rem; } }

        /* ── Two-column grid ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 3rem;
        }

        /* Left: stacked content */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* Right: avatar — centered */
        .hero-avatar-col {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Stats bar below the grid */
        .hero-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 3rem;
        }

        /* ── Mobile (< 768px): stack, avatar on top ── */
        @media (max-width: 767px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .hero-avatar-col {
            order: -1;   /* avatar above text */
          }
          .hero-avatar-col .avatar-size-override {
            width: 180px !important;
            height: 180px !important;
          }
        }

        /* Mobile: 2x2 stats */
        @media (max-width: 480px) {
          .hero-stats-bar { grid-template-columns: repeat(2, 1fr); }
          .hero-stats-bar > div:nth-child(even) { border-right: none !important; }
          .hero-stats-bar > div:nth-child(1),
          .hero-stats-bar > div:nth-child(2)    { border-bottom: 1px solid var(--border); }
        }
      `}</style>

      <div
        id="about"
        ref={wrapperRef}
        className={`hero-wrap${visible ? " visible animate-in" : ""}`}
      >
        <div className="hero-grid">

          {/* ── LEFT: text content ── */}
          <div className="hero-left">

            {/* 1. Name greeting */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.08s",
                transform: `translate(${namePos.x}px, ${namePos.y}px)`,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                userSelect: "none",
              }}
            >
              {/* drag handle */}
              <span
                onMouseDown={onDragName}
                title="Drag to reposition"
                style={{
                  cursor: "grab",
                  opacity: 0.3,
                  fontSize: "1rem",
                  lineHeight: 1,
                  touchAction: "none",
                }}
              >⠿</span>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                  color: "var(--muted)",
                  margin: 0,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                Hi, I&apos;m{" "}
                {editingName ? (
                  <input
                    autoFocus
                    defaultValue={heroName}
                    onBlur={(e) => saveName(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName(e.currentTarget.value)
                      if (e.key === "Escape") setEditingName(false)
                    }}
                    style={{
                      background: "rgba(110,231,183,0.08)",
                      border: "1px solid rgba(110,231,183,0.4)",
                      borderRadius: 4,
                      color: "#6ee7b7",
                      fontWeight: 700,
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "inherit",
                      padding: "0.1rem 0.4rem",
                      outline: "none",
                      width: "14rem",
                    }}
                  />
                ) : (
                  <span
                    title="Click to edit"
                    onClick={() => setEditingName(true)}
                    style={{
                      color: "#6ee7b7",
                      fontWeight: 700,
                      cursor: "text",
                      borderBottom: "1px dashed rgba(110,231,183,0.35)",
                      paddingBottom: "1px",
                    }}
                  >
                    {heroName}
                  </span>
                )}
                <span
                  title="Edit name"
                  onClick={() => setEditingName(true)}
                  style={{ cursor: "pointer", opacity: 0.4, fontSize: "0.75em", userSelect: "none" }}
                >✎</span>
              </p>
            </div>

            {/* 2. Tagline */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.15s",
                transform: `translate(${tagPos.x}px, ${tagPos.y}px)`,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                userSelect: "none",
              }}
            >
              {/* drag handle */}
              <span
                onMouseDown={onDragTag}
                title="Drag to reposition"
                style={{
                  cursor: "grab",
                  opacity: 0.3,
                  fontSize: "1rem",
                  lineHeight: 1,
                  touchAction: "none",
                }}
              >⠿</span>
              {editingTag ? (
                <input
                  autoFocus
                  defaultValue={tagline}
                  onBlur={(e) => saveTagline(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTagline(e.currentTarget.value)
                    if (e.key === "Escape") setEditingTag(false)
                  }}
                  style={{
                    background: "rgba(129,140,248,0.08)",
                    border: "1px solid rgba(129,140,248,0.4)",
                    borderRadius: 4,
                    color: "var(--text)",
                    fontWeight: 600,
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                    letterSpacing: "-0.01em",
                    padding: "0.1rem 0.4rem",
                    outline: "none",
                    width: "22rem",
                  }}
                />
              ) : (
                <p
                  title="Click to edit"
                  onClick={() => setEditingTag(true)}
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                    fontWeight: 600,
                    color: "var(--text)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    cursor: "text",
                    borderBottom: "1px dashed rgba(129,140,248,0.35)",
                    paddingBottom: "1px",
                  }}
                >
                  {tagline}
                </p>
              )}
              <span
                title="Edit tagline"
                onClick={() => setEditingTag(true)}
                style={{ cursor: "pointer", opacity: 0.4, fontSize: "0.85rem", userSelect: "none" }}
              >✎</span>
            </div>


            {/* 3. Bio */}
            <p
              className="fade-up"
              style={{
                animationDelay: "0.2s",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.85rem",
                color: "var(--muted)",
                lineHeight: 1.85,
                maxWidth: 560,
                margin: 0,
              }}
            >
              {personalInfo.name} —{" "}
              {personalInfo.bio}
            </p>

            {/* 4. CTAs */}
            <div className="fade-up" style={{ animationDelay: "0.3s", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <button
                onClick={() => scrollTo("#projects")}
                style={{
                  background: "#6ee7b7", color: "#060608", border: "none", borderRadius: 6,
                  padding: "0.65rem 1.5rem", fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em",
                  cursor: "pointer", transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                View Projects
              </button>

              <button
                onClick={() => scrollTo("#add-project")}
                style={{
                  background: "#818cf8", color: "#fff", border: "none", borderRadius: 6,
                  padding: "0.65rem 1.5rem", fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em",
                  cursor: "pointer", transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Add Project
              </button>

              <button
                onClick={() => scrollTo("#skills")}
                style={{
                  background: "none", color: "var(--text)", border: "1px solid var(--border2)",
                  borderRadius: 6, padding: "0.65rem 1.5rem", fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.04em",
                  cursor: "pointer", transition: "border-color 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--muted)"; el.style.color = "var(--text)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--border2)"; el.style.color = "var(--text)"
                }}
              >
                My Skills
              </button>
            </div>

          </div>

          {/* ── RIGHT: glowing avatar ── */}
          <div className="hero-avatar-col fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="avatar-size-override" style={{ width: 260, height: 260 }}>
              <GlowingAvatar
                avatarUrl={personalInfo.avatarUrl}
                name={personalInfo.name}
                size={260}
              />
            </div>
          </div>

        </div>

        {/* ── Stats bar — always visible below the grid ── */}
        <div className="hero-stats-bar fade-up" style={{ animationDelay: "0.45s" }}>
          {statItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                textAlign: "center",
                padding: "1.1rem 0.5rem",
                borderRight: i < statItems.length - 1 ? "1px solid var(--border)" : "none",
                background: "var(--s1)",
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: STAT_COLORS[i], lineHeight: 1, marginBottom: "0.4rem" }}>
                {item.value}
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

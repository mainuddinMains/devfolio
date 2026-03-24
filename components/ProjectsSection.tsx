"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Project } from "@/lib/types"

/* ── Config maps ──────────────────────────────────────────────────── */

type FilterKey = "all" | "dev" | "ai" | "design"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",    label: "All" },
  { key: "dev",    label: "Software Dev" },
  { key: "ai",     label: "AI / ML" },
  { key: "design", label: "Design" },
]

const CATEGORY_CONFIG: Record<
  Project["category"],
  { badge: string; color: string; bg: string; border: string; activeBg: string }
> = {
  dev: {
    badge:    "Software Dev",
    color:    "#6ee7b7",
    bg:       "rgba(110,231,183,0.15)",
    border:   "rgba(110,231,183,0.2)",
    activeBg: "rgba(110,231,183,0.08)",
  },
  ai: {
    badge:    "AI / ML / Data",
    color:    "#818cf8",
    bg:       "rgba(129,140,248,0.15)",
    border:   "rgba(129,140,248,0.2)",
    activeBg: "rgba(129,140,248,0.08)",
  },
  design: {
    badge:    "Creative Design",
    color:    "#f472b6",
    bg:       "rgba(244,114,182,0.15)",
    border:   "rgba(244,114,182,0.2)",
    activeBg: "rgba(244,114,182,0.08)",
  },
}

/* ── Sub-components ───────────────────────────────────────────────── */

function FilterPill({
  label,
  filterKey,
  active,
  onClick,
}: {
  label: string
  filterKey: FilterKey
  active: boolean
  onClick: () => void
}) {
  let activeStyle: React.CSSProperties = {}
  if (active) {
    if (filterKey === "all") {
      activeStyle = { color: "var(--text)", borderColor: "var(--text)" }
    } else {
      const cfg = CATEGORY_CONFIG[filterKey as Project["category"]]
      activeStyle = {
        color: cfg.color,
        borderColor: cfg.color,
        background: cfg.activeBg,
      }
    }
  }

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "0.68rem",
        padding: "0.3rem 0.7rem",
        borderRadius: 20,
        border: "1px solid var(--border2)",
        background: "transparent",
        color: "var(--muted)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        ...activeStyle,
      }}
    >
      {label}
    </button>
  )
}

function ProjectCard({
  project,
  onClick,
}: {
  project: Project
  onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cfg = CATEGORY_CONFIG[project.category]

  const visibleTags = project.techStack.slice(0, 5)
  const extraCount  = project.techStack.length - 5

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--s1)",
        border: `1px solid ${hovered ? "var(--border2)" : "var(--border)"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4)" : "none",
        transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
      }}
    >
      {/* ── Thumbnail ── */}
      <div
        style={{
          position: "relative",
          height: 148,
          background: "var(--s2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {project.thumbnailUrl && !imgError ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: "2.6rem", lineHeight: 1 }}>{project.emoji}</span>
        )}

        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            top: "0.6rem",
            left: "0.6rem",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.58rem",
            fontWeight: 500,
            padding: "0.2rem 0.5rem",
            borderRadius: 3,
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}
        >
          {cfg.badge}
        </span>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--text)",
            margin: "0 0 0.3rem",
          }}
        >
          {project.title}
        </p>

        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.68rem",
            color: "var(--muted)",
            lineHeight: 1.65,
            margin: "0 0 0.7rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {visibleTags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.6rem",
                padding: "0.15rem 0.45rem",
                background: "var(--s3)",
                color: "var(--faint)",
                border: "1px solid var(--border)",
                borderRadius: 3,
              }}
            >
              {tag}
            </span>
          ))}
          {extraCount > 0 && (
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.6rem",
                padding: "0.15rem 0.45rem",
                background: "var(--s3)",
                color: "var(--faint)",
                border: "1px solid var(--border)",
                borderRadius: 3,
              }}
            >
              +{extraCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────── */

interface ProjectsSectionProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export default function ProjectsSection({
  projects,
  onProjectClick,
}: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={visible ? "animate-in" : undefined}
      style={{ opacity: visible ? undefined : 0 }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.8rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Left */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.65rem",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              margin: "0 0 0.45rem",
            }}
          >
            Portfolio
          </p>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "1.4rem",
              fontWeight: 700,
              margin: "0 0 0.6rem",
              color: "var(--text)",
            }}
          >
            Projects
          </h2>
          <div
            style={{
              width: 36,
              height: 2,
              borderRadius: 2,
              background: "#f472b6",
            }}
          />
        </div>

        {/* Right — Add Project button */}
        <button
          onClick={() =>
            document.querySelector("#add-project")?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            background: "#6ee7b7",
            color: "#060608",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "opacity 0.15s ease",
            alignSelf: "center",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.82")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          + Add Project
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          marginBottom: "1.5rem",
        }}
      >
        {FILTERS.map((f) => (
          <FilterPill
            key={f.key}
            label={f.label}
            filterKey={f.key}
            active={activeFilter === f.key}
            onClick={() => setActiveFilter(f.key)}
          />
        ))}
      </div>

      {/* ── Cards grid or empty state ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--faint)",
            borderRadius: 10,
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📭</div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.78rem",
              color: "var(--muted)",
              margin: 0,
            }}
          >
            No projects in this category yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

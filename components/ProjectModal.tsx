"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Project } from "@/lib/types"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
  onDelete?: (id: string) => void
}

const CATEGORY_CONFIG: Record<
  Project["category"],
  { badge: string; color: string; bg: string; border: string }
> = {
  dev: {
    badge:  "Software Dev",
    color:  "#6ee7b7",
    bg:     "rgba(110,231,183,0.15)",
    border: "rgba(110,231,183,0.2)",
  },
  ai: {
    badge:  "AI / ML / Data",
    color:  "#818cf8",
    bg:     "rgba(129,140,248,0.15)",
    border: "rgba(129,140,248,0.2)",
  },
  design: {
    badge:  "Creative Design",
    color:  "#f472b6",
    bg:     "rgba(244,114,182,0.15)",
    border: "rgba(244,114,182,0.2)",
  },
}

export default function ProjectModal({ project, onClose, onDelete }: ProjectModalProps) {
  const [imgError, setImgError] = useState(false)
  const [closeHovered, setCloseHovered] = useState(false)
  const [deleteHovered, setDeleteHovered] = useState(false)

  /* Reset image error state when project changes */
  useEffect(() => {
    setImgError(false)
  }, [project?.id])

  /* Escape key + scroll lock */
  useEffect(() => {
    if (!project) return

    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  const cfg = CATEGORY_CONFIG[project.category]
  const hasLive = Boolean(project.liveUrl)
  const hasRepo = Boolean(project.repoUrl)

  return (
    <>
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          animation: "overlayIn 0.2s ease-out both",
        }}
      >
        {/* ── Modal card ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--s1)",
            border: "1px solid var(--border2)",
            borderRadius: 16,
            width: "100%",
            maxWidth: 600,
            maxHeight: "88vh",
            overflowY: "auto",
            animation: "modalSlideUp 0.25s ease-out both",
          }}
        >
          {/* ── Thumbnail header ── */}
          <div
            style={{
              position: "relative",
              height: 200,
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
              background: "var(--s2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              <span style={{ fontSize: "4rem", lineHeight: 1 }}>{project.emoji}</span>
            )}

            {/* ✕ Close button */}
            <button
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "0.8rem",
                right: "0.8rem",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: closeHovered ? "var(--s3)" : "rgba(0,0,0,0.5)",
                border: "1px solid var(--border2)",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "0.75rem",
                transition: "background 0.2s ease",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "1.4rem 1.6rem 1.8rem" }}>

            {/* 1. Category badge */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.58rem",
                fontWeight: 500,
                padding: "0.2rem 0.5rem",
                borderRadius: 3,
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
                marginBottom: "0.6rem",
              }}
            >
              {cfg.badge}
            </span>

            {/* 2. Title */}
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                margin: "0 0 0.5rem",
              }}
            >
              {project.title}
            </h2>

            {/* 3. Full description */}
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.78rem",
                color: "var(--muted)",
                lineHeight: 1.8,
                margin: "0 0 1.1rem",
              }}
            >
              {project.description}
            </p>

            {/* 4. Tech stack */}
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.62rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 0.5rem",
              }}
            >
              Tech Stack
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.1rem" }}>
              {project.techStack.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.7rem",
                    padding: "0.25rem 0.6rem",
                    background: "var(--s3)",
                    color: "var(--faint)",
                    border: "1px solid var(--border)",
                    borderRadius: 3,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 5. Links */}
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.62rem",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "1.2rem 0 0.5rem",
              }}
            >
              Links
            </p>
            {hasLive || hasRepo ? (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {hasLive && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#6ee7b7",
                      color: "#060608",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.5rem 1rem",
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    🔗 Live Demo
                  </a>
                )}
                {hasRepo && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "none",
                      color: "var(--text)",
                      border: "1px solid var(--border2)",
                      borderRadius: 6,
                      padding: "0.5rem 1rem",
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    ⌥ View Code
                  </a>
                )}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.72rem",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                No links provided
              </p>
            )}

            {/* 6. Delete button */}
            {onDelete && (
              <div
                style={{
                  marginTop: "1.4rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => {
                    onDelete(project.id)
                    onClose()
                  }}
                  onMouseEnter={() => setDeleteHovered(true)}
                  onMouseLeave={() => setDeleteHovered(false)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.72rem",
                    color: deleteHovered ? "#f472b6" : "rgba(244,114,182,0.6)",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                >
                  Delete this project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

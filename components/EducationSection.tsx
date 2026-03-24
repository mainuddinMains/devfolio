"use client"

import { education } from "@/data/education"
import type { Education } from "@/lib/types"

const TYPE_CONFIG: Record<Education["type"], { color: string; accent: string }> = {
  degree:      { color: "#6ee7b7", accent: "#6ee7b7" },
  certificate: { color: "#818cf8", accent: "#818cf8" },
  course:      { color: "#f472b6", accent: "#f472b6" },
}

export default function EducationSection() {
  const sorted = [...education].sort(
    (a, b) => parseInt(b.endYear) - parseInt(a.endYear)
  )

  return (
    <>
      <style>{`
        .edu-card { transition: border-color 0.2s ease; }
        .edu-card:hover { border-color: var(--border2) !important; }
      `}</style>

      <section id="education">
        {/* ── Header ── */}
        <div style={{ marginBottom: "1.75rem" }}>
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
            Academic Background
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
            Education
          </h2>
          <div
            style={{
              width: 36,
              height: 2,
              borderRadius: 2,
              background: "#818cf8",
            }}
          />
        </div>

        {/* ── Cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {sorted.map((entry) => {
            const cfg = TYPE_CONFIG[entry.type]
            return (
              <div
                key={entry.id}
                className="edu-card"
                style={{
                  background: "var(--s1)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "1.2rem",
                  display: "flex",
                  gap: "1.2rem",
                  alignItems: "flex-start",
                }}
              >
                {/* Colored dot */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: cfg.color,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      margin: "0 0 0.2rem",
                    }}
                  >
                    {entry.degree}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.72rem",
                      color: cfg.accent,
                      margin: "0 0 0.15rem",
                    }}
                  >
                    {entry.institution}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {entry.field}
                  </p>
                </div>

                {/* Year range */}
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: "0.68rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                    margin: 0,
                    flexShrink: 0,
                  }}
                >
                  {entry.startYear === entry.endYear
                    ? entry.endYear
                    : `${entry.startYear} – ${entry.endYear}`}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

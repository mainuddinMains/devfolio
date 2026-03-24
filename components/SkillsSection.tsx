"use client"

import { skills } from "@/data/skills"

const COLUMNS = [
  {
    category: "dev" as const,
    label: "Software Dev",
    emoji: "💻",
    accent: "#6ee7b7",
    iconBg: "rgba(110,231,183,0.12)",
  },
  {
    category: "ai" as const,
    label: "AI / ML",
    emoji: "🧠",
    accent: "#818cf8",
    iconBg: "rgba(129,140,248,0.12)",
  },
  {
    category: "design" as const,
    label: "Design",
    emoji: "🎨",
    accent: "#f472b6",
    iconBg: "rgba(244,114,182,0.12)",
  },
]

export default function SkillsSection() {
  return (
    <>
      <style>{`
        .skill-chip { transition: border-color 0.2s ease, color 0.2s ease; }
        @media (max-width: 600px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="skills">
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
            Capabilities
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
            Skills &amp; Tools
          </h2>
          <div
            style={{
              width: 36,
              height: 2,
              borderRadius: 2,
              background: "linear-gradient(to right, #6ee7b7, #818cf8, #f472b6)",
            }}
          />
        </div>

        {/* ── Columns grid ── */}
        <div
          className="skills-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {COLUMNS.map((col) => {
            const colSkills = skills.filter((s) => s.category === col.category)
            return (
              <div
                key={col.category}
                style={{
                  background: "var(--s1)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "1.1rem",
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: col.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {col.emoji}
                  </div>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: col.accent,
                    }}
                  >
                    {col.label}
                  </span>
                </div>

                {/* Skill chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {colSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="skill-chip"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        fontSize: "0.65rem",
                        padding: "0.2rem 0.55rem",
                        background: "var(--s3)",
                        border: "1px solid var(--border2)",
                        borderRadius: 3,
                        color: "var(--muted)",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLSpanElement
                        el.style.borderColor = col.accent
                        el.style.color = col.accent
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLSpanElement
                        el.style.borderColor = "var(--border2)"
                        el.style.color = "var(--muted)"
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

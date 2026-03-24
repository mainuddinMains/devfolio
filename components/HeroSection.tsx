"use client"

import { personalInfo } from "@/data/personal"

interface Stats {
  projects: number
  disciplines: number
  years: number
  technologies: number
}

interface HeroSectionProps {
  stats: Stats
}

const PILLS = [
  {
    label: "Software Dev",
    bg: "rgba(110,231,183,0.1)",
    color: "#6ee7b7",
    border: "rgba(110,231,183,0.25)",
  },
  {
    label: "AI / ML / Data",
    bg: "rgba(129,140,248,0.1)",
    color: "#818cf8",
    border: "rgba(129,140,248,0.25)",
  },
  {
    label: "Creative Design",
    bg: "rgba(244,114,182,0.1)",
    color: "#f472b6",
    border: "rgba(244,114,182,0.25)",
  },
]

const STAT_COLORS = ["#6ee7b7", "#818cf8", "#f472b6", "#fbbf24"]

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const statItems = [
    { label: "Projects",      value: stats.projects },
    { label: "Disciplines",   value: stats.disciplines },
    { label: "Years Exp",     value: stats.years },
    { label: "Technologies",  value: stats.technologies },
  ]

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.7s ease-out forwards;
        }
      `}</style>

      <div
        id="about"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* ── 1. Discipline pills ── */}
        <div
          className="fade-up"
          style={{
            animationDelay: "0s",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {PILLS.map((pill) => (
            <span
              key={pill.label}
              style={{
                background: pill.bg,
                color: pill.color,
                border: `1px solid ${pill.border}`,
                borderRadius: 20,
                padding: "0.3rem 0.85rem",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {pill.label}
            </span>
          ))}
        </div>

        {/* ── 2. Headline ── */}
        <h1
          className="fade-up"
          style={{
            animationDelay: "0.1s",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: "var(--text)",
            maxWidth: 760,
            margin: 0,
          }}
        >
          Building at the intersection of{" "}
          <span style={{ color: "#6ee7b7" }}>code</span>
          {", "}
          <span style={{ color: "#818cf8" }}>intelligence</span>
          {" & "}
          <span style={{ color: "#f472b6" }}>design</span>
        </h1>

        {/* ── 3. Subtitle ── */}
        <p
          className="fade-up"
          style={{
            animationDelay: "0.2s",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.82rem",
            color: "var(--muted)",
            lineHeight: 1.85,
            maxWidth: 520,
            margin: 0,
          }}
        >
          {personalInfo.name !== "Your Name" ? `${personalInfo.name} — ` : ""}
          {personalInfo.bio}
        </p>

        {/* ── 4. CTA buttons ── */}
        <div
          className="fade-up"
          style={{
            animationDelay: "0.3s",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={() => scrollTo("#projects")}
            style={{
              background: "#6ee7b7",
              color: "#060608",
              border: "none",
              borderRadius: 6,
              padding: "0.6rem 1.3rem",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            View Projects
          </button>

          <button
            onClick={() => scrollTo("#add-project")}
            style={{
              background: "#818cf8",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.6rem 1.3rem",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            Add Project
          </button>

          <button
            onClick={() => scrollTo("#skills")}
            style={{
              background: "none",
              color: "var(--text)",
              border: "1px solid var(--border2)",
              borderRadius: 6,
              padding: "0.6rem 1.3rem",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = "var(--muted)"
              el.style.color = "#fff"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = "var(--border2)"
              el.style.color = "var(--text)"
            }}
          >
            My Skills
          </button>
        </div>

        {/* ── 5. Stats bar ── */}
        <div
          className="fade-up"
          style={{
            animationDelay: "0.45s",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            marginTop: "0.5rem",
          }}
        >
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
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: STAT_COLORS[i],
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--muted)",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

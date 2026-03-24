"use client"

import { useState, useEffect } from "react"
import { personalInfo } from "@/data/personal"
import ThemeToggle from "@/components/ThemeToggle"

const NAV_LINKS = [
  { label: "About",     href: "#about"     },
  { label: "Skills",    href: "#skills"    },
  { label: "Education", href: "#education" },
  { label: "Projects",  href: "#projects"  },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const initials = getInitials(personalInfo.name)

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled
          ? "0 4px 24px rgba(0,0,0,0.45)"
          : "none",
        transition: "box-shadow 0.25s ease",
      }}
    >
      <nav
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 2rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Back to top"
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "0.05em",
            }}
          >
            {initials}
          </span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--a3)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
        </button>

        {/* ── Desktop nav links ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.75rem",
            marginLeft: "auto",
          }}
          className="nav-links-desktop"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                padding: 0,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--a1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--muted)")
              }
            >
              {link.label}
            </button>
          ))}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* + Add button */}
          <button
            onClick={() => scrollTo("#add-project")}
            style={{
              background: "none",
              border: "1px solid var(--a1)",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--a1)",
              padding: "0.3rem 0.65rem",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = "var(--a1)"
              el.style.color = "var(--bg)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = "none"
              el.style.color = "var(--a1)"
            }}
          >
            + Add
          </button>
        </div>

        {/* ── Theme toggle (always visible on mobile, hidden on desktop where it's in nav-links) ── */}
        <div className="nav-theme-mobile">
          <ThemeToggle />
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            color: "var(--muted)",
            marginLeft: "auto",
          }}
        >
          {menuOpen ? (
            /* X icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="3" y1="6"  x2="17" y2="6"  />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>
      </nav>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--nav-bg-solid)",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => {
                setMenuOpen(false)
                scrollTo(link.href)
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                textAlign: "left",
                padding: 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false)
              scrollTo("#add-project")
            }}
            style={{
              background: "none",
              border: "1px solid var(--a1)",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--a1)",
              padding: "0.4rem 0.75rem",
              width: "fit-content",
            }}
          >
            + Add
          </button>
        </div>
      )}

      {/* ── Responsive rules injected as a style tag ── */}
      <style>{`
        /* Desktop: hide the standalone mobile toggle (it's inside nav-links-desktop) */
        .nav-theme-mobile { display: none; }

        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger     { display: flex !important; }
          .nav-theme-mobile  { display: flex; }
        }
      `}</style>
    </header>
  )
}

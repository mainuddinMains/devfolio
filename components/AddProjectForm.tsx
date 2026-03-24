"use client"

import { useState, useRef, useEffect } from "react"
import type { Project } from "@/lib/types"

interface AddProjectFormProps {
  onAddProject: (project: Project) => void
}

type Category = Project["category"]

const DEFAULT_EMOJI: Record<Category, string> = {
  dev:    "💻",
  ai:     "🧠",
  design: "🎨",
}

const EMPTY = {
  title:        "",
  description:  "",
  category:     "dev" as Category,
  tech:         "",
  liveUrl:      "",
  repoUrl:      "",
  thumbnailUrl: "",
  emoji:        "",
}

/* ── Shared input style ───────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background:    "var(--s2)",
  border:        "1px solid var(--border2)",
  borderRadius:  6,
  color:         "var(--text)",
  fontFamily:    "var(--font-jetbrains-mono)",
  fontSize:      "0.78rem",
  padding:       "0.55rem 0.8rem",
  width:         "100%",
  outline:       "none",
  boxSizing:     "border-box",
  transition:    "border-color 0.2s ease",
}

const labelStyle: React.CSSProperties = {
  fontFamily:    "var(--font-jetbrains-mono)",
  fontSize:      "0.65rem",
  color:         "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
}

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize:   "0.62rem",
  color:      "var(--muted)",
  marginTop:  "0.25rem",
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.85rem" }}>
      {children}
    </div>
  )
}

export default function AddProjectForm({ onAddProject }: AddProjectFormProps) {
  const [fields, setFields] = useState(EMPTY)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  function set(key: keyof typeof EMPTY, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    /* Clear error when user edits any field */
    if (message?.type === "error") setMessage(null)
  }

  function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "#818cf8"
  }
  function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "var(--border2)"
  }

  function handleClear() {
    setFields(EMPTY)
    setMessage(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const title       = fields.title.trim()
    const description = fields.description.trim()

    if (!title || !description) {
      setMessage({ text: "Title and description are required.", type: "error" })
      return
    }

    const techStack = fields.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const newProject: Project = {
      id:           crypto.randomUUID(),
      title,
      description,
      category:     fields.category,
      techStack,
      liveUrl:      fields.liveUrl.trim()      || undefined,
      repoUrl:      fields.repoUrl.trim()      || undefined,
      thumbnailUrl: fields.thumbnailUrl.trim() || undefined,
      emoji:        fields.emoji.trim()        || DEFAULT_EMOJI[fields.category],
      featured:     false,
      createdAt:    new Date().toISOString(),
    }

    onAddProject(newProject)
    setFields(EMPTY)

    if (successTimer.current) clearTimeout(successTimer.current)
    setMessage({ text: "Project added! 🎉 Scroll up to see it in the gallery.", type: "success" })
    successTimer.current = setTimeout(() => setMessage(null), 5000)

    setTimeout(() => {
      document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
    }, 400)
  }

  /* SVG arrow for custom select */
  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b6880'/%3E%3C/svg%3E")`

  return (
    <>
      <style>{`
        .apf-input::placeholder { color: var(--muted); opacity: 1; }
        .apf-textarea::placeholder { color: var(--muted); opacity: 1; }
      `}</style>

      <section
        id="add-project"
        ref={sectionRef}
        className={visible ? "animate-in" : undefined}
        style={{ paddingBottom: "6rem", opacity: visible ? undefined : 0 }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: "1.2rem" }}>
          <p style={{ ...labelStyle, letterSpacing: "0.14em", margin: "0 0 0.45rem" }}>
            Share Your Work
          </p>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize:   "1.4rem",
              fontWeight: 700,
              margin:     "0 0 0.6rem",
              color:      "var(--text)",
            }}
          >
            Add a Project
          </h2>
          <div style={{ width: 36, height: 2, borderRadius: 2, background: "#6ee7b7" }} />
        </div>

        {/* ── Form card ── */}
        <div
          style={{
            background:   "var(--s1)",
            border:       "1px solid var(--border)",
            borderRadius: 14,
            padding:      "1.8rem",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>

            {/* 1. Title — full width */}
            <Field>
              <label style={labelStyle}>Project Title *</label>
              <input
                className="apf-input"
                style={inputBase}
                type="text"
                value={fields.title}
                onChange={(e) => set("title", e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="e.g. Neural Style Transfer App"
              />
            </Field>

            {/* 2. Description — full width */}
            <Field>
              <label style={labelStyle}>Description *</label>
              <textarea
                className="apf-textarea"
                style={{ ...inputBase, minHeight: 80, resize: "vertical" }}
                value={fields.description}
                onChange={(e) => set("description", e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="What did you build? What problem does it solve?"
              />
            </Field>

            {/* 2-column grid for the remaining fields */}
            <div
              className="form-2col"
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1fr",
                gap:                 "0.9rem",
              }}
            >
              {/* 3. Discipline — LEFT */}
              <Field>
                <label style={labelStyle}>Discipline *</label>
                <select
                  style={{
                    ...inputBase,
                    appearance:            "none",
                    WebkitAppearance:      "none",
                    backgroundImage:       selectArrow,
                    backgroundRepeat:      "no-repeat",
                    backgroundPosition:    "right 0.7rem center",
                    paddingRight:          "2rem",
                    cursor:                "pointer",
                  }}
                  value={fields.category}
                  onChange={(e) => set("category", e.target.value as Category)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  <option value="dev">Software Dev</option>
                  <option value="ai">AI / ML / Data</option>
                  <option value="design">Creative Design</option>
                </select>
              </Field>

              {/* 4. Tech Stack — RIGHT */}
              <Field>
                <label style={labelStyle}>Tech Stack</label>
                <input
                  className="apf-input"
                  style={inputBase}
                  type="text"
                  value={fields.tech}
                  onChange={(e) => set("tech", e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="React, Node.js, PostgreSQL (comma separated)"
                />
                <span style={hintStyle}>Separate each technology with a comma</span>
              </Field>

              {/* 5. Live URL — LEFT */}
              <Field>
                <label style={labelStyle}>Live URL</label>
                <input
                  className="apf-input"
                  style={inputBase}
                  type="url"
                  value={fields.liveUrl}
                  onChange={(e) => set("liveUrl", e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="https://myproject.com"
                />
              </Field>

              {/* 6. Repo URL — RIGHT */}
              <Field>
                <label style={labelStyle}>Repo / Case Study URL</label>
                <input
                  className="apf-input"
                  style={inputBase}
                  type="url"
                  value={fields.repoUrl}
                  onChange={(e) => set("repoUrl", e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>

            {/* 7. Thumbnail URL — full width */}
            <Field>
              <label style={labelStyle}>Thumbnail Image URL</label>
              <input
                className="apf-input"
                style={inputBase}
                type="url"
                value={fields.thumbnailUrl}
                onChange={(e) => set("thumbnailUrl", e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="https://... (leave blank to use emoji)"
              />
            </Field>

            {/* 8. Emoji — left column max-width */}
            <div className="form-emoji-col" style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "0.9rem" }}>
              <Field>
                <label style={labelStyle}>Emoji Icon</label>
                <input
                  className="apf-input"
                  style={{ ...inputBase, textAlign: "center", fontSize: "1.1rem" }}
                  type="text"
                  value={fields.emoji}
                  onChange={(e) => set("emoji", e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="🤖"
                  maxLength={4}
                />
                <span style={hintStyle}>Used if no thumbnail</span>
              </Field>
              {/* empty right column — keeps grid balanced */}
              <div />
            </div>

            {/* ── Buttons ── */}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  background:   "#6ee7b7",
                  color:        "#060608",
                  border:       "none",
                  borderRadius: 6,
                  padding:      "0.6rem 1.4rem",
                  fontFamily:   "var(--font-jetbrains-mono)",
                  fontSize:     "0.78rem",
                  fontWeight:   600,
                  cursor:       "pointer",
                  transition:   "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Add Project
              </button>

              <button
                type="button"
                onClick={handleClear}
                style={{
                  background:   "none",
                  color:        "var(--muted)",
                  border:       "1px solid var(--border2)",
                  borderRadius: 6,
                  padding:      "0.6rem 1.4rem",
                  fontFamily:   "var(--font-jetbrains-mono)",
                  fontSize:     "0.78rem",
                  fontWeight:   500,
                  cursor:       "pointer",
                  transition:   "border-color 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--muted)"
                  el.style.color       = "var(--text)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "var(--border2)"
                  el.style.color       = "var(--muted)"
                }}
              >
                Clear
              </button>
            </div>

            {/* ── Message ── */}
            {message && (
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize:   "0.72rem",
                  color:      message.type === "success" ? "#6ee7b7" : "#f472b6",
                  marginTop:  "0.8rem",
                  marginBottom: 0,
                }}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

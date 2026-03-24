import { personalInfo } from "@/data/personal"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--s1)",
        padding: "2rem",
      }}
    >
      <div
        className="footer-inner"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {personalInfo.name}
        </span>

        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.68rem",
            color: "var(--muted)",
          }}
        >
          Built with Next.js &amp; TypeScript
        </span>

        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "0.68rem",
            color: "var(--muted)",
          }}
        >
          {year} · All rights reserved
        </span>
      </div>
    </footer>
  )
}

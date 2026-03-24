"use client"

import Image from "next/image"

interface GlowingAvatarProps {
  avatarUrl?: string
  name: string
  size?: number
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

export default function GlowingAvatar({ avatarUrl, name, size = 260 }: GlowingAvatarProps) {
  const initials = getInitials(name)

  return (
    <>
      <style>{`
        @keyframes glowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes avatarPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.4;  transform: scale(1.04); }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
        }}
      >
        {/* Layer 1 — Spinning conic gradient ring */}
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #6ee7b7, #818cf8, #f472b6, #fbbf24, #6ee7b7)",
            animation: "glowSpin 4s linear infinite",
          }}
        />

        {/* Layer 2 — Blurred glow (behind everything) */}
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #6ee7b7, #818cf8, #f472b6, #fbbf24, #6ee7b7)",
            filter: "blur(12px)",
            opacity: 0.5,
            animation: "glowSpin 4s linear infinite",
            zIndex: -1,
          }}
        />

        {/* Layer 3 — Dark gap between ring and photo */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            borderRadius: "50%",
            background: "var(--bg)",
          }}
        />

        {/* Layer 4 — Photo or initials */}
        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--s3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <span
              style={{
                fontSize: size * 0.28,
                fontWeight: 700,
                color: "var(--a2)",
                letterSpacing: "-0.02em",
                userSelect: "none",
              }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Layer 5 — Outer pulsing ring (inner) */}
        <div
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: "50%",
            border: "1px solid rgba(110,231,183,0.15)",
            animation: "avatarPulse 2.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Layer 6 — Outer pulsing ring (outer, offset) */}
        <div
          style={{
            position: "absolute",
            inset: -22,
            borderRadius: "50%",
            border: "1px solid rgba(129,140,248,0.1)",
            animation: "avatarPulse 2.5s ease-in-out infinite",
            animationDelay: "0.8s",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  )
}

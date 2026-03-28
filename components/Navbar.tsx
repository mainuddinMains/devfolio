'use client'

import { useState } from 'react'

interface NavbarProps {
  name: string
}

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'More', href: '#more' },
]

export default function Navbar({ name }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        background: 'rgba(19, 19, 19, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(67, 70, 86, 0.2)',
        boxShadow: '0 0 32px 0 rgba(184, 195, 255, 0.06)',
        padding: '1rem 2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: '#b8c3ff', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
          {name || 'PORTFOLIO'}
        </span>

        {/* Desktop links */}
        <div className="hidden sm:flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: '#8e90a2',
                fontSize: '0.8125rem',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
                fontWeight: 400,
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e5e2e1')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8e90a2')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="flex sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: 'none', border: 'none',
            color: '#8e90a2', fontSize: '1.25rem',
            cursor: 'pointer', padding: '0.25rem',
          }}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="flex sm:hidden"
          style={{
            flexDirection: 'column',
            gap: '1rem',
            paddingTop: '1rem',
            paddingLeft: '0.5rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#8e90a2', fontSize: '0.875rem',
                textDecoration: 'none', transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#e5e2e1')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8e90a2')}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

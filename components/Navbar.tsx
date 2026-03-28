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
        background: '#0f0f0f',
        borderBottom: '1px solid #2a2a2a',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: '#f0f0f0', fontSize: '1rem' }}>{name}</span>

        {/* Desktop links */}
        <div
          style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}
          className="hidden sm:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: '#888',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f0f0f0')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#888')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.25rem',
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
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#888',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f0f0f0')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#888')}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

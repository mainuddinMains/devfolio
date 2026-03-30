'use client'

import { useState } from 'react'
import { usePreview } from '@/lib/PreviewContext'

interface NavbarProps {
  name: string
  profileImage?: string
}

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'More', href: '#more' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ name, profileImage }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { preview, setPreview } = usePreview()

  return (
    <nav
      style={{
        background: 'rgba(248, 247, 243, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(100, 96, 88, 0.18)',
        boxShadow: '0 0 32px 0 rgba(46, 91, 255, 0.05)',
        padding: '1rem 2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {profileImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
                border: '1.5px solid rgba(46,91,255,0.25)',
              }}
            />
          )}
          <span style={{ fontWeight: 700, color: '#2e5bff', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
            {name || 'PORTFOLIO'}
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {!preview && links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: '#6b6c7e',
                fontSize: '0.8125rem',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.15s',
                fontWeight: 400,
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#1a1826')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6b6c7e')}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setPreview(!preview)}
            style={{
              background: preview ? '#1a1826' : 'transparent',
              border: `1px solid ${preview ? '#1a1826' : '#c0bbb3'}`,
              color: preview ? '#f8f7f3' : '#6b6c7e',
              borderRadius: '6px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.15s',
            }}
          >
            {preview ? '✕ Exit Preview' : '👁 Preview'}
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="flex sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: 'none', border: 'none',
            color: '#6b6c7e', fontSize: '1.25rem',
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
          {!preview && links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#6b6c7e', fontSize: '0.875rem',
                textDecoration: 'none', transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#1a1826')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6b6c7e')}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setPreview(!preview); setMenuOpen(false) }}
            style={{
              background: preview ? '#1a1826' : 'transparent',
              border: `1px solid ${preview ? '#1a1826' : '#c0bbb3'}`,
              color: preview ? '#f8f7f3' : '#6b6c7e',
              borderRadius: '6px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              alignSelf: 'flex-start',
            }}
          >
            {preview ? '✕ Exit Preview' : '👁 Preview'}
          </button>
        </div>
      )}
    </nav>
  )
}

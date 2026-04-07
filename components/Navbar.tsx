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
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const { preview, setPreview, isOwner, setIsOwner } = usePreview()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.ok) {
        setIsOwner(true)
        setPreview(false)
        setShowLogin(false)
        setPassword('')
      } else {
        setLoginError(data.error || 'Invalid password')
      }
    } catch {
      setLoginError('Login failed. Try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    setIsOwner(false)
    setPreview(true)
  }

  return (
    <>
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
            {links.map((link) => (
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

            {isOwner ? (
              <>
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
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e0ddd6',
                    color: '#9b9b9b',
                    borderRadius: '6px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.775rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                    transition: 'all 0.15s',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #c0bbb3',
                  color: '#6b6c7e',
                  borderRadius: '6px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.775rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  transition: 'all 0.15s',
                }}
              >
                Login
              </button>
            )}
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
            {links.map((link) => (
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

            {isOwner ? (
              <>
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
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e0ddd6',
                    color: '#9b9b9b',
                    borderRadius: '6px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.775rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setMenuOpen(false) }}
                style={{
                  background: 'transparent',
                  border: '1px solid #c0bbb3',
                  color: '#6b6c7e',
                  borderRadius: '6px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.775rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(26, 24, 38, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowLogin(false); setPassword(''); setLoginError('') } }}
        >
          <div style={{
            background: '#f8f7f3',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 8px 40px rgba(26,24,38,0.18)',
            border: '1px solid rgba(100,96,88,0.15)',
          }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 700, color: '#1a1826' }}>Owner Login</h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: '#9b9b9b' }}>Enter your password to edit this portfolio.</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError('') }}
                placeholder="Password"
                autoFocus
                required
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '7px',
                  border: loginError ? '1.5px solid #e05252' : '1.5px solid #d1cec8',
                  fontSize: '0.9rem',
                  background: '#fff',
                  color: '#1a1826',
                  outline: 'none',
                }}
              />
              {loginError && (
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#e05252' }}>{loginError}</p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setPassword(''); setLoginError('') }}
                  style={{
                    background: 'transparent', border: '1px solid #c0bbb3',
                    color: '#6b6c7e', borderRadius: '6px',
                    padding: '0.45rem 1rem', fontSize: '0.8rem',
                    cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingIn}
                  style={{
                    background: '#2e5bff', border: 'none',
                    color: '#fff', borderRadius: '6px',
                    padding: '0.45rem 1.2rem', fontSize: '0.8rem',
                    cursor: loggingIn ? 'not-allowed' : 'pointer',
                    fontWeight: 600, opacity: loggingIn ? 0.7 : 1,
                  }}
                >
                  {loggingIn ? 'Logging in…' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

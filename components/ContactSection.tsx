'use client'

import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f5f3ef',
  border: '1px solid rgba(100,96,88,0.2)',
  borderRadius: '8px',
  color: '#1a1826',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', delivery: 'email', message: '' })
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'message', string>>>({})
  const [submitted, setSubmitted] = useState(false)

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key !== 'delivery' && errors[key as keyof typeof errors]) {
      setErrors((e) => ({ ...e, [key]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.message.trim()) errs.message = 'Message is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="contact-outer-grid">
        {/* ── Left: intro + social channels ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Intro */}
          <div>
            <p
              style={{
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 500,
                color: '#2e5bff',
                marginBottom: '1rem',
              }}
            >
              GET IN TOUCH
            </p>
            <h2
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: '#1a1826',
                marginBottom: '1.25rem',
              }}
            >
              Let&apos;s build something{' '}
              <span style={{ color: '#2e5bff' }}>extraordinary</span> together.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#4f505e', lineHeight: 1.7, opacity: 0.85 }}>
              Whether you have a specific project in mind or just want to explore possibilities, I&apos;m always open to discussing new challenges.
            </p>
          </div>

          {/* Professional Channels */}
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#6b6c7e',
                marginBottom: '1.25rem',
              }}
            >
              Professional Channels
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ChannelLink
                label="EMAIL"
                value="hello@example.com"
                href="mailto:hello@example.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                }
              />
              <ChannelLink
                label="GITHUB"
                value="github.com/username"
                href="https://github.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                }
              />
              <ChannelLink
                label="LINKEDIN"
                value="linkedin.com/in/username"
                href="https://linkedin.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Right: form card ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(100,96,88,0.12)',
            borderRadius: '12px',
            padding: '2.5rem',
          }}
        >
          {submitted ? (
            <SuccessState onReset={() => { setSubmitted(false); setForm({ name: '', email: '', delivery: 'email', message: '' }) }} />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Name + Email row */}
              <div className="contact-form-row">
                <FormField label="Name" error={errors.name}>
                  <input
                    style={{ ...inputStyle, borderColor: errors.name ? '#f38ba8' : 'rgba(100,96,88,0.2)' }}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="John Doe"
                    onFocus={(e) => { e.target.style.borderColor = '#2e5bff'; e.target.style.boxShadow = '0 0 0 1px #2e5bff' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.name ? '#f38ba8' : 'rgba(100,96,88,0.2)'; e.target.style.boxShadow = 'none' }}
                  />
                </FormField>
                <FormField label="Email" error={errors.email}>
                  <input
                    type="email"
                    style={{ ...inputStyle, borderColor: errors.email ? '#f38ba8' : 'rgba(100,96,88,0.2)' }}
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="john@example.com"
                    onFocus={(e) => { e.target.style.borderColor = '#2e5bff'; e.target.style.boxShadow = '0 0 0 1px #2e5bff' }}
                    onBlur={(e) => { e.target.style.borderColor = errors.email ? '#f38ba8' : 'rgba(100,96,88,0.2)'; e.target.style.boxShadow = 'none' }}
                  />
                </FormField>
              </div>

              {/* Delivery preference */}
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#6b6c7e',
                    marginBottom: '0.75rem',
                    marginLeft: '0.25rem',
                  }}
                >
                  Delivery Preference
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {(['email', 'phone'] as const).map((opt) => (
                    <label
                      key={opt}
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt}
                        checked={form.delivery === opt}
                        onChange={() => set('delivery', opt)}
                        style={{ display: 'none' }}
                      />
                      <div
                        style={{
                          background: form.delivery === opt ? 'rgba(46,91,255,0.15)' : '#f5f3ef',
                          border: `1px solid ${form.delivery === opt ? '#2e5bff' : 'rgba(100,96,88,0.2)'}`,
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: form.delivery === opt ? '#2e5bff' : '#6b6c7e',
                          transition: 'all 0.15s',
                          userSelect: 'none',
                        }}
                      >
                        {opt === 'email' ? 'Send to Email' : 'Send to Phone'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <FormField label="Message" error={errors.message}>
                <textarea
                  style={{
                    ...inputStyle,
                    borderColor: errors.message ? '#f38ba8' : 'rgba(100,96,88,0.2)',
                    resize: 'vertical',
                    minHeight: '120px',
                  }}
                  rows={5}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="Tell me about your project..."
                  onFocus={(e) => { e.target.style.borderColor = '#2e5bff'; e.target.style.boxShadow = '0 0 0 1px #2e5bff' }}
                  onBlur={(e) => { e.target.style.borderColor = errors.message ? '#f38ba8' : 'rgba(100,96,88,0.2)'; e.target.style.boxShadow = 'none' }}
                />
              </FormField>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#2e5bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  boxShadow: '0 0 20px 0 rgba(46,91,255,0.2)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              >
                TRANSMIT MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        #contact { padding: 2.5rem 1rem !important; }
        .contact-outer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          #contact { padding: 4rem 2rem !important; }
          .contact-form-row { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .contact-outer-grid { grid-template-columns: 5fr 7fr; gap: 3rem; }
        }
      `}</style>
    </section>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#6b6c7e',
          marginBottom: '0.5rem',
          marginLeft: '0.25rem',
        }}
      >
        {label}
      </p>
      {children}
      {error && <span style={{ color: '#f38ba8', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  )
}

function ChannelLink({ label, value, href, icon }: { label: string; value: string; href: string; icon: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: hovered ? 'rgba(46,91,255,0.1)' : '#f5f3ef',
          border: `1px solid ${hovered ? 'rgba(46,91,255,0.3)' : 'rgba(100,96,88,0.12)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2e5bff',
          flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#6b6c7e', letterSpacing: '0.06em', marginBottom: '0.1rem' }}>
          {label}
        </p>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: hovered ? '#1a1826' : '#4f505e', transition: 'color 0.15s' }}>
          {value}
        </p>
      </div>
    </a>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          background: 'rgba(46,91,255,0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e5bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1826' }}>Message sent!</p>
      <p style={{ fontSize: '0.875rem', color: '#6b6c7e', maxWidth: '260px' }}>
        Thanks for reaching out. I&apos;ll get back to you soon.
      </p>
      <button
        onClick={onReset}
        style={{
          background: 'none',
          border: '1px solid rgba(100,96,88,0.2)',
          color: '#6b6c7e',
          borderRadius: '8px',
          padding: '0.5rem 1.2rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        Send another
      </button>
    </div>
  )
}

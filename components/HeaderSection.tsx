'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { HeaderData } from '@/lib/types'
import { usePreview } from '@/lib/PreviewContext'

const STORAGE_KEY = 'pf_header'

const fallback: HeaderData = {
  name: 'Your Name',
  title: 'Software Developer',
  bio: 'I build clean, efficient software. Click ✏️ to update this.',
  github: '',
  linkedin: '',
  instagram: '',
  email: '',
}

interface HeaderSectionProps {
  onNameChange: (name: string) => void
  onProfileImageChange?: (image: string) => void
}

type EditableField = Exclude<keyof HeaderData, 'profileImage'>

interface FieldState {
  field: EditableField
  draft: string
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const icons = {
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
}

const brandHover: Record<string, string> = {
  github: '#1a1826',
  linkedin: '#0a66c2',
  instagram: '#e1306c',
  email: '#b8c3ff',
}

function SocialIconButton({ href, platform }: { href: string; platform: keyof typeof icons }) {
  const [hovered, setHovered] = useState(false)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px', borderRadius: '50%',
        border: `1px solid ${hovered ? '#c0bbb3' : '#e2ddd6'}`,
        background: hovered ? '#f0eeea' : 'transparent',
        color: hovered ? brandHover[platform] : '#6b6c7e',
        textDecoration: 'none',
        transition: 'color 0.15s, border-color 0.15s, background 0.15s',
        flexShrink: 0,
      }}
    >
      {icons[platform]}
    </a>
  )
}

function PencilBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Edit"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '0.7rem', marginLeft: '0.35rem', opacity: 0,
        transition: 'opacity 0.15s', verticalAlign: 'middle',
        padding: '0 0.2rem', color: '#6b6c7e',
      }}
      className="pencil-btn"
    >
      ✏️
    </button>
  )
}

function EditableRow({ onEdit, children }: { onEdit: () => void; children: React.ReactNode }) {
  return (
    <div
      className="editable-row"
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
        if (btn) btn.style.opacity = '1'
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
        if (btn) btn.style.opacity = '0'
      }}
    >
      {children}
      <PencilBtn onClick={onEdit} />
    </div>
  )
}

// ── Live Terminal ─────────────────────────────────────────────────────────────

function LiveTerminal({ name, title }: { name: string; title: string }) {
  type TermLine = { text: string; isCmd: boolean }
  const [lines, setLines] = useState<TermLine[]>([])
  const [typing, setTyping] = useState('')
  const cancelledRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameRef = useRef(name)
  const titleRef = useRef(title)
  nameRef.current = name
  titleRef.current = title

  useEffect(() => {
    cancelledRef.current = false
    let seqIdx = 0
    let accumulated: TermLine[] = []

    function getSequence() {
      return [
        { cmd: 'whoami', output: nameRef.current },
        { cmd: 'cat role.txt', output: titleRef.current },
        { cmd: 'cat specialization.txt', output: 'AI Integration' },
        { cmd: 'ls ./projects/', output: 'portfolio/  blog/  api/' },
        { cmd: 'git log --oneline -1', output: 'b0676f9 latest commit' },
        { cmd: 'uptime', output: 'always building new things' },
      ]
    }

    function typeCmd(cmd: string, output: string, done: () => void) {
      let charIdx = 0
      function tick() {
        if (cancelledRef.current) return
        if (charIdx <= cmd.length) {
          setTyping(cmd.slice(0, charIdx))
          charIdx++
          timerRef.current = setTimeout(tick, 55)
        } else {
          const newLines = [
            ...accumulated,
            { text: '$ ' + cmd, isCmd: true },
            { text: output, isCmd: false },
          ]
          accumulated = newLines.slice(-16)
          setLines([...accumulated])
          setTyping('')
          timerRef.current = setTimeout(done, 900)
        }
      }
      timerRef.current = setTimeout(tick, 350)
    }

    function nextCmd() {
      if (cancelledRef.current) return
      const seq = getSequence()
      const { cmd, output } = seq[seqIdx % seq.length]
      seqIdx++
      typeCmd(cmd, output, nextCmd)
    }

    nextCmd()

    return () => {
      cancelledRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="live-terminal" style={{
      background: '#0d1117',
      borderRadius: '12px',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.92rem',
      color: '#c9d1d9',
      width: '100%',
      maxWidth: '400px',
      overflow: 'hidden',
      border: '1px solid #30363d',
      flexShrink: 0,
      alignSelf: 'flex-start',
    }}>
      {/* Title bar */}
      <div style={{
        background: '#161b22',
        padding: '0.5rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderBottom: '1px solid #30363d',
      }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{ marginLeft: '0.5rem', color: '#8b949e', fontSize: '0.7rem' }}>terminal</span>
      </div>
      {/* Body */}
      <div style={{ padding: '0.85rem 1rem', minHeight: '200px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.isCmd ? '#79c0ff' : '#c9d1d9', lineHeight: 1.75 }}>
            {line.text}
          </div>
        ))}
        <div style={{ color: '#79c0ff', lineHeight: 1.75 }}>
          {'$ '}{typing}<span className="terminal-cursor">▋</span>
        </div>
      </div>
    </div>
  )
}

export default function HeaderSection({ onNameChange, onProfileImageChange }: HeaderSectionProps) {
  const { preview } = usePreview()
  const [data, setData] = useState<HeaderData>(fallback)
  const [editing, setEditing] = useState<FieldState | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const onNameChangeRef = useRef(onNameChange)
  onNameChangeRef.current = onNameChange
  const onProfileImageChangeRef = useRef(onProfileImageChange)
  onProfileImageChangeRef.current = onProfileImageChange

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as HeaderData
        setData(parsed)
        onNameChangeRef.current(parsed.name)
        if (parsed.profileImage) onProfileImageChangeRef.current?.(parsed.profileImage)
      } else {
        onNameChangeRef.current(fallback.name)
      }
    } catch {
      onNameChangeRef.current(fallback.name)
    }
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      const updated = { ...data, profileImage: base64 }
      setData(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      onProfileImageChangeRef.current?.(base64)
    }
    reader.readAsDataURL(file)
  }, [data])

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function startEdit(field: EditableField) {
    setEditing({ field, draft: data[field] })
  }

  function handleSave() {
    if (!editing) return
    const updated = { ...data, [editing.field]: editing.draft }
    setData(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (editing.field === 'name') onNameChangeRef.current(editing.draft)
    setEditing(null)
  }

  function handleCancel() { setEditing(null) }

  function isEditing(field: EditableField) { return editing?.field === field }

  const inlineEditor = (field: EditableField, multiline = false) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editing?.draft ?? ''}
          onChange={(e) => setEditing((prev) => prev && { ...prev, draft: e.target.value })}
          rows={3}
          style={{
            background: '#f0eeea', border: '1px solid #c0bbb3', color: '#1a1826',
            borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '1rem',
            width: '520px', maxWidth: '90vw', resize: 'vertical',
            fontFamily: 'inherit', lineHeight: 1.8, outline: 'none',
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') handleCancel() }}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editing?.draft ?? ''}
          onChange={(e) => setEditing((prev) => prev && { ...prev, draft: e.target.value })}
          style={{
            background: '#f0eeea', border: '1px solid #c0bbb3', color: '#1a1826',
            borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '1rem',
            width: '320px', maxWidth: '80vw', fontFamily: 'inherit', outline: 'none',
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
        />
      )}
      <button onClick={handleSave} title="Save" style={{ background: '#2e5bff', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.4rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>✓</button>
      <button onClick={handleCancel} title="Cancel" style={{ background: 'none', border: '1px solid #c0bbb3', color: '#6b6c7e', borderRadius: '6px', padding: '0.4rem 0.7rem', cursor: 'pointer', fontSize: '0.85rem' }}>✗</button>
    </div>
  )

  return (
    <section id="header" className="header-section" style={{ padding: '8rem 2rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Label */}
      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: '#2e5bff', display: 'block', marginBottom: '1.25rem' }}>
        DEVELOPER PORTFOLIO
      </span>

      {/* Two-column layout: left content + right terminal */}
      <div className="header-columns" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>

      {/* Avatar + Name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div
          title={preview ? undefined : 'Click to upload photo'}
          onClick={preview ? undefined : () => imageInputRef.current?.click()}
          className={preview ? undefined : 'avatar-upload'}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: data.profileImage ? 'transparent' : 'linear-gradient(135deg, #2e5bff 0%, #b8c3ff 100%)',
            color: '#fff', fontWeight: 800, fontSize: '1.3rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: preview ? 'default' : 'pointer', overflow: 'hidden', position: 'relative',
          }}
        >
          {data.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            getInitials(data.name)
          )}
          {!preview && (
            <div className="avatar-overlay" style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.15s', fontSize: '1.25rem',
            }}>
              📷
            </div>
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        <div>
          {!preview && isEditing('name') ? inlineEditor('name') : preview ? (
            <h1 className="header-name" style={{ fontSize: '3rem', fontWeight: 800, color: '#1a1826', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {data.name}
            </h1>
          ) : (
            <EditableRow onEdit={() => startEdit('name')}>
              <h1 className="header-name" style={{ fontSize: '3rem', fontWeight: 800, color: '#1a1826', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {data.name}
              </h1>
            </EditableRow>
          )}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '1rem' }}>
        {!preview && isEditing('title') ? inlineEditor('title') : preview ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#2e5bff' }}>{data.title}</span>
        ) : (
          <EditableRow onEdit={() => startEdit('title')}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#2e5bff' }}>
              {data.title}
            </span>
          </EditableRow>
        )}
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '2rem', maxWidth: '580px' }}>
        {!preview && isEditing('bio') ? inlineEditor('bio', true) : preview ? (
          <span style={{ fontSize: '1rem', color: '#4f505e', lineHeight: 1.8 }}>{data.bio}</span>
        ) : (
          <EditableRow onEdit={() => startEdit('bio')}>
            <span style={{ fontSize: '1rem', color: '#4f505e', lineHeight: 1.8 }}>
              {data.bio}
            </span>
          </EditableRow>
        )}
      </div>

      {/* Social links */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['github', 'linkedin', 'instagram', 'email'] as const).map((platform) => {
          const href = platform === 'email' ? (data.email ? `mailto:${data.email}` : '') : data[platform as keyof HeaderData]
          if (preview) {
            return href ? <SocialIconButton key={platform} href={href} platform={platform} /> : null
          }
          return (
            <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              className="editable-row"
              onMouseEnter={(e) => { const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn'); if (btn) btn.style.opacity = '1' }}
              onMouseLeave={(e) => { const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn'); if (btn) btn.style.opacity = '0' }}
            >
              {isEditing(platform as EditableField) ? (
                inlineEditor(platform as EditableField)
              ) : href ? (
                <SocialIconButton href={href} platform={platform} />
              ) : (
                <span style={{ color: '#c0bbb3', fontSize: '0.75rem', cursor: 'default' }}>
                  + {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
              )}
              {!isEditing(platform as EditableField) && (
                <PencilBtn onClick={() => startEdit(platform as EditableField)} />
              )}
            </div>
          )
        })}
      </div>

      </div>{/* end left column */}

      {/* Right: Live Terminal */}
      <LiveTerminal name={data.name} title={data.title} />

      </div>{/* end header-columns */}

      <style>{`
        .header-section { padding: 6rem 1rem 3rem !important; }
        .header-name { font-size: 2rem !important; }
        @media (min-width: 640px) {
          .header-section { padding: 8rem 2rem 5rem !important; }
          .header-name { font-size: 3rem !important; }
        }
        .header-columns { flex-direction: column !important; }
        @media (min-width: 900px) {
          .header-columns { flex-direction: row !important; }
          .live-terminal { max-width: 380px !important; }
        }
        .avatar-upload:hover .avatar-overlay { opacity: 1 !important; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .terminal-cursor { animation: blink 1s step-end infinite; }
      `}</style>
    </section>
  )
}

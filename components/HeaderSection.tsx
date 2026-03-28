'use client'

import { useEffect, useState, useRef } from 'react'
import { HeaderData } from '@/lib/types'

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
}

type EditableField = keyof HeaderData

interface FieldState {
  field: EditableField
  draft: string
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const icons = {
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
}

const brandColor: Record<string, string> = {
  github: '#f0f0f0',
  linkedin: '#0a66c2',
  instagram: '#e1306c',
  email: '#f0f0f0',
}

function SocialIconButton({
  href,
  platform,
}: {
  href: string
  platform: keyof typeof icons
}) {
  const [hovered, setHovered] = useState(false)
  if (!href) return null
  const color = hovered ? brandColor[platform] : '#888'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: `1px solid ${hovered ? '#3a3a3a' : '#2a2a2a'}`,
        background: hovered ? '#222' : 'transparent',
        color,
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
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.75rem',
        marginLeft: '0.4rem',
        opacity: 0,
        transition: 'opacity 0.15s',
        verticalAlign: 'middle',
        padding: '0 0.2rem',
        color: '#888',
      }}
      className="pencil-btn"
    >
      ✏️
    </button>
  )
}

function EditableRow({
  onEdit,
  children,
}: {
  onEdit: () => void
  children: React.ReactNode
}) {
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

export default function HeaderSection({ onNameChange }: HeaderSectionProps) {
  const [data, setData] = useState<HeaderData>(fallback)
  const [editing, setEditing] = useState<FieldState | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const onNameChangeRef = useRef(onNameChange)
  onNameChangeRef.current = onNameChange

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as HeaderData
        setData(parsed)
        onNameChangeRef.current(parsed.name)
      } else {
        onNameChangeRef.current(fallback.name)
      }
    } catch {
      onNameChangeRef.current(fallback.name)
    }
  }, [])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  function startEdit(field: EditableField) {
    setEditing({ field, draft: data[field] })
  }

  function handleSave() {
    if (!editing) return
    const updated = { ...data, [editing.field]: editing.draft }
    setData(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (editing.field === 'name') onNameChange(editing.draft)
    setEditing(null)
  }

  function handleCancel() {
    setEditing(null)
  }

  function isEditing(field: EditableField) {
    return editing?.field === field
  }

  const inlineEditor = (field: EditableField, multiline = false) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editing?.draft ?? ''}
          onChange={(e) => setEditing((prev) => prev && { ...prev, draft: e.target.value })}
          rows={3}
          style={{
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            color: '#f0f0f0',
            borderRadius: '6px',
            padding: '0.4rem 0.6rem',
            fontSize: '1rem',
            width: '520px',
            maxWidth: '90vw',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.8,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel()
          }}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editing?.draft ?? ''}
          onChange={(e) => setEditing((prev) => prev && { ...prev, draft: e.target.value })}
          style={{
            background: '#1a1a1a',
            border: '1px solid #3a3a3a',
            color: '#f0f0f0',
            borderRadius: '6px',
            padding: '0.4rem 0.6rem',
            fontSize: '1rem',
            width: '320px',
            maxWidth: '80vw',
            fontFamily: 'inherit',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
        />
      )}
      <button
        onClick={handleSave}
        title="Save"
        style={{
          background: '#22c55e',
          border: 'none',
          color: '#fff',
          borderRadius: '6px',
          padding: '0.35rem 0.6rem',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 700,
        }}
      >
        ✓
      </button>
      <button
        onClick={handleCancel}
        title="Cancel"
        style={{
          background: 'none',
          border: '1px solid #3a3a3a',
          color: '#888',
          borderRadius: '6px',
          padding: '0.35rem 0.6rem',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        ✗
      </button>
    </div>
  )

  return (
    <section
      id="header"
      className="header-section"
      style={{
        textAlign: 'center',
        padding: '5rem 2rem',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#22c55e',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        {getInitials(data.name)}
      </div>

      {/* Name */}
      <div style={{ marginTop: '1rem' }}>
        {isEditing('name') ? (
          inlineEditor('name')
        ) : (
          <EditableRow onEdit={() => startEdit('name')}>
            <span
              className="header-name"
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f0f0f0',
                lineHeight: 1.2,
              }}
            >
              {data.name}
            </span>
          </EditableRow>
        )}
      </div>

      {/* Title */}
      <div style={{ marginTop: '0.5rem' }}>
        {isEditing('title') ? (
          inlineEditor('title')
        ) : (
          <EditableRow onEdit={() => startEdit('title')}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                color: '#888',
              }}
            >
              {data.title}
            </span>
          </EditableRow>
        )}
      </div>

      {/* Bio */}
      <div style={{ marginTop: '1rem', maxWidth: '520px', margin: '1rem auto 0' }}>
        {isEditing('bio') ? (
          inlineEditor('bio', true)
        ) : (
          <EditableRow onEdit={() => startEdit('bio')}>
            <span
              style={{
                fontSize: '1rem',
                color: '#888',
                lineHeight: 1.8,
                display: 'inline',
              }}
            >
              {data.bio}
            </span>
          </EditableRow>
        )}
      </div>

      {/* Links row */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* GitHub */}
        {isEditing('github') ? (
          inlineEditor('github')
        ) : (
          <div
            className="editable-row"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '0'
            }}
          >
            {data.github ? (
              <SocialIconButton href={data.github} platform="github" />
            ) : (
              <span style={{ color: '#555', fontSize: '0.875rem' }}>+ Add GitHub</span>
            )}
            <PencilBtn onClick={() => startEdit('github')} />
          </div>
        )}

        {/* LinkedIn */}
        {isEditing('linkedin') ? (
          inlineEditor('linkedin')
        ) : (
          <div
            className="editable-row"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '0'
            }}
          >
            {data.linkedin ? (
              <SocialIconButton href={data.linkedin} platform="linkedin" />
            ) : (
              <span style={{ color: '#555', fontSize: '0.875rem' }}>+ Add LinkedIn</span>
            )}
            <PencilBtn onClick={() => startEdit('linkedin')} />
          </div>
        )}

        {/* Instagram */}
        {isEditing('instagram') ? (
          inlineEditor('instagram')
        ) : (
          <div
            className="editable-row"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '0'
            }}
          >
            {data.instagram ? (
              <SocialIconButton href={data.instagram} platform="instagram" />
            ) : (
              <span style={{ color: '#555', fontSize: '0.875rem' }}>+ Add Instagram</span>
            )}
            <PencilBtn onClick={() => startEdit('instagram')} />
          </div>
        )}

        {/* Email */}
        {isEditing('email') ? (
          inlineEditor('email')
        ) : (
          <div
            className="editable-row"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn')
              if (btn) btn.style.opacity = '0'
            }}
          >
            {data.email ? (
              <GhostButton href={`mailto:${data.email}`}>{data.email}</GhostButton>
            ) : (
              <span style={{ color: '#555', fontSize: '0.875rem' }}>+ Add Email</span>
            )}
            <PencilBtn onClick={() => startEdit('email')} />
          </div>
        )}
      </div>

      <style>{`
        .header-section { padding: 2.5rem 1rem !important; }
        .header-name { font-size: 1.8rem !important; }
        @media (min-width: 640px) {
          .header-section { padding: 5rem 2rem !important; }
          .header-name { font-size: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { HeaderData } from '@/lib/types'

const STORAGE_KEY = 'pf_header'

const fallback: HeaderData = {
  name: 'Your Name',
  title: 'Software Developer',
  bio: 'I build clean, efficient software. Click ✏️ to update this.',
  github: '',
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

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        border: `1px solid ${hovered ? '#3a3a3a' : '#2a2a2a'}`,
        color: '#888',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '0.875rem',
        transition: 'border-color 0.15s',
        display: 'inline-block',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
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
              <GhostButton href={data.github}>GitHub</GhostButton>
            ) : (
              <span style={{ color: '#555', fontSize: '0.875rem' }}>+ Add GitHub</span>
            )}
            <PencilBtn onClick={() => startEdit('github')} />
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

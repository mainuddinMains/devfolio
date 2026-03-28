'use client'

import { useEffect, useState } from 'react'
import { Extra } from '@/lib/types'

const STORAGE_KEY = 'pf_extras'

const samples: Extra[] = [
  {
    id: '1',
    type: 'Leadership',
    title: 'Team Lead — Hackathon Project',
    description: 'Led a team of 4 developers to build and ship a full-stack app in 48 hours.',
    date: '2024',
  },
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

const TYPES: Extra['type'][] = ['Leadership', 'Award', 'Certification', 'Volunteering', 'Other']

const badgeStyle: Record<Extra['type'], { background: string; color: string }> = {
  Leadership:    { background: 'rgba(34,197,94,0.1)',    color: '#22c55e' },
  Award:         { background: 'rgba(251,191,36,0.1)',   color: '#fbbf24' },
  Certification: { background: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  Volunteering:  { background: 'rgba(244,114,182,0.1)',  color: '#f472b6' },
  Other:         { background: 'rgba(255,255,255,0.05)', color: '#888'    },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#f0f0f0',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#888',
  marginBottom: '0.3rem',
}

// ── Icon button ───────────────────────────────────────────────────────────────

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: hovered ? '#f0f0f0' : '#888',
        padding: '0.1rem 0.2rem',
        transition: 'color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

// ── Form ──────────────────────────────────────────────────────────────────────

interface FormState {
  type: Extra['type']
  title: string
  description: string
  date: string
}

const emptyForm: FormState = { type: 'Leadership', title: '', description: '', date: '' }

function toForm(e: Extra): FormState {
  return { type: e.type, title: e.title, description: e.description, date: e.date }
}

interface ExtrasFormProps {
  initial: FormState
  onSave: (f: FormState) => void
  onCancel: () => void
}

function ExtrasForm({ initial, onSave, onCancel }: ExtrasFormProps) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleSave() {
    const errs: typeof errors = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #22c55e',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Type */}
      <div>
        <label style={labelStyle}>Type *</label>
        <select
          value={form.type}
          onChange={(e) => set('type', e.target.value as Extra['type'])}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.title ? '#ef4444' : '#2a2a2a' }}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Dean's List"
        />
        {errors.title && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.title}</span>}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description *</label>
        <textarea
          style={{ ...inputStyle, borderColor: errors.description ? '#ef4444' : '#2a2a2a', resize: 'vertical' }}
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Brief description..."
        />
        {errors.description && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>}
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}>Date (optional)</label>
        <input
          style={inputStyle}
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          placeholder="2024 or Jan 2024"
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.2rem',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            color: '#888',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '0.5rem 1.2rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Entry card ────────────────────────────────────────────────────────────────

interface ExtraCardProps {
  extra: Extra
  onEdit: () => void
  onDelete: () => void
}

function ExtraCard({ extra, onEdit, onDelete }: ExtraCardProps) {
  const badge = badgeStyle[extra.type]

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '1.5rem',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            background: badge.background,
            color: badge.color,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            borderRadius: '20px',
            padding: '0.2rem 0.7rem',
          }}
        >
          {extra.type}
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
          <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
        </div>
      </div>

      {/* Title */}
      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f0f0f0', marginTop: '0.6rem' }}>
        {extra.title}
      </p>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7, marginTop: '0.4rem' }}>
        {extra.description}
      </p>

      {/* Date */}
      {extra.date && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
          {extra.date}
        </p>
      )}
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function ExtrasSection() {
  const [entries, setEntries] = useState<Extra[]>([])
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setEntries(stored ? JSON.parse(stored) : samples)
    } catch {
      setEntries(samples)
    }
  }, [])

  function persist(updated: Extra[]) {
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function handleAdd(form: FormState) {
    const entry: Extra = {
      id: uid(),
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
    }
    persist([entry, ...entries])
    setAdding(false)
  }

  function handleEdit(id: string, form: FormState) {
    persist(
      entries.map((e) =>
        e.id === id
          ? { ...e, type: form.type, title: form.title.trim(), description: form.description.trim(), date: form.date.trim() }
          : e
      )
    )
    setEditingId(null)
  }

  function handleDelete(id: string) {
    persist(entries.filter((e) => e.id !== id))
    if (editingId === id) setEditingId(null)
  }

  return (
    <section id="more" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '1.5rem' }}>
        More About Me
      </h2>

      {/* Grid */}
      <div className="extras-grid">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <ExtrasForm
              key={entry.id}
              initial={toForm(entry)}
              onSave={(f) => handleEdit(entry.id, f)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ExtraCard
              key={entry.id}
              extra={entry}
              onEdit={() => { setAdding(false); setEditingId(entry.id) }}
              onDelete={() => handleDelete(entry.id)}
            />
          )
        )}
      </div>

      {/* Add form — below grid */}
      {adding && (
        <div style={{ marginTop: '1rem' }}>
          <ExtrasForm
            initial={emptyForm}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Add button */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={() => { setEditingId(null); setAdding(true) }}
          style={{
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          + Add Entry
        </button>
      </div>

      <style>{`
        #more { padding: 2.5rem 1rem !important; }
        .extras-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          #more { padding: 4rem 2rem !important; }
        }
        @media (min-width: 768px) {
          .extras-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Experience } from '@/lib/types'

const STORAGE_KEY = 'pf_experience'

const samples: Experience[] = [
  {
    id: '1',
    company: 'Tech Company',
    role: 'Software Developer',
    startDate: 'Jan 2023',
    endDate: 'Present',
    bullets: [
      'Built and maintained web applications using React and Node.js',
      'Collaborated with cross-functional teams to deliver features on time',
    ],
  },
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
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

interface FormState {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

const emptyForm: FormState = { company: '', role: '', startDate: '', endDate: '', description: '' }

function toForm(e: Experience): FormState {
  return {
    company: e.company,
    role: e.role,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.bullets.join('\n'),
  }
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
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

interface ExperienceFormProps {
  initial: FormState
  onSave: (f: FormState) => void
  onCancel: () => void
}

function ExperienceForm({ initial, onSave, onCancel }: ExperienceFormProps) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleSave() {
    const errs: typeof errors = {}
    if (!form.company.trim()) errs.company = 'Company is required.'
    if (!form.role.trim()) errs.role = 'Role is required.'
    if (!form.startDate.trim()) errs.startDate = 'Start date is required.'
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
      {/* Company */}
      <div>
        <label style={labelStyle}>Company *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.company ? '#ef4444' : '#2a2a2a' }}
          value={form.company}
          onChange={(e) => set('company', e.target.value)}
          placeholder="Acme Corp"
        />
        {errors.company && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.company}</span>
        )}
      </div>

      {/* Role */}
      <div>
        <label style={labelStyle}>Role *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.role ? '#ef4444' : '#2a2a2a' }}
          value={form.role}
          onChange={(e) => set('role', e.target.value)}
          placeholder="Software Engineer"
        />
        {errors.role && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.role}</span>
        )}
      </div>

      {/* Dates row */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Start Date *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.startDate ? '#ef4444' : '#2a2a2a' }}
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            placeholder="Jan 2022"
          />
          {errors.startDate && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.startDate}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>End Date</label>
          <input
            style={inputStyle}
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            placeholder="Present"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description *</label>
        <textarea
          style={{
            ...inputStyle,
            borderColor: errors.description ? '#ef4444' : '#2a2a2a',
            resize: 'vertical',
          }}
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="One bullet point per line"
        />
        {errors.description && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>
        )}
        <p style={{ fontSize: '0.72rem', color: '#555', marginTop: '0.3rem' }}>
          Write one bullet point per line. Each line becomes a separate bullet.
        </p>
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

interface ExperienceCardProps {
  experience: Experience
  onEdit: () => void
  onDelete: () => void
}

function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        gap: '1rem',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: '3px',
          background: '#22c55e',
          borderRadius: '2px',
          alignSelf: 'stretch',
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Top row */}
        <div className="exp-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left: company + role */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f0f0' }}>
              {experience.company}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#22c55e', marginTop: '0.2rem' }}>
              {experience.role}
            </p>
          </div>

          {/* Right: date + actions */}
          <div className="exp-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
            <span
              className="exp-date"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#888',
                whiteSpace: 'nowrap',
              }}
            >
              {experience.startDate} — {experience.endDate || 'Present'}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
              <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
            </div>
          </div>
        </div>

        {/* Bullets */}
        {experience.bullets.length > 0 && (
          <ul style={{ marginTop: '0.75rem', padding: 0, listStyle: 'none' }}>
            {experience.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7 }}
              >
                • {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const [entries, setEntries] = useState<Experience[]>([])
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

  function persist(updated: Experience[]) {
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function parseBullets(description: string): string[] {
    return description
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }

  function handleAdd(form: FormState) {
    const entry: Experience = {
      id: uid(),
      company: form.company.trim(),
      role: form.role.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      bullets: parseBullets(form.description),
    }
    persist([entry, ...entries])
    setAdding(false)
  }

  function handleEdit(id: string, form: FormState) {
    persist(
      entries.map((e) =>
        e.id === id
          ? {
              ...e,
              company: form.company.trim(),
              role: form.role.trim(),
              startDate: form.startDate.trim(),
              endDate: form.endDate.trim(),
              bullets: parseBullets(form.description),
            }
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
    <section id="experience" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '1.5rem' }}>
        Experience
      </h2>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map((entry) =>
          editingId === entry.id ? (
            <ExperienceForm
              key={entry.id}
              initial={toForm(entry)}
              onSave={(f) => handleEdit(entry.id, f)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ExperienceCard
              key={entry.id}
              experience={entry}
              onEdit={() => { setAdding(false); setEditingId(entry.id) }}
              onDelete={() => handleDelete(entry.id)}
            />
          )
        )}

        {/* Add form — below list */}
        {adding && (
          <ExperienceForm
            initial={emptyForm}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>

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
          + Add Experience
        </button>
      </div>

      <style>{`
        #experience { padding: 2.5rem 1rem !important; }
        .exp-top-row { flex-direction: column !important; gap: 0.5rem !important; }
        .exp-meta { align-items: flex-start !important; }
        .exp-date { white-space: normal !important; }
        @media (min-width: 640px) {
          #experience { padding: 4rem 2rem !important; }
          .exp-top-row { flex-direction: row !important; gap: 0 !important; }
          .exp-meta { align-items: flex-end !important; }
          .exp-date { white-space: nowrap !important; }
        }
      `}</style>
    </section>
  )
}

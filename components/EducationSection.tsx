'use client'

import { useEffect, useState } from 'react'
import { Education } from '@/lib/types'
import { usePreview } from '@/lib/PreviewContext'

const STORAGE_KEY = 'pf_education'

const samples: Education[] = [
  {
    id: '1',
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'New York, USA',
    startDate: 'Sep 2019',
    endDate: 'May 2023',
    description: '',
  },
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#f5f3ef',
  border: '1px solid #e2ddd6',
  borderRadius: '6px',
  color: '#1a1826',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#6b6c7e',
  marginBottom: '0.3rem',
}

// ── Icon button ───────────────────────────────────────────────────────────────

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
        color: hovered ? '#1a1826' : '#6b6c7e',
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
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  description: string
}

const emptyForm: FormState = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
}

function toForm(e: Education): FormState {
  return {
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }
}

interface EducationFormProps {
  initial: FormState
  onSave: (f: FormState) => void
  onCancel: () => void
}

function EducationForm({ initial, onSave, onCancel }: EducationFormProps) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleSave() {
    const errs: typeof errors = {}
    if (!form.institution.trim()) errs.institution = 'Institution is required.'
    if (!form.degree.trim()) errs.degree = 'Degree is required.'
    if (!form.startDate.trim()) errs.startDate = 'Start date is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #2e5bff',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Institution */}
      <div>
        <label style={labelStyle}>Institution *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.institution ? '#f38ba8' : '#e2ddd6' }}
          value={form.institution}
          onChange={(e) => set('institution', e.target.value)}
          placeholder="MIT, Harvard, Stanford..."
        />
        {errors.institution && (
          <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.institution}</span>
        )}
      </div>

      {/* Degree + Field side by side */}
      <div style={{ display: 'flex', gap: '0.75rem' }} className="edu-form-row">
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Degree *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.degree ? '#f38ba8' : '#e2ddd6' }}
            value={form.degree}
            onChange={(e) => set('degree', e.target.value)}
            placeholder="Bachelor of Science"
          />
          {errors.degree && (
            <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.degree}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Field of Study</label>
          <input
            style={inputStyle}
            value={form.field}
            onChange={(e) => set('field', e.target.value)}
            placeholder="Computer Science"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label style={labelStyle}>Location</label>
        <input
          style={inputStyle}
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="New York, USA"
        />
      </div>

      {/* Dates */}
      <div style={{ display: 'flex', gap: '0.75rem' }} className="edu-form-row">
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Start Date *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.startDate ? '#f38ba8' : '#e2ddd6' }}
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            placeholder="Sep 2019"
          />
          {errors.startDate && (
            <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.startDate}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>End Date</label>
          <input
            style={inputStyle}
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            placeholder="May 2023 or Present"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Notes (optional)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' }}
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Relevant coursework, achievements, GPA, clubs..."
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#2e5bff',
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
            color: '#6b6c7e',
            border: '1px solid #e2ddd6',
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

// ── Card ──────────────────────────────────────────────────────────────────────

interface EducationCardProps {
  education: Education
  onEdit: () => void
  onDelete: () => void
}

function EducationCard({ education, onEdit, onDelete }: EducationCardProps) {
  const { preview } = usePreview()
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2ddd6',
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
          background: '#b8c3ff',
          borderRadius: '2px',
          alignSelf: 'stretch',
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Top row */}
        <div className="edu-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1826' }}>
              {education.institution}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#2e5bff', marginTop: '0.2rem' }}>
              {education.degree}{education.field ? ` · ${education.field}` : ''}
            </p>
            {education.location && (
              <p style={{ fontSize: '0.8rem', color: '#6b6c7e', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {education.location}
              </p>
            )}
          </div>

          {/* Right: dates + actions */}
          <div className="edu-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
            <span
              className="edu-date"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#6b6c7e',
                whiteSpace: 'nowrap',
              }}
            >
              {education.startDate}{education.endDate ? ` — ${education.endDate}` : ''}
            </span>
            {!preview && (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
                <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {education.description && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b6c7e',
              lineHeight: 1.7,
              marginTop: '0.75rem',
            }}
          >
            {education.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function EducationSection() {
  const { preview } = usePreview()
  const [entries, setEntries] = useState<Education[]>([])
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

  function persist(updated: Education[]) {
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function handleAdd(form: FormState) {
    const entry: Education = {
      id: uid(),
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      field: form.field.trim(),
      location: form.location.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      description: form.description.trim(),
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
              institution: form.institution.trim(),
              degree: form.degree.trim(),
              field: form.field.trim(),
              location: form.location.trim(),
              startDate: form.startDate.trim(),
              endDate: form.endDate.trim(),
              description: form.description.trim(),
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
    <section id="education" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1826', marginBottom: '1.5rem' }}>
        Education
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map((entry) =>
          !preview && editingId === entry.id ? (
            <EducationForm
              key={entry.id}
              initial={toForm(entry)}
              onSave={(f) => handleEdit(entry.id, f)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <EducationCard
              key={entry.id}
              education={entry}
              onEdit={() => { setAdding(false); setEditingId(entry.id) }}
              onDelete={() => handleDelete(entry.id)}
            />
          )
        )}

        {!preview && adding && (
          <EducationForm
            initial={emptyForm}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>

      {!preview && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => { setEditingId(null); setAdding(true) }}
            style={{
              background: '#2e5bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            + Add Education
          </button>
        </div>
      )}

      <style>{`
        #education { padding: 2.5rem 1rem !important; }
        .edu-top-row { flex-direction: column !important; gap: 0.5rem !important; }
        .edu-meta { align-items: flex-start !important; }
        .edu-date { white-space: normal !important; }
        .edu-form-row { flex-direction: column !important; }
        @media (min-width: 640px) {
          #education { padding: 4rem 2rem !important; }
          .edu-top-row { flex-direction: row !important; gap: 0 !important; }
          .edu-meta { align-items: flex-end !important; }
          .edu-date { white-space: nowrap !important; }
          .edu-form-row { flex-direction: row !important; }
        }
      `}</style>
    </section>
  )
}

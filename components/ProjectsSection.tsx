'use client'

import { useEffect, useState } from 'react'
import { Project } from '@/lib/types'

const STORAGE_KEY = 'pf_projects'

const samples: Project[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'Personal portfolio built with Next.js and Tailwind CSS.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind'],
    url: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Manager App',
    description:
      'A full-stack task management app with authentication and real-time updates.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    url: '',
    createdAt: new Date().toISOString(),
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
  title: string
  description: string
  techStack: string
  url: string
}

const emptyForm: FormState = { title: '', description: '', techStack: '', url: '' }

function toForm(p: Project): FormState {
  return {
    title: p.title,
    description: p.description,
    techStack: p.techStack.join(', '),
    url: p.url,
  }
}

interface ProjectFormProps {
  initial: FormState
  onSave: (f: FormState) => void
  onCancel: () => void
}

function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key as 'title' | 'description']) {
      setErrors((e) => ({ ...e, [key]: undefined }))
    }
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
      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.title ? '#ef4444' : '#2a2a2a' }}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="My awesome project"
        />
        {errors.title && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.title}</span>
        )}
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
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What does this project do?"
        />
        {errors.description && (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        <label style={labelStyle}>Tech Stack</label>
        <input
          style={inputStyle}
          value={form.techStack}
          onChange={(e) => set('techStack', e.target.value)}
          placeholder="React, Node.js, TypeScript"
        />
      </div>

      {/* URL */}
      <div>
        <label style={labelStyle}>Project URL</label>
        <input
          style={inputStyle}
          value={form.url}
          onChange={(e) => set('url', e.target.value)}
          placeholder="https://github.com/..."
        />
      </div>

      {/* Actions */}
      <div className="form-actions" style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
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

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1a1a1a',
        border: `1px solid ${hovered ? '#3a3a3a' : '#2a2a2a'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Title */}
      <p style={{ fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', marginBottom: '0.5rem' }}>
        {project.title}
      </p>

      {/* Description — 3-line clamp */}
      <p
        style={{
          fontSize: '0.875rem',
          color: '#888',
          lineHeight: 1.7,
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {project.techStack.map((tag) => (
          <span
            key={tag}
            style={{
              background: '#222',
              border: '1px solid #2a2a2a',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: '#888',
              borderRadius: '20px',
              padding: '0.2rem 0.6rem',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <div>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#22c55e',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
            >
              View Project →
            </a>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
          <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
        </div>
      </div>
    </div>
  )
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

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setProjects(stored ? JSON.parse(stored) : samples)
    } catch {
      setProjects(samples)
    }
  }, [])

  function persist(updated: Project[]) {
    setProjects(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function handleAdd(form: FormState) {
    const project: Project = {
      id: uid(),
      title: form.title.trim(),
      description: form.description.trim(),
      techStack: form.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      url: form.url.trim(),
      createdAt: new Date().toISOString(),
    }
    persist([project, ...projects])
    setAdding(false)
  }

  function handleEdit(id: string, form: FormState) {
    persist(
      projects.map((p) =>
        p.id === id
          ? {
              ...p,
              title: form.title.trim(),
              description: form.description.trim(),
              techStack: form.techStack
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
              url: form.url.trim(),
            }
          : p
      )
    )
    setEditingId(null)
  }

  function handleDelete(id: string) {
    persist(projects.filter((p) => p.id !== id))
    if (editingId === id) setEditingId(null)
  }

  return (
    <section id="projects" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '1.5rem' }}>
        Projects
      </h2>

      {/* Add form — above grid */}
      {adding && (
        <div style={{ marginBottom: '1.25rem' }}>
          <ProjectForm
            initial={emptyForm}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '1.25rem',
        }}
        className="projects-grid"
      >
        {projects.map((project) =>
          editingId === project.id ? (
            <ProjectForm
              key={project.id}
              initial={toForm(project)}
              onSave={(f) => handleEdit(project.id, f)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => { setAdding(false); setEditingId(project.id) }}
              onDelete={() => handleDelete(project.id)}
            />
          )
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
            width: '100%',
          }}
          className="add-project-btn"
        >
          + Add Project
        </button>
      </div>

      <style>{`
        #projects { padding: 2.5rem 1rem !important; }
        @media (min-width: 640px) {
          #projects { padding: 4rem 2rem !important; }
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .add-project-btn { width: auto !important; }
        }
        @media (min-width: 1024px) {
          .projects-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

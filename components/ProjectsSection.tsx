'use client'

import { useEffect, useRef, useState } from 'react'
import { Project } from '@/lib/types'
import { usePreview } from '@/lib/PreviewContext'

const STORAGE_KEY = 'pf_projects'

const samples: Project[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    summary: 'Personal portfolio with dark mode and live editing.',
    description: 'Personal portfolio built with Next.js and Tailwind CSS.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind'],
    github: '',
    url: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Manager App',
    summary: 'Full-stack task app with real-time updates and auth.',
    description:
      'A full-stack task management app with authentication and real-time updates.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    github: '',
    url: '',
    createdAt: new Date().toISOString(),
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

// ── SVG icons ─────────────────────────────────────────────────────────────────

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ── Form ──────────────────────────────────────────────────────────────────────

interface FormState {
  title: string
  summary: string
  description: string
  techStack: string
  github: string
  url: string
  screenshot: string
}

const emptyForm: FormState = { title: '', summary: '', description: '', techStack: '', github: '', url: '', screenshot: '' }

function toForm(p: Project): FormState {
  return {
    title: p.title,
    summary: p.summary ?? '',
    description: p.description,
    techStack: p.techStack.join(', '),
    github: p.github ?? '',
    url: p.url,
    screenshot: p.screenshot ?? '',
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
  const fileRef = useRef<HTMLInputElement>(null)

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key as 'title' | 'description']) {
      setErrors((e) => ({ ...e, [key]: undefined }))
    }
  }

  function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('screenshot', reader.result as string)
    reader.readAsDataURL(file)
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
        background: '#ffffff',
        border: '1px solid #2e5bff',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Screenshot upload */}
      <div>
        <label style={labelStyle}>Screenshot</label>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #e2ddd6',
            borderRadius: '8px',
            padding: '0.75rem',
            cursor: 'pointer',
            textAlign: 'center',
            background: '#f5f3ef',
            transition: 'border-color 0.15s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2e5bff')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#e2ddd6')}
        >
          {form.screenshot ? (
            <div style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.screenshot}
                alt="Screenshot preview"
                style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); set('screenshot', '') }}
                style={{
                  position: 'absolute', top: '0.4rem', right: '0.4rem',
                  background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
                  borderRadius: '50%', width: '24px', height: '24px',
                  cursor: 'pointer', fontSize: '0.8rem', lineHeight: 1,
                }}
                title="Remove screenshot"
              >
                ×
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#6b6c7e' }}>
              📷 Click to upload screenshot
            </span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleScreenshot} />
      </div>

      <div>
        <label style={labelStyle}>Title *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.title ? '#f38ba8' : '#e2ddd6' }}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="My awesome project"
        />
        {errors.title && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.title}</span>}
      </div>

      {/* Short summary + live link side by side */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={labelStyle}>Short Summary</label>
          <input
            style={inputStyle}
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="One-line description shown on the card"
            maxLength={100}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={labelStyle}>Live Link</label>
          <input
            style={inputStyle}
            value={form.url}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://myproject.com"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description *</label>
        <textarea
          style={{ ...inputStyle, borderColor: errors.description ? '#f38ba8' : '#e2ddd6', resize: 'vertical' }}
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Full description shown in the detail modal"
        />
        {errors.description && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.description}</span>}
      </div>

      <div>
        <label style={labelStyle}>Tech Stack</label>
        <input
          style={inputStyle}
          value={form.techStack}
          onChange={(e) => set('techStack', e.target.value)}
          placeholder="React, Node.js, TypeScript"
        />
      </div>

      <div>
        <label style={labelStyle}>GitHub URL</label>
        <input
          style={inputStyle}
          value={form.github}
          onChange={(e) => set('github', e.target.value)}
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#2e5bff', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '0.5rem 1.2rem',
            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'none', color: '#6b6c7e', border: '1px solid #e2ddd6',
            borderRadius: '8px', padding: '0.5rem 1.2rem',
            fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2ddd6',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', color: '#6b6c7e',
            fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1,
            padding: '0.25rem 0.5rem', borderRadius: '6px',
          }}
          title="Close"
        >
          ×
        </button>

        {/* Screenshot */}
        {project.screenshot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.screenshot}
            alt={`${project.title} screenshot`}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '1.25rem', display: 'block', border: '1px solid #e2ddd6' }}
          />
        )}

        {/* Title */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1826', paddingRight: '2rem', marginBottom: '0.5rem' }}>
          {project.title}
        </h3>

        {/* Summary */}
        {project.summary && (
          <p style={{ fontSize: '0.9rem', color: '#2e5bff', fontWeight: 600, marginBottom: '0.75rem' }}>
            {project.summary}
          </p>
        )}

        {/* Description */}
        <p style={{ fontSize: '0.9375rem', color: '#6b6c7e', lineHeight: 1.8, marginBottom: '1.25rem' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {project.techStack.map((tag) => (
              <span
                key={tag}
                style={{
                  background: '#f5f3ef', border: '1px solid #e2ddd6',
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: '#6b6c7e', borderRadius: '20px', padding: '0.25rem 0.7rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        {(project.github || project.url) && (
          <div style={{ borderTop: '1px solid #e2ddd6', marginBottom: '1.25rem' }} />
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#f5f3ef', border: '1px solid #c0bbb3',
                color: '#1a1826', borderRadius: '8px',
                padding: '0.5rem 1.1rem', fontSize: '0.875rem',
                textDecoration: 'none', fontWeight: 600,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#1a1826'
                ;(e.currentTarget as HTMLElement).style.background = '#e2ddd6'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#c0bbb3'
                ;(e.currentTarget as HTMLElement).style.background = '#f5f3ef'
              }}
            >
              <GithubIcon /> GitHub
            </a>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#2e5bff', border: '1px solid #2e5bff',
                color: '#fff', borderRadius: '8px',
                padding: '0.5rem 1.1rem', fontSize: '0.875rem',
                textDecoration: 'none', fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#3a68ff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#2e5bff')}
            >
              <ExternalLinkIcon /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '0.9rem', color: hovered ? '#1a1826' : '#6b6c7e',
        padding: '0.1rem 0.2rem', transition: 'color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
  onOpen: () => void
}

function ProjectCard({ project, onEdit, onDelete, onOpen }: ProjectCardProps) {
  const { preview } = usePreview()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hovered ? '#c0bbb3' : '#e2ddd6'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
        cursor: 'pointer',
      }}
      onClick={onOpen}
    >
      {/* Screenshot */}
      {project.screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.screenshot}
          alt={`${project.title} screenshot`}
          style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', borderBottom: '1px solid #e2ddd6' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '8px',
          background: 'linear-gradient(90deg, #2e5bff22, #2e5bff11)',
        }} />
      )}

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title + live link */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1826', margin: 0 }}>
            {project.title}
          </p>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Live demo"
              style={{ color: '#2e5bff', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>

        {/* Short summary */}
        {(project.summary || project.description) && (
          <p style={{
            fontSize: '0.825rem', color: '#6b6c7e', lineHeight: 1.6,
            marginBottom: '0.75rem', flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {project.summary || project.description}
          </p>
        )}

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
          {project.techStack.map((tag) => (
            <span
              key={tag}
              style={{
                background: '#f5f3ef', border: '1px solid #e2ddd6',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: '#6b6c7e', borderRadius: '20px', padding: '0.2rem 0.6rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {project.github && (
              <span style={{ color: '#6b6c7e', display: 'flex', alignItems: 'center' }}>
                <GithubIcon />
              </span>
            )}
          </div>

          {!preview && (
            <div
              style={{ display: 'flex', gap: '0.5rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
              <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const { preview } = usePreview()
  const [projects, setProjects] = useState<Project[]>([])
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalProject, setModalProject] = useState<Project | null>(null)

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
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(updated) }))
  }

  function handleAdd(form: FormState) {
    const project: Project = {
      id: uid(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      github: form.github.trim(),
      url: form.url.trim(),
      screenshot: form.screenshot || undefined,
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
              summary: form.summary.trim(),
              description: form.description.trim(),
              techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
              github: form.github.trim(),
              url: form.url.trim(),
              screenshot: form.screenshot || undefined,
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1826', marginBottom: '1.5rem' }}>
        Projects
      </h2>

      {!preview && adding && (
        <div style={{ marginBottom: '1.25rem' }}>
          <ProjectForm initial={emptyForm} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }} className="projects-grid">
        {projects.map((project) =>
          !preview && editingId === project.id ? (
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
              onOpen={() => setModalProject(project)}
            />
          )
        )}
      </div>

      {!preview && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => { setEditingId(null); setAdding(true) }}
            className="add-project-btn"
            style={{
              background: '#2e5bff', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '0.6rem 1.4rem',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%',
            }}
          >
            + Add Project
          </button>
        </div>
      )}

      {modalProject && (
        <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
      )}

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

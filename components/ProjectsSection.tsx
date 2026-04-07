'use client'

import { useEffect, useRef, useState } from 'react'
import { Project, MediaEntry } from '@/lib/types'
import { usePreview } from '@/lib/PreviewContext'
import { syncSection } from '@/lib/syncToDb'

const STORAGE_KEY      = 'pf_projects'
const INTRO_KEY        = 'pf_project_intro'
const MEDIA_KEY        = 'pf_project_media'

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 10) }

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const MAX = 1100
      let { width, height } = img
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = objectUrl
  })
}

function getVideoEmbed(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

function isEmbedUrl(url: string) {
  return url.includes('youtube.com/embed') || url.includes('player.vimeo.com')
}

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
    description: 'A full-stack task management app with authentication and real-time updates.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    github: '',
    url: '',
    createdAt: new Date().toISOString(),
  },
]

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#f5f3ef', border: '1px solid #e2ddd6',
  borderRadius: '6px', color: '#1a1826', padding: '0.5rem 0.75rem',
  fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', color: '#6b6c7e', marginBottom: '0.3rem',
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
        color: hovered ? '#1a1826' : '#6b6c7e', padding: '0.1rem 0.2rem', transition: 'color 0.15s' }}>
      {children}
    </button>
  )
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

// ══════════════════════════════════════════════════════════════════════════════
// INTRO TEXT (editable inline)
// ══════════════════════════════════════════════════════════════════════════════

function IntroText({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { preview } = usePreview()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function save() {
    onChange(draft.trim())
    setEditing(false)
  }

  if (!preview && editing) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontSize: '0.95rem', lineHeight: 1.7 }}
          placeholder="Describe what you've built, your passion for building things…"
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={save}
            style={{ background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '6px',
              padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            Save
          </button>
          <button onClick={() => { setDraft(value); setEditing(false) }}
            style={{ background: 'none', color: '#6b6c7e', border: '1px solid #e2ddd6', borderRadius: '6px',
              padding: '0.4rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (!value && preview) return null

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      {value ? (
        <p style={{ fontSize: '0.975rem', color: '#6b6c7e', lineHeight: 1.75, margin: 0, flex: 1 }}>
          {value}
        </p>
      ) : !preview ? (
        <p style={{ fontSize: '0.875rem', color: '#b0aaa4', lineHeight: 1.75, margin: 0, flex: 1, fontStyle: 'italic' }}>
          Add a short intro about what you&apos;ve built…
        </p>
      ) : null}
      {!preview && (
        <button onClick={() => { setDraft(value); setEditing(true) }}
          title="Edit intro text"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            color: '#9b9b9b', padding: '0.1rem 0.2rem', flexShrink: 0, marginTop: '2px' }}>
          ✏️
        </button>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MEDIA ENTRIES (photo/video + text)
// ══════════════════════════════════════════════════════════════════════════════

interface MediaFormProps {
  initial: Partial<MediaEntry>
  onSave: (entry: Omit<MediaEntry, 'id'>) => void
  onCancel: () => void
}

function MediaForm({ initial, onSave, onCancel }: MediaFormProps) {
  const [mediaType, setMediaType] = useState<'image' | 'video'>(initial.mediaType ?? 'image')
  const [mediaUrl, setMediaUrl] = useState(initial.mediaUrl ?? '')
  const [text, setText] = useState(initial.text ?? '')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(initial.mediaUrl ?? '')
  const [errors, setErrors] = useState<{ media?: string; text?: string }>({})
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      setMediaUrl(compressed); setPreviewUrl(compressed)
      setErrors(err => ({ ...err, media: undefined }))
    } catch { setErrors(err => ({ ...err, media: 'Failed to process image.' }))
    } finally { setUploading(false) }
  }

  function handleSave() {
    const errs: typeof errors = {}
    if (!mediaUrl.trim()) errs.media = 'Please add a photo, video URL, or image URL.'
    if (!text.trim()) errs.text = 'Please add some text.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    const finalUrl = mediaType === 'video' ? getVideoEmbed(mediaUrl.trim()) : mediaUrl.trim()
    onSave({ mediaType, mediaUrl: finalUrl, text: text.trim() })
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #2e5bff', borderRadius: '12px', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['image', 'video'] as const).map(t => (
          <button key={t} onClick={() => { setMediaType(t); setMediaUrl(''); setPreviewUrl('') }}
            style={{ padding: '0.35rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid', transition: 'all 0.15s',
              background: mediaType === t ? '#2e5bff' : 'transparent',
              color: mediaType === t ? '#fff' : '#6b6c7e',
              borderColor: mediaType === t ? '#2e5bff' : '#d1cec8' }}>
            {t === 'image' ? '🖼 Photo' : '🎬 Video'}
          </button>
        ))}
      </div>

      <div>
        <label style={labelStyle}>{mediaType === 'image' ? 'Photo *' : 'Video URL *'}</label>
        {mediaType === 'image' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: '#6b6c7e',
                background: '#f0eee8', width: 'auto', display: 'inline-block' }}>
              {uploading ? 'Compressing…' : '📁 Upload photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            <span style={{ fontSize: '0.75rem', color: '#9b9b9b' }}>— or paste an image URL —</span>
            <input style={{ ...inputStyle, borderColor: errors.media ? '#f38ba8' : '#e2ddd6' }}
              value={mediaUrl.startsWith('data:') ? '' : mediaUrl}
              onChange={e => { setMediaUrl(e.target.value); setPreviewUrl(e.target.value); setErrors(err => ({ ...err, media: undefined })) }}
              placeholder="https://example.com/photo.jpg" />
          </div>
        ) : (
          <input style={{ ...inputStyle, borderColor: errors.media ? '#f38ba8' : '#e2ddd6' }}
            value={mediaUrl}
            onChange={e => { setMediaUrl(e.target.value); setPreviewUrl(e.target.value); setErrors(err => ({ ...err, media: undefined })) }}
            placeholder="https://youtube.com/watch?v=... or Vimeo URL" />
        )}
        {errors.media && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.media}</span>}
      </div>

      {previewUrl && (
        <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '220px', background: '#f0eee8' }}>
          {mediaType === 'image'
            ? <img src={previewUrl} alt="preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
            : <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                {isEmbedUrl(getVideoEmbed(previewUrl))
                  ? <iframe src={getVideoEmbed(previewUrl)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  : <video src={previewUrl} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />}
              </div>}
        </div>
      )}

      <div>
        <label style={labelStyle}>Text *</label>
        <textarea style={{ ...inputStyle, borderColor: errors.text ? '#f38ba8' : '#e2ddd6', resize: 'vertical' }}
          rows={4} value={text} onChange={e => { setText(e.target.value); setErrors(err => ({ ...err, text: undefined })) }}
          placeholder="Describe this project, what you built, what you learned…" />
        {errors.text && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.text}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button onClick={handleSave}
          style={{ background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '8px',
            padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
          Save
        </button>
        <button onClick={onCancel}
          style={{ background: 'none', color: '#6b6c7e', border: '1px solid #e2ddd6', borderRadius: '8px',
            padding: '0.5rem 1.2rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function MediaCard({ entry, onEdit, onDelete }: { entry: MediaEntry; onEdit: () => void; onDelete: () => void }) {
  const { preview } = usePreview()
  return (
    <div style={{ background: '#fff', border: '1px solid #e2ddd6', borderRadius: '12px', overflow: 'hidden' }}>
      <div className="proj-media-inner">
        <div className="proj-media-left">
          {entry.mediaType === 'image'
            ? <img src={entry.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#1a1826' }}>
                {isEmbedUrl(entry.mediaUrl)
                  ? <iframe src={entry.mediaUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  : <video src={entry.mediaUrl} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />}
              </div>}
        </div>
        <div className="proj-media-right">
          {!preview && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
              <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
            </div>
          )}
          <p style={{ fontSize: '0.95rem', color: '#3a3a4a', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
            {entry.text}
          </p>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECT FORM + CARD + MODAL (existing)
// ══════════════════════════════════════════════════════════════════════════════

interface FormState {
  title: string; summary: string; description: string
  techStack: string; github: string; url: string; screenshot: string
}

const emptyForm: FormState = { title: '', summary: '', description: '', techStack: '', github: '', url: '', screenshot: '' }

function toForm(p: Project): FormState {
  return { title: p.title, summary: p.summary ?? '', description: p.description,
    techStack: p.techStack.join(', '), github: p.github ?? '', url: p.url, screenshot: p.screenshot ?? '' }
}

function ProjectForm({ initial, onSave, onCancel }: { initial: FormState; onSave: (f: FormState) => void; onCancel: () => void }) {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const fileRef = useRef<HTMLInputElement>(null)

  function set(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key as 'title' | 'description']) setErrors(e => ({ ...e, [key]: undefined }))
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
    <div style={{ background: '#fff', border: '1px solid #2e5bff', borderRadius: '12px', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div>
        <label style={labelStyle}>Screenshot</label>
        <div onClick={() => fileRef.current?.click()}
          style={{ border: '2px dashed #e2ddd6', borderRadius: '8px', padding: '0.75rem',
            cursor: 'pointer', textAlign: 'center', background: '#f5f3ef', transition: 'border-color 0.15s',
            position: 'relative', overflow: 'hidden' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#2e5bff')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2ddd6')}>
          {form.screenshot ? (
            <div style={{ position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.screenshot} alt="Screenshot preview"
                style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
              <button onClick={e => { e.stopPropagation(); set('screenshot', '') }}
                style={{ position: 'absolute', top: '0.4rem', right: '0.4rem',
                  background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
                  borderRadius: '50%', width: '24px', height: '24px',
                  cursor: 'pointer', fontSize: '0.8rem', lineHeight: 1 }} title="Remove screenshot">×</button>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#6b6c7e' }}>📷 Click to upload screenshot</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleScreenshot} />
      </div>

      <div>
        <label style={labelStyle}>Title *</label>
        <input style={{ ...inputStyle, borderColor: errors.title ? '#f38ba8' : '#e2ddd6' }}
          value={form.title} onChange={e => set('title', e.target.value)} placeholder="My awesome project" />
        {errors.title && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.title}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={labelStyle}>Short Summary</label>
          <input style={inputStyle} value={form.summary} onChange={e => set('summary', e.target.value)}
            placeholder="One-line description shown on the card" maxLength={100} />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={labelStyle}>Live Link</label>
          <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)}
            placeholder="https://myproject.com" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description *</label>
        <textarea style={{ ...inputStyle, borderColor: errors.description ? '#f38ba8' : '#e2ddd6', resize: 'vertical' }}
          rows={3} value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Full description shown in the detail modal" />
        {errors.description && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.description}</span>}
      </div>

      <div>
        <label style={labelStyle}>Tech Stack</label>
        <input style={inputStyle} value={form.techStack} onChange={e => set('techStack', e.target.value)}
          placeholder="React, Node.js, TypeScript" />
      </div>

      <div>
        <label style={labelStyle}>GitHub URL</label>
        <input style={inputStyle} value={form.github} onChange={e => set('github', e.target.value)}
          placeholder="https://github.com/username/repo" />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
        <button onClick={handleSave}
          style={{ background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '8px',
            padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
          Save
        </button>
        <button onClick={onCancel}
          style={{ background: 'none', color: '#6b6c7e', border: '1px solid #e2ddd6', borderRadius: '8px',
            padding: '0.5rem 1.2rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
      <div style={{ background: '#fff', border: '1px solid #e2ddd6', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
            color: '#6b6c7e', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1,
            padding: '0.25rem 0.5rem', borderRadius: '6px' }} title="Close">×</button>

        {project.screenshot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.screenshot} alt={`${project.title} screenshot`}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '1.25rem', display: 'block', border: '1px solid #e2ddd6' }} />
        )}

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1826', paddingRight: '2rem', marginBottom: '0.5rem' }}>
          {project.title}
        </h3>
        {project.summary && (
          <p style={{ fontSize: '0.9rem', color: '#2e5bff', fontWeight: 600, marginBottom: '0.75rem' }}>{project.summary}</p>
        )}
        <p style={{ fontSize: '0.9375rem', color: '#6b6c7e', lineHeight: 1.8, marginBottom: '1.25rem' }}>{project.description}</p>

        {project.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {project.techStack.map(tag => (
              <span key={tag} style={{ background: '#f5f3ef', border: '1px solid #e2ddd6',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#6b6c7e',
                borderRadius: '20px', padding: '0.25rem 0.7rem' }}>{tag}</span>
            ))}
          </div>
        )}

        {(project.github || project.url) && <div style={{ borderTop: '1px solid #e2ddd6', marginBottom: '1.25rem' }} />}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f5f3ef',
                border: '1px solid #c0bbb3', color: '#1a1826', borderRadius: '8px',
                padding: '0.5rem 1.1rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1826'; (e.currentTarget as HTMLElement).style.background = '#e2ddd6' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c0bbb3'; (e.currentTarget as HTMLElement).style.background = '#f5f3ef' }}>
              <GithubIcon /> GitHub
            </a>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#2e5bff',
                border: '1px solid #2e5bff', color: '#fff', borderRadius: '8px',
                padding: '0.5rem 1.1rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#3a68ff')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#2e5bff')}>
              <ExternalLinkIcon /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onEdit, onDelete, onOpen }: { project: Project; onEdit: () => void; onDelete: () => void; onOpen: () => void }) {
  const { preview } = usePreview()
  const [hovered, setHovered] = useState(false)

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', border: `1px solid ${hovered ? '#c0bbb3' : '#e2ddd6'}`,
        borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.07)' : 'none', cursor: 'pointer' }}
      onClick={onOpen}>
      {project.screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.screenshot} alt={`${project.title} screenshot`}
          style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', borderBottom: '1px solid #e2ddd6' }} />
      ) : (
        <div style={{ width: '100%', height: '8px', background: 'linear-gradient(90deg, #2e5bff22, #2e5bff11)' }} />
      )}

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1826', margin: 0 }}>{project.title}</p>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()} title="Live demo"
              style={{ color: '#2e5bff', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}>
              <ExternalLinkIcon />
            </a>
          )}
        </div>

        {(project.summary || project.description) && (
          <p style={{ fontSize: '0.825rem', color: '#6b6c7e', lineHeight: 1.6, marginBottom: '0.75rem', flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.summary || project.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
          {project.techStack.map(tag => (
            <span key={tag} style={{ background: '#f5f3ef', border: '1px solid #e2ddd6',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#6b6c7e',
              borderRadius: '20px', padding: '0.2rem 0.6rem' }}>{tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {project.github && <span style={{ color: '#6b6c7e', display: 'flex', alignItems: 'center' }}><GithubIcon /></span>}
          </div>
          {!preview && (
            <div style={{ display: 'flex', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
              <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
              <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ══════════════════════════════════════════════════════════════════════════════

export default function ProjectsSection() {
  const { preview } = usePreview()

  // Intro text
  const [intro, setIntro] = useState('')

  // Media entries
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([])
  const [addingMedia, setAddingMedia] = useState(false)
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null)

  // Project cards
  const [projects, setProjects] = useState<Project[]>([])
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalProject, setModalProject] = useState<Project | null>(null)

  useEffect(() => {
    try { const s = localStorage.getItem(INTRO_KEY); setIntro(s ? JSON.parse(s) : '') } catch { setIntro('') }
    try { const m = localStorage.getItem(MEDIA_KEY); setMediaEntries(m ? JSON.parse(m) : []) } catch { setMediaEntries([]) }
    try { const p = localStorage.getItem(STORAGE_KEY); setProjects(p ? JSON.parse(p) : samples) } catch { setProjects(samples) }
  }, [])

  function persistIntro(val: string) {
    setIntro(val)
    localStorage.setItem(INTRO_KEY, JSON.stringify(val))
    syncSection(INTRO_KEY, val)
  }

  function persistMedia(updated: MediaEntry[]) {
    setMediaEntries(updated)
    localStorage.setItem(MEDIA_KEY, JSON.stringify(updated))
    syncSection(MEDIA_KEY, updated)
  }

  function persistProjects(updated: Project[]) {
    setProjects(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    syncSection(STORAGE_KEY, updated)
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(updated) }))
  }

  // Media handlers
  function handleAddMedia(data: Omit<MediaEntry, 'id'>) { persistMedia([...mediaEntries, { id: uid(), ...data }]); setAddingMedia(false) }
  function handleEditMedia(id: string, data: Omit<MediaEntry, 'id'>) { persistMedia(mediaEntries.map(e => e.id === id ? { id, ...data } : e)); setEditingMediaId(null) }
  function handleDeleteMedia(id: string) { persistMedia(mediaEntries.filter(e => e.id !== id)); if (editingMediaId === id) setEditingMediaId(null) }

  // Project handlers
  function handleAdd(form: FormState) {
    const project: Project = { id: uid(), title: form.title.trim(), summary: form.summary.trim(),
      description: form.description.trim(), techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      github: form.github.trim(), url: form.url.trim(), screenshot: form.screenshot || undefined, createdAt: new Date().toISOString() }
    persistProjects([project, ...projects]); setAdding(false)
  }

  function handleEdit(id: string, form: FormState) {
    persistProjects(projects.map(p => p.id === id
      ? { ...p, title: form.title.trim(), summary: form.summary.trim(), description: form.description.trim(),
          techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
          github: form.github.trim(), url: form.url.trim(), screenshot: form.screenshot || undefined }
      : p))
    setEditingId(null)
  }

  function handleDelete(id: string) { persistProjects(projects.filter(p => p.id !== id)); if (editingId === id) setEditingId(null) }

  return (
    <section id="projects" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1826', marginBottom: '0.75rem' }}>
        Projects
      </h2>

      {/* Editable intro text */}
      <IntroText value={intro} onChange={persistIntro} />

      {/* Media entries */}
      {(mediaEntries.length > 0 || !preview) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {mediaEntries.map(entry =>
            !preview && editingMediaId === entry.id ? (
              <MediaForm key={entry.id} initial={entry}
                onSave={data => handleEditMedia(entry.id, data)} onCancel={() => setEditingMediaId(null)} />
            ) : (
              <MediaCard key={entry.id} entry={entry}
                onEdit={() => { setAddingMedia(false); setEditingMediaId(entry.id) }}
                onDelete={() => handleDeleteMedia(entry.id)} />
            )
          )}

          {!preview && addingMedia && (
            <MediaForm initial={{}} onSave={handleAddMedia} onCancel={() => setAddingMedia(false)} />
          )}

          {!preview && (
            <div>
              <button onClick={() => { setEditingMediaId(null); setAddingMedia(true) }}
                style={{ background: 'transparent', color: '#2e5bff', border: '1.5px dashed #2e5bff',
                  borderRadius: '8px', padding: '0.55rem 1.4rem', fontWeight: 600,
                  fontSize: '0.875rem', cursor: 'pointer' }}>
                + Add Photo / Video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Divider before project cards */}
      {(mediaEntries.length > 0) && (
        <div style={{ borderTop: '1px solid rgba(100,96,88,0.12)', marginBottom: '2rem' }} />
      )}

      {/* Project form (new) */}
      {!preview && adding && (
        <div style={{ marginBottom: '1.25rem' }}>
          <ProjectForm initial={emptyForm} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      {/* Project cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem' }} className="projects-grid">
        {projects.map(project =>
          !preview && editingId === project.id ? (
            <ProjectForm key={project.id} initial={toForm(project)}
              onSave={f => handleEdit(project.id, f)} onCancel={() => setEditingId(null)} />
          ) : (
            <ProjectCard key={project.id} project={project}
              onEdit={() => { setAdding(false); setEditingId(project.id) }}
              onDelete={() => handleDelete(project.id)}
              onOpen={() => setModalProject(project)} />
          )
        )}
      </div>

      {/* Add project button */}
      {!preview && (
        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={() => { setEditingId(null); setAdding(true) }} className="add-project-btn"
            style={{ background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%' }}>
            + Add Project
          </button>
        </div>
      )}

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}

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
        .proj-media-inner { display: flex; flex-direction: column; }
        .proj-media-left { width: 100%; min-height: 200px; background: #f0eee8; overflow: hidden; }
        .proj-media-right { padding: 1.25rem 1.5rem; flex: 1; }
        @media (min-width: 640px) {
          .proj-media-inner { flex-direction: row; }
          .proj-media-left { width: 42%; min-height: 240px; flex-shrink: 0; }
          .proj-media-right { padding: 1.75rem 2rem; }
        }
      `}</style>
    </section>
  )
}

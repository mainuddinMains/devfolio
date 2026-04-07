'use client'

import { useEffect, useRef, useState } from 'react'
import { Extra, MediaEntry } from '@/lib/types'
import { usePreview } from '@/lib/PreviewContext'
import { syncSection } from '@/lib/syncToDb'

const EXTRAS_KEY = 'pf_extras'
const MEDIA_KEY = 'pf_about_media'

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
        color: hovered ? '#1a1826' : '#6b6c7e', padding: '0.1rem 0.2rem', transition: 'color 0.15s' }}
    >{children}</button>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MEDIA ENTRIES
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
  const [preview, setPreview] = useState(initial.mediaUrl ?? '')
  const [errors, setErrors] = useState<{ media?: string; text?: string }>({})
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      setMediaUrl(compressed)
      setPreview(compressed)
      setErrors(err => ({ ...err, media: undefined }))
    } catch {
      setErrors(err => ({ ...err, media: 'Failed to process image.' }))
    } finally {
      setUploading(false)
    }
  }

  function handleUrlChange(url: string) {
    setMediaUrl(url)
    setPreview(url)
    setErrors(err => ({ ...err, media: undefined }))
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

      {/* Media type toggle */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['image', 'video'] as const).map(t => (
          <button key={t} onClick={() => { setMediaType(t); setMediaUrl(''); setPreview('') }}
            style={{ padding: '0.35rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid', transition: 'all 0.15s',
              background: mediaType === t ? '#2e5bff' : 'transparent',
              color: mediaType === t ? '#fff' : '#6b6c7e',
              borderColor: mediaType === t ? '#2e5bff' : '#d1cec8',
            }}>
            {t === 'image' ? '🖼 Photo' : '🎬 Video'}
          </button>
        ))}
      </div>

      {/* Media input */}
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
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://example.com/photo.jpg" />
          </div>
        ) : (
          <input style={{ ...inputStyle, borderColor: errors.media ? '#f38ba8' : '#e2ddd6' }}
            value={mediaUrl} onChange={e => { setMediaUrl(e.target.value); setErrors(err => ({ ...err, media: undefined })) }}
            placeholder="https://youtube.com/watch?v=... or Vimeo URL" />
        )}
        {errors.media && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.media}</span>}
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '220px', background: '#f0eee8' }}>
          {mediaType === 'image'
            ? <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
            : <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                {isEmbedUrl(getVideoEmbed(preview))
                  ? <iframe src={getVideoEmbed(preview)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  : <video src={preview} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />}
              </div>
          }
        </div>
      )}

      {/* Text */}
      <div>
        <label style={labelStyle}>Text *</label>
        <textarea style={{ ...inputStyle, borderColor: errors.text ? '#f38ba8' : '#e2ddd6', resize: 'vertical' }}
          rows={4} value={text} onChange={e => { setText(e.target.value); setErrors(err => ({ ...err, text: undefined })) }}
          placeholder="Write something about this photo or video…" />
        {errors.text && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.text}</span>}
      </div>

      {/* Actions */}
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
    <div style={{ background: '#fff', border: '1px solid #e2ddd6', borderRadius: '12px',
      overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="media-card-inner">
        {/* Media */}
        <div className="media-card-media">
          {entry.mediaType === 'image'
            ? <img src={entry.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#1a1826' }}>
                {isEmbedUrl(entry.mediaUrl)
                  ? <iframe src={entry.mediaUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  : <video src={entry.mediaUrl} controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />}
              </div>
          }
        </div>

        {/* Text */}
        <div className="media-card-text">
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
// EXTRAS (existing achievements/awards)
// ══════════════════════════════════════════════════════════════════════════════

const sampleExtras: Extra[] = [
  { id: '1', type: 'Leadership', title: 'Team Lead — Hackathon Project',
    description: 'Led a team of 4 developers to build and ship a full-stack app in 48 hours.', date: '2024' },
]

const TYPES: Extra['type'][] = ['Leadership', 'Award', 'Certification', 'Volunteering', 'Other']

const badgeStyle: Record<Extra['type'], { background: string; color: string }> = {
  Leadership:    { background: 'rgba(46,91,255,0.12)',  color: '#2e5bff' },
  Award:         { background: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
  Certification: { background: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  Volunteering:  { background: 'rgba(244,114,182,0.1)', color: '#f472b6' },
  Other:         { background: 'rgba(0,0,0,0.06)',      color: '#6b6c7e' },
}

interface ExtraFormState { type: Extra['type']; title: string; description: string; date: string }
const emptyExtraForm: ExtraFormState = { type: 'Leadership', title: '', description: '', date: '' }

function ExtrasForm({ initial, onSave, onCancel }: { initial: ExtraFormState; onSave: (f: ExtraFormState) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof ExtraFormState, string>>>({})

  function set<K extends keyof ExtraFormState>(key: K, value: ExtraFormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
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
        <label style={labelStyle}>Type *</label>
        <select value={form.type} onChange={e => set('type', e.target.value as Extra['type'])}
          style={{ ...inputStyle, cursor: 'pointer' }}>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Title *</label>
        <input style={{ ...inputStyle, borderColor: errors.title ? '#f38ba8' : '#e2ddd6' }}
          value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Dean's List" />
        {errors.title && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.title}</span>}
      </div>
      <div>
        <label style={labelStyle}>Description *</label>
        <textarea style={{ ...inputStyle, borderColor: errors.description ? '#f38ba8' : '#e2ddd6', resize: 'vertical' }}
          rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." />
        {errors.description && <span style={{ color: '#f38ba8', fontSize: '0.75rem' }}>{errors.description}</span>}
      </div>
      <div>
        <label style={labelStyle}>Date (optional)</label>
        <input style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} placeholder="2024 or Jan 2024" />
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
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

function ExtraCard({ extra, onEdit, onDelete }: { extra: Extra; onEdit: () => void; onDelete: () => void }) {
  const { preview } = usePreview()
  const badge = badgeStyle[extra.type]
  return (
    <div style={{ background: '#fff', border: '1px solid #e2ddd6', borderRadius: '12px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: badge.background, color: badge.color, fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem', borderRadius: '20px', padding: '0.2rem 0.7rem' }}>
          {extra.type}
        </span>
        {!preview && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <IconBtn onClick={onEdit} title="Edit">✏️</IconBtn>
            <IconBtn onClick={onDelete} title="Delete">🗑</IconBtn>
          </div>
        )}
      </div>
      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1826', marginTop: '0.6rem' }}>{extra.title}</p>
      <p style={{ fontSize: '0.875rem', color: '#6b6c7e', lineHeight: 1.7, marginTop: '0.4rem' }}>{extra.description}</p>
      {extra.date && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#6b6c7e', marginTop: '0.5rem' }}>{extra.date}</p>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ══════════════════════════════════════════════════════════════════════════════

export default function ExtrasSection() {
  const { preview } = usePreview()

  // Media entries
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([])
  const [addingMedia, setAddingMedia] = useState(false)
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null)

  // Extras
  const [extras, setExtras] = useState<Extra[]>([])
  const [addingExtra, setAddingExtra] = useState(false)
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const m = localStorage.getItem(MEDIA_KEY)
      setMediaEntries(m ? JSON.parse(m) : [])
    } catch { setMediaEntries([]) }

    try {
      const e = localStorage.getItem(EXTRAS_KEY)
      setExtras(e ? JSON.parse(e) : sampleExtras)
    } catch { setExtras(sampleExtras) }
  }, [])

  function persistMedia(updated: MediaEntry[]) {
    setMediaEntries(updated)
    localStorage.setItem(MEDIA_KEY, JSON.stringify(updated))
    syncSection(MEDIA_KEY, updated)
  }

  function persistExtras(updated: Extra[]) {
    setExtras(updated)
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated))
    syncSection(EXTRAS_KEY, updated)
  }

  // Media handlers
  function handleAddMedia(data: Omit<MediaEntry, 'id'>) {
    persistMedia([...mediaEntries, { id: uid(), ...data }])
    setAddingMedia(false)
  }

  function handleEditMedia(id: string, data: Omit<MediaEntry, 'id'>) {
    persistMedia(mediaEntries.map(e => e.id === id ? { id, ...data } : e))
    setEditingMediaId(null)
  }

  function handleDeleteMedia(id: string) {
    persistMedia(mediaEntries.filter(e => e.id !== id))
    if (editingMediaId === id) setEditingMediaId(null)
  }

  // Extras handlers
  function handleAddExtra(form: ExtraFormState) {
    const entry: Extra = { id: uid(), type: form.type, title: form.title.trim(),
      description: form.description.trim(), date: form.date.trim() }
    persistExtras([entry, ...extras])
    setAddingExtra(false)
  }

  function handleEditExtra(id: string, form: ExtraFormState) {
    persistExtras(extras.map(e => e.id === id
      ? { ...e, type: form.type, title: form.title.trim(), description: form.description.trim(), date: form.date.trim() }
      : e))
    setEditingExtraId(null)
  }

  function handleDeleteExtra(id: string) {
    persistExtras(extras.filter(e => e.id !== id))
    if (editingExtraId === id) setEditingExtraId(null)
  }

  const hasContent = mediaEntries.length > 0 || extras.length > 0 || !preview

  if (!hasContent) return null

  return (
    <section id="more" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1826', marginBottom: '2rem' }}>
        More About Me
      </h2>

      {/* ── Media entries ── */}
      {(mediaEntries.length > 0 || !preview) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {mediaEntries.map(entry =>
            !preview && editingMediaId === entry.id ? (
              <MediaForm
                key={entry.id}
                initial={entry}
                onSave={data => handleEditMedia(entry.id, data)}
                onCancel={() => setEditingMediaId(null)}
              />
            ) : (
              <MediaCard
                key={entry.id}
                entry={entry}
                onEdit={() => { setAddingMedia(false); setEditingMediaId(entry.id) }}
                onDelete={() => handleDeleteMedia(entry.id)}
              />
            )
          )}

          {!preview && addingMedia && (
            <MediaForm
              initial={{}}
              onSave={handleAddMedia}
              onCancel={() => setAddingMedia(false)}
            />
          )}

          {!preview && (
            <div>
              <button
                onClick={() => { setEditingMediaId(null); setAddingMedia(true) }}
                style={{ background: 'transparent', color: '#2e5bff', border: '1.5px dashed #2e5bff',
                  borderRadius: '8px', padding: '0.55rem 1.4rem', fontWeight: 600,
                  fontSize: '0.875rem', cursor: 'pointer' }}>
                + Add Photo / Video
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Divider between media and extras ── */}
      {mediaEntries.length > 0 && extras.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(100,96,88,0.12)', marginBottom: '2rem' }} />
      )}

      {/* ── Extras grid ── */}
      {(extras.length > 0 || !preview) && (
        <>
          <div className="extras-grid">
            {extras.map(entry =>
              !preview && editingExtraId === entry.id ? (
                <ExtrasForm
                  key={entry.id}
                  initial={{ type: entry.type, title: entry.title, description: entry.description, date: entry.date }}
                  onSave={f => handleEditExtra(entry.id, f)}
                  onCancel={() => setEditingExtraId(null)}
                />
              ) : (
                <ExtraCard
                  key={entry.id}
                  extra={entry}
                  onEdit={() => { setAddingExtra(false); setEditingExtraId(entry.id) }}
                  onDelete={() => handleDeleteExtra(entry.id)}
                />
              )
            )}
          </div>

          {!preview && addingExtra && (
            <div style={{ marginTop: '1rem' }}>
              <ExtrasForm initial={emptyExtraForm} onSave={handleAddExtra} onCancel={() => setAddingExtra(false)} />
            </div>
          )}

          {!preview && (
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => { setEditingExtraId(null); setAddingExtra(true) }}
                style={{ background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '8px',
                  padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                + Add Entry
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        #more { padding: 2.5rem 1rem !important; }
        @media (min-width: 640px) { #more { padding: 4rem 2rem !important; } }

        .extras-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .extras-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .media-card-inner {
          display: flex;
          flex-direction: column;
        }
        .media-card-media {
          width: 100%;
          min-height: 200px;
          background: #f0eee8;
          overflow: hidden;
        }
        .media-card-text {
          padding: 1.25rem 1.5rem;
          flex: 1;
        }
        @media (min-width: 640px) {
          .media-card-inner {
            flex-direction: row;
          }
          .media-card-media {
            width: 42%;
            min-height: 240px;
            flex-shrink: 0;
          }
          .media-card-text {
            flex: 1;
            padding: 1.75rem 2rem;
          }
        }
      `}</style>
    </section>
  )
}

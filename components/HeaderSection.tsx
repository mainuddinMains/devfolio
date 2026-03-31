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
  typewriterTexts: ['Full-Stack Developer', 'Open Source Contributor', 'Problem Solver'],
}

interface HeaderSectionProps {
  onNameChange: (name: string) => void
  onProfileImageChange?: (image: string) => void
}

type EditableField = Exclude<keyof HeaderData, 'profileImage' | 'typewriterTexts'>

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

// ── Typewriter ────────────────────────────────────────────────────────────────

function Typewriter({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')
  const [idx, setIdx] = useState(0)
  const cancelledRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    cancelledRef.current = false
    if (!texts.length) return

    function tick() {
      if (cancelledRef.current) return
      setDisplayed((prev) => {
        const target = texts[idx % texts.length]
        if (phase === 'typing') {
          const next = target.slice(0, prev.length + 1)
          if (next === target) {
            timerRef.current = setTimeout(() => { setPhase('pause'); tick() }, 2800)
          } else {
            timerRef.current = setTimeout(tick, 180)
          }
          return next
        }
        if (phase === 'pause') {
          setPhase('deleting')
          timerRef.current = setTimeout(tick, 120)
          return prev
        }
        // deleting
        const next = prev.slice(0, prev.length - 1)
        if (next === '') {
          setIdx((i) => i + 1)
          setPhase('typing')
          timerRef.current = setTimeout(tick, 500)
        } else {
          timerRef.current = setTimeout(tick, 90)
        }
        return next
      })
    }

    timerRef.current = setTimeout(tick, 500)
    return () => {
      cancelledRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [idx, phase, texts])

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#2e5bff', fontWeight: 600 }}>
      {displayed}
      <span style={{ animation: 'tw-blink 1s step-end infinite', borderRight: '2px solid #2e5bff', marginLeft: '1px' }} />
    </span>
  )
}

function TypewriterEditor({
  texts,
  onSave,
  onClose,
}: {
  texts: string[]
  onSave: (texts: string[]) => void
  onClose: () => void
}) {
  const [items, setItems] = useState<string[]>(texts.length ? [...texts] : [''])
  const [newText, setNewText] = useState('')

  function addItem() {
    const trimmed = newText.trim()
    if (!trimmed) return
    setItems((prev) => [...prev, trimmed])
    setNewText('')
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, j) => j !== i))
  }

  function updateItem(i: number, val: string) {
    setItems((prev) => prev.map((t, j) => (j === i ? val : t)))
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #2e5bff', borderRadius: '12px',
      padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
      maxWidth: '420px',
    }}>
      <p style={{ fontWeight: 700, color: '#1a1826', fontSize: '0.875rem', margin: 0 }}>Typewriter Texts</p>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            style={{
              flex: 1, background: '#f5f3ef', border: '1px solid #e2ddd6',
              borderRadius: '6px', padding: '0.4rem 0.65rem', fontSize: '0.85rem',
              color: '#1a1826', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => removeItem(i)}
            style={{ background: 'none', border: 'none', color: '#f38ba8', cursor: 'pointer', fontSize: '1rem', padding: '0 0.2rem' }}
            title="Remove"
          >×</button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addItem() }}
          placeholder="Add a new phrase…"
          style={{
            flex: 1, background: '#f5f3ef', border: '1px dashed #c0bbb3',
            borderRadius: '6px', padding: '0.4rem 0.65rem', fontSize: '0.85rem',
            color: '#1a1826', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={addItem}
          style={{
            background: '#f5f3ef', border: '1px solid #e2ddd6', borderRadius: '6px',
            padding: '0.4rem 0.7rem', fontSize: '0.85rem', cursor: 'pointer', color: '#2e5bff', fontWeight: 700,
          }}
        >+</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onSave(items.filter((t) => t.trim()))}
          style={{
            background: '#2e5bff', color: '#fff', border: 'none', borderRadius: '7px',
            padding: '0.45rem 1.1rem', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
          }}
        >Save</button>
        <button
          onClick={onClose}
          style={{
            background: 'none', color: '#6b6c7e', border: '1px solid #e2ddd6', borderRadius: '7px',
            padding: '0.45rem 1.1rem', fontSize: '0.85rem', cursor: 'pointer',
          }}
        >Cancel</button>
      </div>
    </div>
  )
}

// ── Coder Character ──────────────────────────────────────────────────────────

function CoderCharacter() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <svg viewBox="0 0 160 100" width="180" height="112" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <g className="cc-body">
          {/* Torso */}
          <rect x="62" y="56" width="36" height="26" rx="6" fill="#2e5bff" />
          {/* Collar V */}
          <path d="M74 56 L80 64 L86 56" fill="none" stroke="#b8c3ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Neck */}
          <rect x="76" y="50" width="8" height="8" rx="3" fill="#ffd99a" />

          {/* Head */}
          <circle cx="80" cy="38" r="16" fill="#ffd99a" />

          {/* Hair */}
          <path d="M64 34 Q66 21 80 22 Q94 21 96 34 Q92 27 80 28 Q68 27 64 34Z" fill="#1a1826" />

          {/* Ears */}
          <ellipse cx="64" cy="39" rx="2.8" ry="3.8" fill="#f5c07a" />
          <ellipse cx="96" cy="39" rx="2.8" ry="3.8" fill="#f5c07a" />

          {/* Glasses frames */}
          <rect x="69" y="35" width="9.5" height="7" rx="2.2" fill="none" stroke="#2e5bff" strokeWidth="1.3" />
          <rect x="81.5" y="35" width="9.5" height="7" rx="2.2" fill="none" stroke="#2e5bff" strokeWidth="1.3" />
          {/* Bridge */}
          <line x1="78.5" y1="38.5" x2="81.5" y2="38.5" stroke="#2e5bff" strokeWidth="1.3" />
          {/* Temples */}
          <line x1="64" y1="38.5" x2="69" y2="38.5" stroke="#2e5bff" strokeWidth="1.3" />
          <line x1="91" y1="38.5" x2="96" y2="38.5" stroke="#2e5bff" strokeWidth="1.3" />

          {/* Eyes */}
          <ellipse cx="73.8" cy="38.5" rx="2" ry="2.5" fill="#1a1826" className="cc-eye-l" />
          <ellipse cx="86.2" cy="38.5" rx="2" ry="2.5" fill="#1a1826" className="cc-eye-r" />
          {/* Eye shine */}
          <circle cx="74.7" cy="37.4" r="0.7" fill="white" />
          <circle cx="87.1" cy="37.4" r="0.7" fill="white" />

          {/* Nose */}
          <circle cx="80" cy="43.5" r="1.1" fill="#e8b87a" />
          {/* Smile */}
          <path d="M76 48 Q80 52 84 48" stroke="#c08060" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* Left arm */}
          <g className="cc-arm-l">
            <path d="M63 65 Q50 78 47 94" stroke="#2e5bff" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="96" r="7" fill="#ffd99a" />
          </g>

          {/* Right arm */}
          <g className="cc-arm-r">
            <path d="M97 65 Q110 78 113 94" stroke="#2e5bff" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="96" r="7" fill="#ffd99a" />
          </g>
        </g>
      </svg>
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
  const projectsRef = useRef<string>('portfolio/  blog/  api/')
  nameRef.current = name
  titleRef.current = title

  // Keep projectsRef in sync with localStorage
  useEffect(() => {
    function readProjects() {
      try {
        const stored = localStorage.getItem('pf_projects')
        if (stored) {
          const parsed = JSON.parse(stored) as { title: string }[]
          if (parsed.length > 0) {
            projectsRef.current = parsed
              .map((p) => p.title.toLowerCase().replace(/\s+/g, '-') + '/')
              .join('  ')
            return
          }
        }
      } catch { /* ignore */ }
      projectsRef.current = 'portfolio/  blog/  api/'
    }
    readProjects()
    function onStorage(e: StorageEvent) {
      if (e.key === 'pf_projects') readProjects()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    cancelledRef.current = false
    let seqIdx = 0
    let accumulated: TermLine[] = []

    function getSequence() {
      return [
        { cmd: 'whoami', output: nameRef.current },
        { cmd: 'cat role.txt', output: titleRef.current },
        { cmd: 'cat specialization.txt', output: 'AI Integration' },
        { cmd: 'ls ./projects/', output: projectsRef.current },
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-start', flexShrink: 0, width: '100%', maxWidth: '400px' }}>
    <CoderCharacter />
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
      <div style={{ padding: '0.85rem 1rem', height: '200px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
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
    </div>
  )
}

export default function HeaderSection({ onNameChange, onProfileImageChange }: HeaderSectionProps) {
  const { preview } = usePreview()
  const [data, setData] = useState<HeaderData>(fallback)
  const [editing, setEditing] = useState<FieldState | null>(null)
  const [editingTypewriter, setEditingTypewriter] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
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

  const handleResumeUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      const updated = { ...data, resumeFile: base64 }
      setData(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
    reader.readAsDataURL(file)
    // reset input so same file can be re-uploaded
    e.target.value = ''
  }, [data])

  function handleResumeDownload() {
    if (!data.resumeFile) return
    const firstName = data.name.trim().split(/\s+/)[0]
    const filename = `${firstName}_resume.pdf`
    const link = document.createElement('a')
    link.href = data.resumeFile
    link.download = filename
    link.click()
  }

  function handleResumeRemove() {
    const updated = { ...data, resumeFile: undefined }
    setData(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

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

  function saveTypewriterTexts(texts: string[]) {
    const updated = { ...data, typewriterTexts: texts }
    setData(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setEditingTypewriter(false)
  }

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

      {/* Typewriter */}
      <div style={{ marginBottom: '1rem', minHeight: '1.8rem' }}>
        {!preview && editingTypewriter ? (
          <TypewriterEditor
            texts={data.typewriterTexts ?? fallback.typewriterTexts ?? []}
            onSave={saveTypewriterTexts}
            onClose={() => setEditingTypewriter(false)}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            className={preview ? '' : 'editable-row'}
            onMouseEnter={preview ? undefined : (e) => { const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn'); if (btn) btn.style.opacity = '1' }}
            onMouseLeave={preview ? undefined : (e) => { const btn = e.currentTarget.querySelector<HTMLElement>('.pencil-btn'); if (btn) btn.style.opacity = '0' }}
          >
            <Typewriter texts={data.typewriterTexts?.length ? data.typewriterTexts : (fallback.typewriterTexts ?? [])} />
            {!preview && <PencilBtn onClick={() => setEditingTypewriter(true)} />}
          </div>
        )}
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
          const href = platform === 'email' ? (data.email ? `mailto:${data.email}` : '') : data[platform] as string
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

      {/* Resume */}
      <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {data.resumeFile ? (
          <>
            <button
              onClick={handleResumeDownload}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                background: '#2e5bff', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '0.5rem 1.1rem',
                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1a44e8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2e5bff')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </button>
            {!preview && (
              <>
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  style={{
                    background: 'none', border: '1px solid #e2ddd6', borderRadius: '8px',
                    padding: '0.5rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer',
                    color: '#6b6c7e', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2e5bff')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2ddd6')}
                >
                  Replace
                </button>
                <button
                  onClick={handleResumeRemove}
                  style={{
                    background: 'none', border: 'none', padding: '0.5rem 0.4rem',
                    fontSize: '0.8rem', cursor: 'pointer', color: '#c0bbb3',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f38ba8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#c0bbb3')}
                  title="Remove resume"
                >
                  ✕
                </button>
              </>
            )}
          </>
        ) : !preview ? (
          <button
            onClick={() => resumeInputRef.current?.click()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: 'none', color: '#6b6c7e',
              border: '1.5px dashed #c0bbb3', borderRadius: '8px',
              padding: '0.5rem 1.1rem', fontSize: '0.875rem',
              cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2e5bff'; e.currentTarget.style.color = '#2e5bff' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#c0bbb3'; e.currentTarget.style.color = '#6b6c7e' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Resume
          </button>
        ) : null}
        <input
          ref={resumeInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleResumeUpload}
        />
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
        @keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cc-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes cc-arm-l-anim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes cc-arm-r-anim { 0%,50%{transform:translateY(6px)} 25%,75%{transform:translateY(0)} }
        @keyframes cc-blink { 0%,88%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} 97%{transform:scaleY(1)} }
        .cc-body { animation: cc-bob 2.8s ease-in-out infinite; }
        .cc-arm-l { animation: cc-arm-l-anim 0.48s ease-in-out infinite; }
        .cc-arm-r { animation: cc-arm-r-anim 0.48s ease-in-out infinite; }
        .cc-eye-l { animation: cc-blink 3.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .cc-eye-r { animation: cc-blink 3.5s ease-in-out 0.07s infinite; transform-box: fill-box; transform-origin: center; }
      `}</style>
    </section>
  )
}

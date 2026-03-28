'use client'

import { useEffect, useMemo, useState } from 'react'
import { Skill } from '@/lib/types'

const STORAGE_KEY = 'pf_skills'

const samples: Skill[] = [
  { id: 's1', category: 'Languages', name: 'JavaScript' },
  { id: 's2', category: 'Languages', name: 'TypeScript' },
  { id: 's3', category: 'Languages', name: 'Python' },
  { id: 's4', category: 'Languages', name: 'SQL' },
  { id: 's5', category: 'Frameworks', name: 'React' },
  { id: 's6', category: 'Frameworks', name: 'Next.js' },
  { id: 's7', category: 'Frameworks', name: 'Node.js' },
  { id: 's8', category: 'Frameworks', name: 'Express' },
  { id: 's9', category: 'Tools', name: 'Git' },
  { id: 's10', category: 'Tools', name: 'Docker' },
  { id: 's11', category: 'Tools', name: 'VS Code' },
  { id: 's12', category: 'Tools', name: 'Figma' },
]

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// ── Skill pill ────────────────────────────────────────────────────────────────

interface SkillPillProps {
  name: string
  onDelete: () => void
}

function SkillPill({ name, onDelete }: SkillPillProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          background: '#222',
          border: '1px solid #2a2a2a',
          color: '#f0f0f0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          borderRadius: '20px',
          padding: '0.3rem 0.85rem',
          display: 'inline-block',
          userSelect: 'none',
        }}
      >
        {name}
      </span>

      {hovered && (
        <button
          onClick={onDelete}
          title="Remove skill"
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '16px',
            height: '16px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            fontSize: '0.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── Add-skill inline input ────────────────────────────────────────────────────

interface AddSkillInputProps {
  onSave: (name: string) => void
  onCancel: () => void
}

function AddSkillInput({ onSave, onCancel }: AddSkillInputProps) {
  const [value, setValue] = useState('')

  function commit() {
    const trimmed = value.trim()
    if (trimmed) onSave(trimmed)
    else onCancel()
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') onCancel()
        }}
        style={{
          width: '120px',
          background: '#111',
          border: '1px solid #3a3a3a',
          borderRadius: '20px',
          color: '#f0f0f0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          padding: '0.3rem 0.75rem',
          outline: 'none',
        }}
        placeholder="skill name"
      />
      <button
        onClick={commit}
        style={{
          background: '#22c55e',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '0.7rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
        }}
      >
        ✓
      </button>
    </div>
  )
}

// ── Add-category inline input ─────────────────────────────────────────────────

interface AddCategoryInputProps {
  onSave: (category: string) => void
  onCancel: () => void
}

function AddCategoryInput({ onSave, onCancel }: AddCategoryInputProps) {
  const [value, setValue] = useState('')

  function commit() {
    const trimmed = value.trim()
    if (trimmed) onSave(trimmed)
    else onCancel()
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') onCancel()
        }}
        style={{
          background: '#111',
          border: '1px solid #3a3a3a',
          borderRadius: '6px',
          color: '#f0f0f0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          padding: '0.4rem 0.75rem',
          outline: 'none',
          width: '180px',
        }}
        placeholder="Category name"
      />
      <button
        onClick={commit}
        style={{
          background: '#22c55e',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '0.35rem 0.7rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        ✓
      </button>
      <button
        onClick={onCancel}
        style={{
          background: 'none',
          color: '#888',
          border: '1px solid #2a2a2a',
          borderRadius: '6px',
          padding: '0.35rem 0.7rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        ✗
      </button>
    </div>
  )
}

// ── Category row ──────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: string
  skills: Skill[]
  onDeleteSkill: (id: string) => void
  onAddSkill: (category: string, name: string) => void
}

function CategoryRow({ category, skills, onDeleteSkill, onAddSkill }: CategoryRowProps) {
  const [addingSkill, setAddingSkill] = useState(false)

  return (
    <div
      className="category-row"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
      }}
    >
      {/* Category label */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          minWidth: '130px',
          paddingTop: '0.3rem',
          flexShrink: 0,
        }}
      >
        {category}
      </span>

      {/* Pills area */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        {skills.map((skill) => (
          <SkillPill
            key={skill.id}
            name={skill.name}
            onDelete={() => onDeleteSkill(skill.id)}
          />
        ))}

        {/* + skill ghost pill or inline input */}
        {addingSkill ? (
          <AddSkillInput
            onSave={(name) => {
              onAddSkill(category, name)
              setAddingSkill(false)
            }}
            onCancel={() => setAddingSkill(false)}
          />
        ) : (
          <button
            onClick={() => setAddingSkill(true)}
            style={{
              background: 'none',
              border: '1px dashed #3a3a3a',
              color: '#888',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              borderRadius: '20px',
              padding: '0.3rem 0.85rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#888'
              ;(e.currentTarget as HTMLElement).style.color = '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#3a3a3a'
              ;(e.currentTarget as HTMLElement).style.color = '#888'
            }}
          >
            + skill
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [addingCategory, setAddingCategory] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setSkills(stored ? JSON.parse(stored) : samples)
    } catch {
      setSkills(samples)
    }
  }, [])

  function persist(updated: Skill[]) {
    setSkills(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  // Group by category, preserving insertion order
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      if (!map.has(skill.category)) map.set(skill.category, [])
      map.get(skill.category)!.push(skill)
    }
    return map
  }, [skills])

  function handleDeleteSkill(id: string) {
    persist(skills.filter((s) => s.id !== id))
  }

  function handleAddSkill(category: string, name: string) {
    const skill: Skill = { id: uid(), category, name }
    persist([...skills, skill])
  }

  function handleAddCategory(category: string) {
    // Only add if category doesn't already exist
    if (!grouped.has(category)) {
      const skill: Skill = { id: uid(), category, name: '' }
      // We add a placeholder that we'll immediately allow the user to populate.
      // Actually: just create the category row with no skills — user adds skills via "+ skill".
      // We store a sentinel with empty name that we filter out during render.
      persist([...skills, { ...skill, name: '__placeholder__' }])
    }
    setAddingCategory(false)
  }

  return (
    <section id="skills" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '1.5rem' }}>
        Skills
      </h2>

      {Array.from(grouped.entries()).map(([category, categorySkills]) => (
        <CategoryRow
          key={category}
          category={category}
          skills={categorySkills.filter((s) => s.name !== '__placeholder__')}
          onDeleteSkill={handleDeleteSkill}
          onAddSkill={handleAddSkill}
        />
      ))}

      {/* Add category */}
      {addingCategory ? (
        <AddCategoryInput
          onSave={handleAddCategory}
          onCancel={() => setAddingCategory(false)}
        />
      ) : (
        <button
          onClick={() => setAddingCategory(true)}
          style={{
            background: 'none',
            border: '1px dashed #3a3a3a',
            color: '#888',
            borderRadius: '8px',
            padding: '0.5rem 1.2rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#888'
            ;(e.currentTarget as HTMLElement).style.color = '#f0f0f0'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#3a3a3a'
            ;(e.currentTarget as HTMLElement).style.color = '#888'
          }}
        >
          + Add Category
        </button>
      )}

      <style>{`
        #skills { padding: 2.5rem 1rem !important; }
        .category-row { flex-direction: column !important; }
        @media (min-width: 640px) {
          #skills { padding: 4rem 2rem !important; }
          .category-row { flex-direction: row !important; }
        }
      `}</style>
    </section>
  )
}

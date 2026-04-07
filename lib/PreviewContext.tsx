'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PreviewContextValue {
  preview: boolean      // true = viewer/preview mode (no edit UI)
  setPreview: (v: boolean) => void
  isOwner: boolean      // true = authenticated as the site owner
  setIsOwner: (v: boolean) => void
}

const PreviewContext = createContext<PreviewContextValue>({
  preview: true,
  setPreview: () => {},
  isOwner: false,
  setIsOwner: () => {},
})

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false)
  // Default to preview=true so visitors never see edit UI before auth check completes
  const [preview, setPreviewState] = useState(true)

  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then((data: unknown) => {
        const d = data as { ok: boolean; owner?: boolean }
        if (d.ok && d.owner) {
          setIsOwner(true)
          setPreviewState(false) // owner defaults to edit mode
        }
      })
      .catch(() => {})
  }, [])

  // Only the owner can leave preview mode
  function setPreview(v: boolean) {
    if (!v && !isOwner) return
    setPreviewState(v)
  }

  return (
    <PreviewContext.Provider value={{ preview, setPreview, isOwner, setIsOwner }}>
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  return useContext(PreviewContext)
}

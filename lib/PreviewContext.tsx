'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PreviewContextValue {
  preview: boolean
  setPreview: (v: boolean) => void
}

const PreviewContext = createContext<PreviewContextValue>({ preview: false, setPreview: () => {} })

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState(false)
  return (
    <PreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PreviewContext.Provider>
  )
}

export function usePreview() {
  return useContext(PreviewContext)
}

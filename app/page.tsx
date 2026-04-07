'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeaderSection from '@/components/HeaderSection'
import ProjectsSection from '@/components/ProjectsSection'
import ExperienceSection from '@/components/ExperienceSection'
import EducationSection from '@/components/EducationSection'
import SkillsSection from '@/components/SkillsSection'
import ExtrasSection from '@/components/ExtrasSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { PreviewProvider } from '@/lib/PreviewContext'

const divider = (
  <div style={{ borderTop: '1px solid rgba(100,96,88,0.15)', maxWidth: '1100px', margin: '0 auto' }} />
)

export default function Home() {
  const [name, setName] = useState('Your Name')
  const [profileImage, setProfileImage] = useState<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Load all sections from the database into localStorage before rendering.
    // This ensures data is never lost when localStorage is cleared or the user
    // visits from a new device / browser.
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(raw => {
        const res = raw as { ok: boolean; data?: Record<string, unknown> }
        if (res.ok && res.data) {
          Object.entries(res.data).forEach(([key, value]) => {
            // Only write keys that are not already in localStorage so that any
            // unsaved in-progress edits in this browser tab are not overwritten.
            if (value !== null && value !== undefined && !localStorage.getItem(key)) {
              localStorage.setItem(key, JSON.stringify(value))
            }
          })
        }
      })
      .catch(() => {})
      .finally(() => setReady(true))
  }, [])

  // Hold rendering until database data is in localStorage so every component
  // initialises with real saved data, never with stale sample placeholders.
  if (!ready) {
    return <div style={{ minHeight: '100vh', background: '#f8f7f3' }} />
  }

  return (
    <PreviewProvider>
      <Navbar name={name} profileImage={profileImage} />
      <HeaderSection onNameChange={setName} onProfileImageChange={setProfileImage} />
      {divider}
      <ProjectsSection />
      {divider}
      <ExperienceSection />
      {divider}
      <EducationSection />
      {divider}
      <SkillsSection />
      {divider}
      <ExtrasSection />
      {divider}
      <ContactSection />
      <Footer name={name} />
    </PreviewProvider>
  )
}

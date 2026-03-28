'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import HeaderSection from '@/components/HeaderSection'
import ProjectsSection from '@/components/ProjectsSection'
import ExperienceSection from '@/components/ExperienceSection'
import SkillsSection from '@/components/SkillsSection'
import ExtrasSection from '@/components/ExtrasSection'
import Footer from '@/components/Footer'

const divider = (
  <div style={{ borderTop: '1px solid #2a2a2a', maxWidth: '1100px', margin: '0 auto' }} />
)

export default function Home() {
  const [name, setName] = useState('Your Name')

  return (
    <>
      <Navbar name={name} />
      <HeaderSection onNameChange={setName} />
      {divider}
      <ProjectsSection />
      {divider}
      <ExperienceSection />
      {divider}
      <SkillsSection />
      {divider}
      <ExtrasSection />
      <Footer name={name} />
    </>
  )
}

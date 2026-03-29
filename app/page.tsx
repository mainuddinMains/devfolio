'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import HeaderSection from '@/components/HeaderSection'
import ProjectsSection from '@/components/ProjectsSection'
import ExperienceSection from '@/components/ExperienceSection'
import EducationSection from '@/components/EducationSection'
import SkillsSection from '@/components/SkillsSection'
import ExtrasSection from '@/components/ExtrasSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

const divider = (
  <div style={{ borderTop: '1px solid rgba(100,96,88,0.15)', maxWidth: '1100px', margin: '0 auto' }} />
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
      <EducationSection />
      {divider}
      <SkillsSection />
      {divider}
      <ExtrasSection />
      {divider}
      <ContactSection />
      <Footer name={name} />
    </>
  )
}

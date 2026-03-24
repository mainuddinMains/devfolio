"use client"

import { useState } from "react"
import HeroSection from "@/components/HeroSection"
import SkillsSection from "@/components/SkillsSection"
import EducationSection from "@/components/EducationSection"
import ProjectsSection from "@/components/ProjectsSection"
import { projects as initialProjects } from "@/data/projects"
import type { Project } from "@/lib/types"

const DIVIDER = (
  <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem" }}>
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--border)",
        opacity: 0.4,
        margin: 0,
      }}
    />
  </div>
)

export default function PageClient() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  function handleProjectClick(project: Project) {
    console.log("Project clicked:", project)
  }

  return (
    <>
      <HeroSection
        stats={{ projects: projects.length, disciplines: 3, years: 4, technologies: 8 }}
      />
      {DIVIDER}
      <SkillsSection />
      {DIVIDER}
      <EducationSection />
      {DIVIDER}
      <ProjectsSection
        projects={projects}
        onProjectClick={handleProjectClick}
      />
    </>
  )
}

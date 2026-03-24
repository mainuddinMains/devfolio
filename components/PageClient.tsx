"use client"

import { useState, useEffect } from "react"
import HeroSection from "@/components/HeroSection"
import SkillsSection from "@/components/SkillsSection"
import EducationSection from "@/components/EducationSection"
import ProjectsSection from "@/components/ProjectsSection"
import ProjectModal from "@/components/ProjectModal"
import AddProjectForm from "@/components/AddProjectForm"
import Footer from "@/components/Footer"
import { projects as defaultProjects } from "@/data/projects"
import type { Project } from "@/lib/types"

const LS_KEY = "devfolio_projects"
const defaultIds = new Set(defaultProjects.map((p) => p.id))

const DIVIDER = (
  <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem" }}>
    <hr style={{ border: "none", borderTop: "1px solid var(--border)", opacity: 0.4, margin: 0 }} />
  </div>
)

export default function PageClient() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  /* ── Hook 1: Load user-added projects on mount, merge with defaults ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (!stored) return
      const parsed: Project[] = JSON.parse(stored)
      if (!Array.isArray(parsed)) return
      // User-added projects first, then defaults; deduplicate by id
      const merged = [
        ...parsed.filter((p) => !defaultIds.has(p.id)),
        ...defaultProjects,
      ]
      setProjects(merged)
    } catch {
      // Corrupted data — silently ignore and keep defaults
    }
  }, [])

  /* ── Hook 2: Persist only user-added projects on every change ── */
  useEffect(() => {
    const userAdded = projects.filter((p) => !defaultIds.has(p.id))
    localStorage.setItem(LS_KEY, JSON.stringify(userAdded))
  }, [projects])

  function handleProjectClick(project: Project) {
    setSelectedProject(project)
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  function handleAddProject(project: Project) {
    setProjects((prev) => [project, ...prev])
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
      <ProjectsSection projects={projects} onProjectClick={handleProjectClick} />
      {DIVIDER}
      <AddProjectForm onAddProject={handleAddProject} />
      <Footer />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onDelete={handleDelete}
      />
    </>
  )
}

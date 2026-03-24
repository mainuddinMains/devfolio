export interface Project {
  id: string
  title: string
  description: string
  category: "dev" | "ai" | "design"
  techStack: string[]
  liveUrl?: string
  repoUrl?: string
  thumbnailUrl?: string
  emoji: string
  featured: boolean
  createdAt: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  field: string
  startYear: string
  endYear: string
  type: "degree" | "certificate" | "course"
}

export interface Skill {
  name: string
  category: "dev" | "ai" | "design"
}

export interface PersonalInfo {
  name: string
  title: string
  bio: string
  email?: string
  github?: string
  linkedin?: string
  avatarUrl?: string
}

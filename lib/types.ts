export interface HeaderData {
  name: string
  title: string
  bio: string
  github: string
  linkedin: string
  instagram: string
  email: string
}

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  url: string
  createdAt: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Skill {
  id: string
  category: string
  name: string
}

export interface Extra {
  id: string
  type: 'Leadership' | 'Award' | 'Certification' | 'Volunteering' | 'Other'
  title: string
  description: string
  date: string
}

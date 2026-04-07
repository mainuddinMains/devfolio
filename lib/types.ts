export interface HeaderData {
  name: string
  title: string
  bio: string
  github: string
  linkedin: string
  instagram: string
  email: string
  profileImage?: string
  typewriterTexts?: string[]
  resumeFile?: string
}

export interface Project {
  id: string
  title: string
  summary?: string
  description: string
  techStack: string[]
  github: string
  url: string
  screenshot?: string
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

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  description: string
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

export interface MediaEntry {
  id: string
  mediaUrl: string      // base64 data URL (image) or external URL (image/video)
  mediaType: 'image' | 'video'
  text: string          // displayed to the right of the media
}

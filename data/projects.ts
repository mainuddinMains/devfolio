import type { Project } from "@/lib/types"

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Travel Assistant",
    description:
      "A full-stack travel planning application that helps users discover destinations, build itineraries, and manage trip logistics. Features include interactive maps, real-time flight data, hotel recommendations, and a collaborative trip-sharing system for groups.",
    category: "dev",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "Docker", "Tailwind CSS"],
    liveUrl: "",
    repoUrl: "",
    thumbnailUrl: "",
    emoji: "✈️",
    featured: true,
    createdAt: "2024-11-01",
  },
  {
    id: "proj-2",
    title: "Sentiment Insight Engine",
    description:
      "An NLP pipeline that performs multi-class sentiment analysis on product reviews and social media posts. Uses a fine-tuned BERT model served via a FastAPI backend, with a Streamlit dashboard for real-time visualization of sentiment trends and topic clusters.",
    category: "ai",
    techStack: ["Python", "PyTorch", "HuggingFace", "FastAPI", "Streamlit", "Pandas"],
    liveUrl: "",
    repoUrl: "",
    thumbnailUrl: "",
    emoji: "🧠",
    featured: true,
    createdAt: "2024-08-15",
  },
  {
    id: "proj-3",
    title: "Pulse Design System",
    description:
      "A component-driven design system built for modern web products. Includes a comprehensive token library covering color, typography, spacing, and motion. Delivered as a Figma library alongside a documented React component package, enabling consistent UI at scale.",
    category: "design",
    techStack: ["Figma", "React", "Tailwind CSS", "Storybook", "TypeScript"],
    liveUrl: "",
    repoUrl: "",
    thumbnailUrl: "",
    emoji: "🎨",
    featured: true,
    createdAt: "2024-05-20",
  },
]

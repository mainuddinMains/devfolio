import HeroSection from "@/components/HeroSection"
import SkillsSection from "@/components/SkillsSection"
import EducationSection from "@/components/EducationSection"

const DIVIDER = (
  <div
    style={{
      maxWidth: 1000,
      margin: "0 auto",
      padding: "0 2rem",
    }}
  >
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

export default function Home() {
  return (
    <>
      <HeroSection
        stats={{ projects: 12, disciplines: 3, years: 4, technologies: 8 }}
      />
      {DIVIDER}
      <SkillsSection />
      {DIVIDER}
      <EducationSection />
    </>
  )
}

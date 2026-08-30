import { useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EducationSection } from './components/sections/EducationSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ResumeSection } from './components/sections/ResumeSection';
import { ContactSection } from './components/sections/ContactSection';
import { PaperTexture } from './components/ui/PaperTexture';
import { useSectionReveal } from './hooks/useSectionReveal';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  useSectionReveal(mainRef);

  return (
    <div className="relative min-h-screen bg-[#faf9f6]">
      {/* Tactile Archival Paper Grain Texture */}
      <PaperTexture />

      <Header />
      <main ref={mainRef} className="relative pt-[52px] bg-transparent">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

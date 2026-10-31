import React from 'react';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/layout/Navigation';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { Gallery } from './components/gallery/Gallery';
import { Showreel } from './components/sections/Showreel';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Craft } from './components/sections/Craft';
import { Education } from './components/sections/Education';
import { Volunteering } from './components/sections/Volunteering';
import { Contact } from './components/sections/Contact';
import { Photography } from './components/sections/Photography';

export function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen w-full overflow-x-clip bg-bg font-sans text-ink">
          <a
            href="#work"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
            
            Skip to work
          </a>
          <ScrollProgress />
          <Navigation />
          <main>
            <Hero />
            <Gallery />
            <Showreel />
            <Photography />
            <About />
            <Experience />
            <Craft />
            <Education />
            <Volunteering />
            <Contact />
          </main>
          <Footer />
          <div className="grain" aria-hidden />
        </div>
      </MotionConfig>
    </ThemeProvider>);

}
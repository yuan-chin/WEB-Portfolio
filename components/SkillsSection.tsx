'use client';

import { useEffect, useRef } from 'react';
import './SkillsSection.css';
import BlackHole from './BlackHole';
import StarBorder from './StarBorder';

/* ── Skill data with Simple Icons CDN URLs ── */
const allSkills = [
  { name: 'HTML / CSS', icon: 'https://cdn.simpleicons.org/html5/E34F26', color: '#E34F26' },
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E' },
  { name: 'Vue.js', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', color: '#4FC08D' },
  { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular/DD0031', color: '#DD0031' },
  { name: 'Flutter', icon: 'https://cdn.simpleicons.org/flutter/02569B', color: '#02569B' },
  { name: 'PHP', icon: 'https://cdn.simpleicons.org/php/777BB4', color: '#777BB4' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1', color: '#4479A1' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248' },
  { name: 'WordPress', icon: 'https://cdn.simpleicons.org/wordpress/21759B', color: '#21759B' },
  { name: 'Git / GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff', color: '#ffffff' },
  { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E', color: '#F24E1E' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', color: '#007ACC' },
];

const frontendSkills = [
  { name: 'HTML / CSS', icon: 'https://cdn.simpleicons.org/html5/E34F26', color: '#E34F26' },
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E' },
  { name: 'Vue.js', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', color: '#4FC08D' },
  { name: 'Angular', icon: 'https://cdn.simpleicons.org/angular/DD0031', color: '#DD0031' },
  { name: 'Flutter', icon: 'https://cdn.simpleicons.org/flutter/02569B', color: '#02569B' },
];

const backendSkills = [
  { name: 'PHP', icon: 'https://cdn.simpleicons.org/php/777BB4', color: '#777BB4' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1', color: '#4479A1' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248' },
];

const toolsSkills = [
  { name: 'WordPress', icon: 'https://cdn.simpleicons.org/wordpress/21759B', color: '#21759B' },
  { name: 'Git / GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff', color: '#ffffff' },
  { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E', color: '#F24E1E' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', color: '#007ACC' },
];

const softSkills = [
  'Problem Solver',
  'Team Player',
  'Detail-Oriented',
  'Emotionally Resilient',
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    const reveals = sectionRef.current.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={sectionRef}>
      <div className="skills-section-inner">
        {/* ── Header ── */}
        <div className="certs-wrap" style={{ width: '100%' }}>
          <p className="sec-label reveal">Capabilities</p>
          <h3 className="reveal d1" style={{ fontSize: '1.8rem', marginBottom: '44px' }}>Skills &amp; Tools</h3>
        </div>

        {/* ── Black Hole ── */}
        <div className="skills-blackhole-area reveal d1">
          <BlackHole />
        </div>

        {/* ── All Skills Badge Grid ── */}
        <div className="skills-all-grid reveal d2">
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '24px' }}>
            <h3 className="skills-heading-glow" style={{ fontSize: '4rem', margin: 0, marginTop: '-70px' }}>
              <span className="skills-gradient-text">GO BEYOND</span>
            </h3>
          </div>
          {allSkills.map((skill) => (
            <div
              key={skill.name}
              className="skill-badge"
              style={{
                borderColor: `${skill.color}22`,
              }}
            >
              <span className="skill-badge-icon">
                <img src={skill.icon} alt="" aria-hidden="true" loading="lazy" />
              </span>
              {skill.name}
            </div>
          ))}
        </div>

        {/* ── Category Cards ── */}
        <div className="skills-categories">
          {/* Frontend */}
          <div className="skills-category-card reveal">
            <StarBorder color="cyan" speed="5s" thickness={1}>
              <div className="category-title">Frontend</div>
              <div className="category-badges">
                {frontendSkills.map((skill) => (
                  <div key={skill.name} className="category-badge">
                    <span className="category-badge-icon">
                      <img src={skill.icon} alt="" aria-hidden="true" loading="lazy" />
                    </span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </StarBorder>
          </div>

          {/* Backend & Databases */}
          <div className="skills-category-card reveal d1">
            <StarBorder color="magenta" speed="5s" thickness={1}>
              <div className="category-title">Backend &amp; Databases</div>
              <div className="category-badges">
                {backendSkills.map((skill) => (
                  <div key={skill.name} className="category-badge">
                    <span className="category-badge-icon">
                      <img src={skill.icon} alt="" aria-hidden="true" loading="lazy" />
                    </span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </StarBorder>
          </div>

          {/* Tools & Platforms */}
          <div className="skills-category-card reveal d2">
            <StarBorder color="#ff8a50" speed="5s" thickness={1}>
              <div className="category-title">Tools &amp; Platforms</div>
              <div className="category-badges">
                {toolsSkills.map((skill) => (
                  <div key={skill.name} className="category-badge">
                    <span className="category-badge-icon">
                      <img src={skill.icon} alt="" aria-hidden="true" loading="lazy" />
                    </span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </StarBorder>
          </div>
        </div>

        {/* ── Soft Skills ── */}
        <div className="soft-skills-card reveal d3">
          <StarBorder color="white" speed="8s" thickness={1}>
            <div className="category-title">Soft Skills</div>
            <div className="soft-skills-grid">
              {softSkills.map((skill) => (
                <div key={skill} className="soft-skill-item">
                  {skill}
                </div>
              ))}
            </div>
          </StarBorder>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

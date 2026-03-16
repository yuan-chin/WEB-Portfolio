'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('@/components/lanyard'), {
  ssr: false,
});

const CurvedLoop = dynamic(() => import('@/components/CurvedLoop'), {
  ssr: false,
});

import StarBorder from '@/components/StarBorder';
import ProfileCard from '@/components/ProfileCard';
import ThemeSwitch from '@/components/ThemeSwitch';
import SocialIcons from '@/components/SocialIcons';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import '@/components/DownloadButton.css';
import ImageMarquee from '@/components/ImageMarquee';
import LogoLoop from '@/components/LogoLoop';

const knownLogos = [
  { src: 'https://cdn.simpleicons.org/html5/E34F26', alt: 'HTML' },
  { src: 'https://cdn.simpleicons.org/javascript/F7DF1E', alt: 'JavaScript' },
  { src: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', alt: 'Vue.js' },
  { src: 'https://cdn.simpleicons.org/angular/DD0031', alt: 'Angular' },
  { src: 'https://cdn.simpleicons.org/flutter/02569B', alt: 'Flutter' },
  { src: 'https://cdn.simpleicons.org/php/777BB4', alt: 'PHP' },
  { src: 'https://cdn.simpleicons.org/mysql/4479A1', alt: 'MySQL' },
  { src: 'https://cdn.simpleicons.org/mongodb/47A248', alt: 'MongoDB' },
  { src: 'https://cdn.simpleicons.org/wordpress/21759B', alt: 'WordPress' },
  { src: 'https://cdn.simpleicons.org/github/ffffff', alt: 'GitHub' },
  { src: 'https://cdn.simpleicons.org/figma/F24E1E', alt: 'Figma' },
  { src: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', alt: 'VS Code' },
];

const SkillsSection = dynamic(() => import('@/components/SkillsSection'), {
  ssr: false,
});

export default function Portfolio() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(false);
    setFormError(false);

    const formData = new FormData(e.currentTarget);
    // User needs to replace this with their actual Web3Forms access key
    formData.append("access_key", "e8ca4000-1455-4cba-b3f4-c6f92a7ea47c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setFormSuccess(false), 5000);
      } else {
        setFormError(true);
        setTimeout(() => setFormError(false), 5000);
      }
    } catch (error) {
      setFormError(true);
      setTimeout(() => setFormError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    /* ── Theme ── */
    const applyTheme = (t: string) => {
      document.documentElement.setAttribute('data-theme', t);
      document.querySelectorAll('.theme-btn').forEach((b: Element) => {
        (b as HTMLElement).textContent = t === 'dark' ? '☀' : '◐';
        b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    };

    const toggleTheme = () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    };

    applyTheme(localStorage.getItem('theme') || 'light');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    (window as Window & typeof globalThis & { toggleTheme: () => void }).toggleTheme = toggleTheme;

    /* ── Scroll Progress ── */
    const prog = document.getElementById('prog');
    const onScroll = () => {
      if (!prog) return;
      const h = document.documentElement;
      prog.style.width = (window.scrollY / (h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Active Nav on Scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => navObserver.observe(s));

    /* ── Mobile Drawer ── */
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');

    const closeDrawer = () => {
      hamburger?.classList.remove('open');
      drawer?.classList.remove('open');
      document.body.style.overflow = '';
      hamburger?.setAttribute('aria-expanded', 'false');
    };

    const onHamburger = () => {
      const open = drawer?.classList.toggle('open');
      hamburger?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger?.setAttribute('aria-expanded', String(open));
    };

    hamburger?.addEventListener('click', onHamburger);
    drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    /* ── Reveal on Scroll ── */
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* ── Skill Bars ── */
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.width = el.dataset.w + '%';
          skillObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(b => skillObs.observe(b));

    /* ── Modals ── */
    const openModal = (id: string) => {
      const m = document.getElementById('modal-' + id);
      if (!m) return;
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
      const closeBtn = m.querySelector('.modal-close') as HTMLElement;
      if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
    };

    const closeModal = (id: string) => {
      const m = document.getElementById('modal-' + id);
      if (!m) return;
      m.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.modal-overlay').forEach(o => {
      o.addEventListener('click', e => {
        if (e.target === o) {
          o.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => {
          o.classList.remove('open');
          document.body.style.overflow = '';
        });
        closeDrawer();
      }
    };
    document.addEventListener('keydown', onKeydown);

    (window as Window & typeof globalThis & { openModal: (id: string) => void; closeModal: (id: string) => void }).openModal = openModal;
    (window as Window & typeof globalThis & { openModal: (id: string) => void; closeModal: (id: string) => void }).closeModal = closeModal;

    /* ── Contact Form ── */
    const form = document.getElementById('contact-form') as HTMLFormElement | null;
    if (form) {
      const showErr = (id: string, msg: string) => {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; (el as HTMLElement).style.display = 'block'; }
        const inp = document.getElementById(id.replace('-err', ''));
        if (inp) (inp as HTMLInputElement).style.borderColor = '#c0392b';
      };

      const clearErr = (input: HTMLInputElement | HTMLTextAreaElement) => {
        const err = document.getElementById(input.id + '-err');
        if (err) (err as HTMLElement).style.display = 'none';
        input.style.borderColor = '';
      };

      form.querySelectorAll('input, textarea').forEach(i => {
        i.addEventListener('input', () => clearErr(i as HTMLInputElement));
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        const n = document.getElementById('name') as HTMLInputElement;
        const em = document.getElementById('email') as HTMLInputElement;
        const msg = document.getElementById('message') as HTMLTextAreaElement;

        if (!n?.value.trim()) { showErr('name-err', 'Please enter your name.'); valid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em?.value || '')) { showErr('email-err', 'Please enter a valid email address.'); valid = false; }
        if ((msg?.value.trim().length || 0) < 10) { showErr('msg-err', 'Message must be at least 10 characters.'); valid = false; }

        if (valid) {
          const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          btn.textContent = 'Sending…';
          btn.disabled = true;
          setTimeout(() => {
            form.style.display = 'none';
            const success = document.getElementById('form-success');
            if (success) success.classList.add('show');
          }, 1200);
        }
      });
    }

    /* ── Typing Animation ── */
    const roles = ['Web Developer', 'UI / UX Designer'];
    const el = document.getElementById('typed-role');
    if (el) {
      const typeSpeed = 80;
      const deleteSpeed = 40;
      const pauseAfter = 2000;
      const pauseBefore = 500;
      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        if (!isDeleting) {
          charIndex++;
          el.textContent = current.substring(0, charIndex);
          if (charIndex === current.length) { isDeleting = true; setTimeout(tick, pauseAfter); return; }
          setTimeout(tick, typeSpeed);
        } else {
          charIndex--;
          el.textContent = current.substring(0, charIndex);
          if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(tick, pauseBefore); return; }
          setTimeout(tick, deleteSpeed);
        }
      };

      const heroRole = el.closest('.hero-role');
      if (heroRole) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { setTimeout(tick, 400); obs.unobserve(e.target); } });
        }, { threshold: 0.1 });
        obs.observe(heroRole);
      } else {
        tick();
      }
    }

    /* ── Featured card click handlers ── */
    document.querySelectorAll('.feat-card[data-modal]').forEach(card => {
      card.addEventListener('click', () => {
        const id = (card as HTMLElement).dataset.modal;
        if (id) {
          const target = document.getElementById('projects');
          target?.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => openModal(id), 500);
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeydown);
      hamburger?.removeEventListener('click', onHamburger);
      navObserver.disconnect();
      revealObs.disconnect();
      skillObs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div id="prog" role="progressbar" aria-label="Scroll progress"></div>

      {/* Navigation */}
      <nav role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            <img src="/assets/logo.png" alt="YC Logo" className="nav-logo-img" />
            YC
          </a>
          <ul className="nav-links" role="list">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#resume">Resume</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="/assets/resume.pdf" target="_blank" rel="noopener" className="nav-resume-btn">Resume ↗</a>
            <ThemeSwitch />
            <button className="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className="mobile-drawer" id="mobile-drawer" role="dialog" aria-label="Mobile navigation">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#resume">Resume</a>
        <a href="#contact">Contact</a>
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
          <ThemeSwitch />
        </div>
      </div>

      <main>
        {/* ══ § 1 — HOME ══ */}
        <section id="home" aria-label="Introduction">
          <div className="wrap">
            <div className="hero-container">
              {/* Left */}
              <div className="hero-left">
                <h1 className="hero-name reveal d1">
                  Yuan Carlo
                  <em>M. Chin</em>
                </h1>
                <p className="hero-role reveal d2">
                  <span id="typed-role"></span>
                  <span className="typed-cursor">|</span>
                </p>
                <p className="hero-tagline reveal d3">
                  I build clean, structured interfaces with thoughtful design — focused on creating smooth,
                  seamless experiences from start to finish.
                </p>
                <div className="hero-cta reveal d4">
                  <a href="#projects" className="btn btn-fill">View Projects</a>
                  <a href="#contact" className="btn btn-out">Hire Me</a>
                </div>
                <div className="hero-socials reveal d2" style={{ marginTop: '24px' }}>
                  <SocialIcons />
                </div>
                <div className="hero-stats reveal d4">
                  <div><span className="stat-n">3+</span><span className="stat-l">Years Studying</span></div>
                  <div><span className="stat-n">3</span><span className="stat-l">Live Project</span></div>
                  <div><span className="stat-n">12+</span><span className="stat-l">Technologies</span></div>
                </div>
              </div>

              {/* Right */}
              <div className="hero-right">
                <Lanyard position={[0, 0, 14]} gravity={[0, -40, 0]} fov={20} />
              </div>
            </div>

            {/* Featured Projects */}
            <CurvedLoop
              marqueeText="Featured Work ✦ Top Projects ✦ Selected Work ✦ Featured Work ✦ Top Projects ✦ Selected Work ✦"
              speed={2}
              curveAmount={10}
              direction="left"
              interactive
              className="curved-loop-text"
            />
            <div className="featured-projects reveal d4">
              <div className="featured-grid">
                <div className="feat-card" data-modal="galang">
                  <div className="feat-thumb">
                    <img src="/assets/galang-preview.png" alt="Galang Dental Center" loading="lazy" />
                  </div>
                  <div className="feat-info">
                    <h4>Galang Dental Center</h4>
                    <p>Professional dental clinic website with patient-friendly UX and mobile-first design.</p>
                    <span className="feat-link">View Details →</span>
                  </div>
                </div>
                <div className="feat-card" data-modal="koma">
                  <div className="feat-thumb">
                    <img src="/assets/koma-preview.png" alt="KOMA PH" loading="lazy" />
                  </div>
                  <div className="feat-info">
                    <h4>KOMA PH Order Management</h4>
                    <p>Full-stack MEVN app automating inventory and order workflows for a clothing brand.</p>
                    <span className="feat-link">View Details →</span>
                  </div>
                </div>
                <div className="feat-card" data-modal="spendwise">
                  <div className="feat-thumb">
                    <img src="/assets/spendwise-preview.png" alt="SpendWise Budget Tracker" loading="lazy" />
                  </div>
                  <div className="feat-info">
                    <h4>SpendWise Budget Tracker</h4>
                    <p>Angular web application to help students track expenses and visualize spending patterns.</p>
                    <span className="feat-link">View Details →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ § 2 — ABOUT ══ */}
        <section id="about" className="alt" aria-label="About">
          <div className="wrap">
            <p className="sec-label reveal">Background</p>
            <h2 className="reveal d1" style={{ marginBottom: '60px' }}>About Me</h2>
            <div className="about-grid">
              {/* Bio */}
              <div className="about-text">
                <div className="reveal">
                  <p>I&apos;m <strong>Yuan Carlo M. Chin</strong>, a 3rd-year BSIT student at Holy Angel University and a Dean&apos;s
                    Lister every semester, specializing in Web Development.</p>
                </div>

                <div className="reveal d1" style={{ marginTop: '16px' }}>
                  <p>I create clean and thoughtful interfaces, always considering the user experience from frontend to
                    backend. I&apos;m <strong>eager</strong> to learn, grow under experienced mentors, and keep improving my
                    skills.</p>
                </div>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginTop: '36px' }}>
                  <div className="reveal d2" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ marginBottom: '24px' }}>Currently, I&apos;m <strong>open to internship opportunities</strong> in web development, ready to contribute and gain
                      real-world experience.</p>
                    <div>
                      <a href="#contact" className="btn btn-fill">Get In Touch</a>
                    </div>
                  </div>
                  <div className="reveal d3" style={{ flexShrink: 0 }}>
                    <ProfileCard />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <p className="sec-label reveal">Education</p>
                <div className="reveal d1" style={{ marginBottom: '20px' }}>
                  <StarBorder color="cyan" speed="6s" thickness={1} style={{ display: 'block', width: '100%' }}>
                    <div className="edu-card" style={{ border: 'none', margin: 0 }}>
                      <div className="edu-school">Holy Angel University · Pampanga</div>
                      <div className="edu-deg">Bachelor of Science in Information Technology</div>
                      <div className="edu-yr">Web Development Track · 2023 — Present</div>
                      <div className="dean-badges">
                        <span className="dean-badge">1st Year</span>
                        <span className="dean-badge">2nd Year 1st Sem</span>
                        <span className="dean-badge">3rd Year 1st Sem</span>
                      </div>
                    </div>
                  </StarBorder>
                </div>
                <div className="reveal d2" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <StarBorder color="#ff8a50" speed="5s" thickness={1} style={{ display: 'block', width: '100%' }}>
                    <div style={{ padding: '18px', border: 'none', borderRadius: '4px', background: 'var(--card)' }}>
                      <div className="sec-label" style={{ marginBottom: '8px' }}>Design Philosophy</div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.72' }}>Interfaces should be invisible. When
                        design works, users don&apos;t notice it — they just accomplish what they came to do.</p>
                    </div>
                  </StarBorder>
                  <StarBorder color="rgba(255, 255, 255, 0.4)" speed="7s" thickness={1} style={{ display: 'block', width: '100%' }}>
                    <div style={{ padding: '18px', border: 'none', borderRadius: '4px', background: 'var(--card)' }}>
                      <div className="sec-label" style={{ marginBottom: '8px' }}>Development Standard</div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.72' }}>Code is written once and read many
                        times. I write for the developer who comes next, not just for the machine running it.</p>
                    </div>
                  </StarBorder>
                </div>
              </div>
            </div>

            {/* Skills — rendered as standalone dark section below */}

            {/* Certifications */}
            <div className="certs-wrap">
              <p className="sec-label reveal">Credentials</p>
              <h3 className="reveal d1" style={{ fontSize: '1.8rem', marginBottom: '44px' }}>Certifications</h3>
              <div className="soft-skills-card reveal d2">
                <StarBorder color="var(--text)" speed="8s" thickness={1}>
                  <div className="category-title">Certificates</div>
                  <div className="certs-grid" style={{ marginTop: '20px' }}>
                    {[
                      { title: 'Legacy Responsive Web Design', issuer: 'freeCodeCamp', file: 'Legacy Responsive Web Design.pdf', delay: '' },
                      { title: 'Introduction to PHP', issuer: 'SoloLearn', file: 'Introduction to PHP.pdf', delay: 'd1' },
                      { title: 'Design Thinking for Beginners', issuer: 'Great Learning', file: 'Design Thinking for Beginners.pdf', delay: 'd2' },
                      { title: 'Introduction to Graphic Design; Basics of UI/UX', issuer: 'Great Learning', file: 'Introduction to Graphic Design; Basics of UI UX.pdf', delay: '' },
                      { title: 'Website UI/UX Designing using ChatGPT', issuer: 'Great Learning', file: 'Website UI UX Designing using ChatGPT.pdf', delay: 'd1' },
                      { title: 'SEO I', issuer: 'HubSpot Academy', file: 'SEO I.pdf', delay: 'd2' },
                      { title: 'SEO II', issuer: 'HubSpot Academy', file: 'SEO II.pdf', delay: '' },
                      { title: 'Digital Advertising', issuer: 'HubSpot Academy', file: 'Digital Advertising.pdf', delay: 'd1' },
                      { title: 'Content Marketing', issuer: 'HubSpot Academy', file: 'Content Marketing.pdf', delay: 'd2' },
                    ].map(({ title, issuer, file, delay }) => (
                      <div className={`cert-card reveal ${delay}`} key={title}>
                        <div className="cert-icon"><img src="/assets/certificate-icon.gif" alt="Certificate" /></div>
                        <div className="cert-body">
                          <h4>{title}</h4>
                          <div className="cert-issuer">{issuer}</div>
                        </div>
                        <a href={`/assets/${file}`} target="_blank" rel="noopener noreferrer" className="cert-link" title="View Certificate">↗</a>
                      </div>
                    ))}
                  </div>
                </StarBorder>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SKILLS & TOOLS ══ */}
        <SkillsSection />

        {/* ══ § 3 — PROJECTS ══ */}
        <section id="projects" aria-label="Projects">
          <div className="wrap">
            <p className="sec-label reveal">Selected Work</p>
            <h2 className="reveal d1" style={{ marginBottom: '60px' }}>Projects</h2>
          </div>
          <div>
            <ScrollStack itemDistance={450} itemScale={0.04} itemStackDistance={35} baseScale={0.82} stackPosition="5%" scaleEndPosition="10%">
              {/* Project 1 */}
              <ScrollStackItem>
                <div className="stack-proj-thumb">
                  <img src="/assets/galang-preview.png" alt="Galang Dental Center preview" loading="lazy" />
                </div>
                <div className="stack-proj-body">
                  <h3>Galang Dental Center</h3>
                  <p>A professional dental clinic website — patient-friendly UX, clear service presentation, and clean mobile-first design.</p>
                  <div className="tags">
                    <span className="tag">WordPress</span>
                    <span className="tag">Figma</span>
                  </div>
                  <button className="arrow-link" onClick={() => (window as any).openModal('galang')} aria-label="View Galang Dental details">View Details</button>
                </div>
              </ScrollStackItem>

              {/* Project 2 */}
              <ScrollStackItem>
                <div className="stack-proj-thumb">
                  <img src="/assets/koma-preview.png" alt="KOMA PH preview" loading="lazy" />
                </div>
                <div className="stack-proj-body">
                  <h3>KOMA PH Inventory and Order Management</h3>
                  <p>Built a full-stack web app using MongoDB, Express, Vue, and Node.js to automate inventory and order workflows for a clothing brand.</p>
                  <div className="tags">
                    <span className="tag">Vue.js</span>
                    <span className="tag">Node.js</span>
                    <span className="tag">MongoDB</span>
                  </div>
                  <button className="arrow-link" onClick={() => (window as any).openModal('koma')} aria-label="View KOMA PH details">View Details</button>
                </div>
              </ScrollStackItem>

              {/* Project 3 */}
              <ScrollStackItem>
                <div className="stack-proj-thumb">
                  <img src="/assets/gyat-preview.png" alt="GYAT HUB Game Tracker preview" loading="lazy" />
                </div>
                <div className="stack-proj-body">
                  <h3>GYAT HUB Game Tracker</h3>
                  <p>A comprehensive platform for tracking game titles, built with PHP and MySQL.</p>
                  <div className="tags">
                    <span className="tag">PHP</span>
                    <span className="tag">MySQL</span>
                    <span className="tag">JavaScript</span>
                  </div>
                  <button className="arrow-link" onClick={() => (window as any).openModal('gyat')} aria-label="View GYAT HUB details">View Details</button>
                </div>
              </ScrollStackItem>

              {/* Project 4 */}
              <ScrollStackItem>
                <div className="stack-proj-thumb">
                  <img src="/assets/spendwise-preview.png" alt="SpendWise Budget Tracker preview" loading="lazy" />
                </div>
                <div className="stack-proj-body">
                  <h3>SpendWise - Student Budget and Allowance Tracker</h3>
                  <p>Built a modern web application using Angular standalone architecture to help students track expenses, manage allowances, and visualize spending patterns.</p>
                  <div className="tags">
                    <span className="tag">Angular</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">Chart.js</span>
                  </div>
                  <button className="arrow-link" onClick={() => (window as any).openModal('spendwise')} aria-label="View SpendWise details">View Details</button>
                </div>
              </ScrollStackItem>

              {/* Project 5 */}
              <ScrollStackItem>
                <div className="stack-proj-thumb">
                  <img src="/assets/bayanihan-preview.png" alt="Bayanihan Board preview" loading="lazy" />
                </div>
                <div className="stack-proj-body">
                  <h3>Bayanihan Board</h3>
                  <p>A community-driven neighborhood platform — intuitive UI/UX, real-time post filtering, and gamified user engagement.</p>
                  <div className="tags">
                    <span className="tag">Angular</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">CSS</span>
                  </div>
                  <button className="arrow-link" onClick={() => (window as any).openModal('bayanihan')} aria-label="View Bayanihan Board details">View Details</button>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>
          <div style={{ marginTop: '80px', paddingBottom: '40px' }}>
            <p className="sec-label reveal d1" style={{ justifyContent: 'center', marginBottom: '40px' }}>Technologies Used</p>
            <div className="reveal d2" style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
              <LogoLoop
                logos={knownLogos}
                speed={40}
                direction="left"
                logoHeight={40}
                gap={50}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                ariaLabel="Known Technologies"
              />
            </div>
          </div>
        </section>

        {/* ══ § 4 — RESUME ══ */}
        <section id="resume" className="alt" aria-label="Resume">
          <div className="wrap">
            <p className="sec-label reveal">Qualifications</p>
            <h2 className="reveal d1" style={{ marginBottom: '60px' }}>Resume</h2>
            <div className="resume-container reveal d2">
              <div className="resume-preview">
                <img src="/assets/resume.png" alt="Yuan Carlo M. Chin Resume" className="resume-img" />
              </div>
              <div className="resume-info">
                <div className="resume-section">
                  <h3 className="resume-section-title">Professional Summary</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.85' }}>
                    3rd-year BSIT student at Holy Angel University specializing in web development. I build clean, user-focused web applications and am currently seeking a 2026 web development internship.
                  </p>
                </div>
                <div className="resume-section">
                  <h3 className="resume-section-title">Career Objective</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.85' }}>
                    To grow as a full-stack developer while contributing to real-world projects and learning from experienced teams.
                  </p>
                </div>
                <div className="download-btn-wrap">
                  <a href="/assets/resume.pdf" download className="dl-button">
                    <span className="dl-button__text">Download Resume</span>
                    <span className="dl-button__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" className="dl-svg">
                        <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z" />
                        <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z" />
                        <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* ══ IMAGE MARQUEE (Inside Resume) ══ */}
            <div aria-label="Gallery" style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ImageMarquee
                  images={[
                    { src: '/assets/marquee-1.png', alt: 'Gallery image 1' },
                    { src: '/assets/marquee-2.png', alt: 'Gallery image 2' },
                    { src: '/assets/marquee-3.png', alt: 'Gallery image 3' },
                    { src: '/assets/marquee-4.png', alt: 'Gallery image 4' },
                    { src: '/assets/marquee-5.png', alt: 'Gallery image 5' },
                    { src: '/assets/marquee-6.png', alt: 'Gallery image 6' },
                    { src: '/assets/marquee-7.png', alt: 'Gallery image 7' },
                  ]}
                  speed={35}
                  imageHeight={200}
                />
                <ImageMarquee
                  images={[
                    { src: '/assets/marquee-1.png', alt: 'Gallery image 1' },
                    { src: '/assets/marquee-2.png', alt: 'Gallery image 2' },
                    { src: '/assets/marquee-3.png', alt: 'Gallery image 3' },
                    { src: '/assets/marquee-4.png', alt: 'Gallery image 4' },
                    { src: '/assets/marquee-5.png', alt: 'Gallery image 5' },
                    { src: '/assets/marquee-6.png', alt: 'Gallery image 6' },
                    { src: '/assets/marquee-7.png', alt: 'Gallery image 7' },
                  ]}
                  speed={40}
                  direction="right"
                  imageHeight={200}
                />
              </div>
            </div>

          </div>
        </section>

        {/* ══ § 5 — CONTACT ══ */}
        <section id="contact" aria-label="Contact">
          <div className="wrap">
            <p className="sec-label reveal">Reach Out</p>
            <h2 className="reveal d1" style={{ marginBottom: '60px' }}>Contact</h2>
            <p className="reveal d2" style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '12px', marginBottom: '60px', maxWidth: '520px', lineHeight: '1.8' }}>
              I&apos;m available for internship opportunities. Whether you have a role, a project, or just a question — I&apos;d be glad to hear from you.
            </p>
            <div className="contact-grid">
              {/* Contact details */}
              <div>
                <div className="c-detail reveal">
                  <a href="mailto:chinyuan469@gmail.com">
                    <div className="c-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                      </svg>
                    </div>
                  </a>
                  <div><div className="c-lbl">Email</div><div className="c-val"><a href="mailto:chinyuan469@gmail.com">chinyuan469@gmail.com</a></div></div>
                </div>
                <div className="c-detail reveal d1">
                  <a href="tel:09951294090">
                    <div className="c-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                      </svg>
                    </div>
                  </a>
                  <div><div className="c-lbl">Phone</div><div className="c-val">09951294090</div></div>
                </div>
                <div className="c-detail reveal d1">
                  <div className="c-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                    </svg>
                  </div>
                  <div><div className="c-lbl">Location</div><div className="c-val">Pampanga, Philippines</div></div>
                </div>
                <div className="c-detail reveal d2">
                  <a href="https://github.com/yuan-chin" target="_blank" rel="noopener">
                    <div className="c-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                      </svg>
                    </div>
                  </a>
                  <div><div className="c-lbl">GitHub</div><div className="c-val"><a href="https://github.com/yuan-chin" target="_blank" rel="noopener">github.com/yuancarlomchin</a></div></div>
                </div>
                <div className="c-detail reveal d2">
                  <a href="https://www.linkedin.com/in/yuanchin/" target="_blank" rel="noopener">
                    <div className="c-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                      </svg>
                    </div>
                  </a>
                  <div><div className="c-lbl">LinkedIn</div><div className="c-val"><a href="https://www.linkedin.com/in/yuanchin/" target="_blank" rel="noopener">linkedin.com/in/yuan-carlo-chin</a></div></div>
                </div>
                <div className="avail-box reveal d3">
                  <div className="avail-label"><span className="avail-dot"></span>Availability</div>
                  <p>Currently open to internship positions in 2026. Web development, frontend.</p>
                </div>
              </div>

              {/* Contact form */}
              <div className="reveal d2">
                <p className="sec-label" style={{ marginBottom: '24px' }}>Send a Message</p>
                <form id="contact-form" onSubmit={handleContactSubmit} aria-label="Contact form" style={{ position: 'relative' }}>
                  <div className="fg">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" autoComplete="name" required />
                  </div>
                  <div className="fg">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="your@email.com" autoComplete="email" required />
                  </div>
                  <div className="fg">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
                  </div>
                  <div className="fg">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={5} placeholder="Tell me about your opportunity or project…" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-fill" style={{ alignSelf: 'flex-start' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {formSuccess && (
                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderLeft: '3px solid #4ade80', fontSize: '0.9rem' }}>
                      ✓ Message sent successfully! I'll get back to you soon.
                    </div>
                  )}
                  {formError && (
                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderLeft: '3px solid #f87171', fontSize: '0.9rem' }}>
                      ⚠ Oops! Something went wrong. Please try again or email me directly.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo">
        <div className="foot-inner">
          <div className="foot-brand">
            <span className="foot-name">Yuan Carlo M. Chin</span>
            <span className="foot-copy">© 2026 · Go Beyond</span>
          </div>
          <div className="foot-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#resume">Resume</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="foot-contact">
            <a href="mailto:chinyuan469@gmail.com" className="foot-citem">
              <span className="foot-cicon">✉</span>chinyuan469@gmail.com
            </a>
            <span className="foot-citem">
              <span className="foot-cicon">⌂</span>Pampanga, Philippines
            </span>
            <a href="https://github.com/yuan-chin" target="_blank" rel="noopener" className="foot-citem">
              <span className="foot-cicon">↗</span>github.com/yuancarlomchin
            </a>
            <a href="https://www.linkedin.com/in/yuanchin/" target="_blank" rel="noopener" className="foot-citem">
              <span className="foot-cicon foot-cicon-in">in</span>linkedin.com/in/yuan-carlo-chin
            </a>
          </div>
        </div>
      </footer>

      {/* ══ PROJECT MODALS ══ */}

      {/* Modal: Galang Dental Center */}
      <div className="modal-overlay" id="modal-galang" role="dialog" aria-modal="true" aria-labelledby="mg-title">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal('galang')} aria-label="Close modal">✕</button>
          <div className="modal-head">
            <span className="badge badge-done">Completed</span>
            <h2 id="mg-title">Galang Dental Center</h2>
            <div className="modal-meta">
              <span>2024</span>
              <span>WordPress · Figma</span>
              <span>WEB DESIGNER</span>
              <span>SEO OPTIMIZER</span>
            </div>
          </div>
          <div className="modal-body">
            <p>Designed and built a professional dental clinic website to establish an online presence, improve patient accessibility, and clearly present services.</p>
            <div className="feat-title">Key Contributions</div>
            <ul className="feat-list">
              <li>Designed the full UI/UX in Figma, creating a patient-friendly layout with clear service presentation and mobile-first responsiveness.</li>
              <li>Built the website on WordPress with custom styling, ensuring a clean and professional look that reflects the clinic&apos;s quality of care.</li>
            </ul>
            <div className="modal-imgs">
              <div className="img-ph">
                <img src="/assets/galang-preview.png" alt="Galang Dental Center homepage" loading="lazy" />
              </div>
            </div>
            <div className="tags" style={{ marginBottom: '28px' }}>
              <span className="tag">WordPress</span>
              <span className="tag">Figma</span>
            </div>
            <a href="https://galangdentalcenter.com" target="_blank" rel="noopener" className="btn btn-fill">Visit Website</a>
          </div>
        </div>
      </div>

      {/* Modal: KOMA PH */}
      <div className="modal-overlay" id="modal-koma" role="dialog" aria-modal="true" aria-labelledby="mkoma-title">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal('koma')} aria-label="Close modal">✕</button>
          <div className="modal-head">
            <span className="badge badge-done">Completed</span>
            <h2 id="mkoma-title">KOMA PH Inventory and Order Management System</h2>
            <div className="modal-meta">
              <span>2024</span>
              <span>Vue.js · Node.js · MongoDB · Express</span>
              <span>Full-Stack Developer</span>
            </div>
          </div>
          <div className="modal-body">
            <p>Built a full-stack web app using MongoDB, Express, Vue, and Node.js to automate inventory and order workflows for a clothing brand.</p>
            <div className="feat-title">Key Contributions</div>
            <ul className="feat-list">
              <li>Developed a responsive Vue.js frontend connected via Fetch API for instant stock updates and seamless order placement.</li>
              <li>Implemented secure authentication and bcryptjs encryption, ensuring full compliance with the Data Privacy Act of 2012.</li>
            </ul>
            <div className="modal-imgs">
              <div className="img-ph">
                <img src="/assets/koma-preview.png" alt="KOMA PH homepage" loading="lazy" />
              </div>
            </div>
            <div className="tags" style={{ marginBottom: '28px' }}>
              <span className="tag">Vue.js</span>
              <span className="tag">Node.js</span>
              <span className="tag">MongoDB</span>
              <span className="tag">Express</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://koma-ph.netlify.app/" target="_blank" rel="noopener" className="btn btn-fill">Visit Website</a>
              <a href="https://github.com/yuan-chin/6WCSERVER-WD-303-KOMA-PH-Inventory-and-Order-Management-System" target="_blank" rel="noopener" className="btn btn-out">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: GYAT HUB */}
      <div className="modal-overlay" id="modal-gyat" role="dialog" aria-modal="true" aria-labelledby="mgyat-title">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal('gyat')} aria-label="Close modal">✕</button>
          <div className="modal-head">
            <span className="badge badge-done">Completed</span>
            <h2 id="mgyat-title">GYAT HUB Game Tracker</h2>
            <div className="modal-meta">
              <span>2024</span>
              <span>PHP · MySQL · HTML · CSS · JavaScript</span>
              <span>Full-Stack Developer</span>
            </div>
          </div>
          <div className="modal-body">
            <p>This program is programmed by using PHP, MySQL, HTML, CSS, and JavaScript. The rationale of creating this system is that it will assist GYAT HUB in providing gamers with a comprehensive, user-friendly, and efficient platform for tracking game titles.</p>
            <div className="feat-title">Key Contributions</div>
            <ul className="feat-list">
              <li>Implemented a streamlined platform to minimize manual processes and enhance user satisfaction.</li>
              <li>Designed a user-friendly interface for browsing and tracking game titles with efficient search and filtering capabilities.</li>
              <li>Built a MySQL-backed database for managing game inventory, user accounts, and data processing.</li>
              <li>Demonstrated how web technologies can be used in addressing real-life web management challenges.</li>
            </ul>
            <div className="modal-imgs">
              <div className="img-ph">
                <img src="/assets/gyat-preview.png" alt="GYAT HUB Game Tracker homepage" loading="lazy" />
              </div>
            </div>
            <div className="tags" style={{ marginBottom: '28px' }}>
              <span className="tag">PHP</span>
              <span className="tag">MySQL</span>
              <span className="tag">HTML</span>
              <span className="tag">CSS</span>
              <span className="tag">JavaScript</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="http://mygyatstore.onlinewebshop.net/index.php" target="_blank" rel="noopener" className="btn btn-fill">Visit Website</a>
              <a href="https://github.com/yuan-chin/GYAT-Hub" target="_blank" rel="noopener" className="btn btn-out">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: SpendWise */}
      <div className="modal-overlay" id="modal-spendwise" role="dialog" aria-modal="true" aria-labelledby="mspendwise-title">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal('spendwise')} aria-label="Close modal">✕</button>
          <div className="modal-head">
            <span className="badge badge-done">Completed</span>
            <h2 id="mspendwise-title">SpendWise - Student Budget and Allowance Tracker</h2>
            <div className="modal-meta">
              <span>2025</span>
              <span>Angular · TypeScript · Chart.js · Firebase Hosting</span>
              <span>Front-End Developer</span>
            </div>
          </div>
          <div className="modal-body">
            <p>Built a modern web application using Angular standalone architecture to help students track expenses, manage allowances, and visualize spending patterns.</p>
            <div className="feat-title">Key Contributions</div>
            <ul className="feat-list">
              <li>Developed a responsive Angular SPA with glassmorphism UI design, featuring real-time expense tracking across 5 categories (Food, Transportation, School, Hostel, Leisure).</li>
              <li>Implemented interactive data visualizations using Chart.js for pie charts and bar graphs, enabling students to analyze spending habits and budget allocation.</li>
              <li>Integrated localStorage for client-side data persistence and secure authentication system, deployed on Firebase Hosting for global accessibility.</li>
            </ul>
            <div className="modal-imgs">
              <div className="img-ph">
                <img src="/assets/spendwise-preview.png" alt="SpendWise dashboard screenshot" loading="lazy" />
              </div>
            </div>
            <div className="tags" style={{ marginBottom: '28px' }}>
              <span className="tag">Angular</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Chart.js</span>
              <span className="tag">Firebase</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://student-budget-tracker-2a2bd.web.app" target="_blank" rel="noopener" className="btn btn-fill">Visit Website</a>
              <a href="https://github.com/yuan-chin/student-budget-and-allowance-tracker" target="_blank" rel="noopener" className="btn btn-out">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Bayanihan Board */}
      <div className="modal-overlay" id="modal-bayanihan" role="dialog" aria-modal="true" aria-labelledby="mbayanihan-title">
        <div className="modal">
          <button className="modal-close" onClick={() => (window as any).closeModal('bayanihan')} aria-label="Close modal">✕</button>
          <div className="modal-head">
            <span className="badge badge-done">Completed</span>
            <h2 id="mbayanihan-title">Bayanihan Board</h2>
            <div className="modal-meta">
              <span>2024</span>
              <span>Angular · TypeScript · CSS</span>
              <span>FRONTEND DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
            </div>
          </div>
          <div className="modal-body">
            <p>Designed and developed a responsive community web platform that allows barangay members to request help or offer services to their neighbors, fostering the spirit of bayanihan.</p>
            <div className="feat-title">Key Contributions</div>
            <ul className="feat-list">
              <li>Designed a vibrant, barangay-themed UI/UX from scratch, featuring glassmorphism elements, custom animations, and full multi-language support (English/Filipino).</li>
              <li>Built the platform natively in Angular 17+ with Signals for efficient state management, implementing full CRUD capabilities for posts, likes, and nested comments.</li>
              <li>Engineered an interactive user dashboard with dynamic statistics tracking, category filtration, and a built-in gamification system that awards badges based on community engagement.</li>
              <li>Implemented a persistent, mobile-first design system with a seamless Light/Dark mode toggle for optimal accessibility.</li>
            </ul>
            <div className="modal-imgs">
              <div className="img-ph">
                <img src="/assets/bayanihan-preview.png" alt="Bayanihan Board homepage" loading="lazy" />
              </div>
            </div>
            <div className="tags" style={{ marginBottom: '28px' }}>
              <span className="tag">Angular</span>
              <span className="tag">TypeScript</span>
              <span className="tag">CSS</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://bayanihanboard.netlify.app/" target="_blank" rel="noopener" className="btn btn-fill">Visit Website</a>
              <a href="https://github.com/yuan-chin/BAYANIHAN-BOARD" target="_blank" rel="noopener" className="btn btn-out">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, PlatformLocation } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { PersonalInfo, Stat, SkillDomain, TimelineItem, Achievement, EducationItem, Certification } from '../../models/portfolio.models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, ScrollRevealDirective],
  template: `
    <!-- ═══════════ 1. HERO ═══════════
         NOTE: No pt-32 here — app.component.ts already adds padding-top: 72px (navbar height).
         We add extra padding just for visual breathing room on the hero. -->
    <section class="hero-section relative min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 dot-grid opacity-30"></div>
      <div class="absolute inset-0 hero-gradient"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <div class="section-container relative z-10 py-20">
        <div class="max-w-4xl">

          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-8 hero-item">
            <span class="glow-dot"></span>
            {{ personal()?.openTo || 'Open to opportunities' }}
          </div>

          <h1 class="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 leading-none hero-item" style="animation-delay:0.1s">
            {{ personal()?.name || 'YOUR NAME' }}<span class="gradient-text">.</span>
          </h1>

          <div class="text-lg sm:text-2xl lg:text-3xl text-slate-400 font-display mb-6 hero-item" style="animation-delay:0.2s">
            <span class="text-cyan-400">&#123; </span>
            <span>{{ currentTitle() }}</span>
            <span class="text-blue-400 blink-cursor">|</span>
            <span class="text-cyan-400"> &#125;</span>
          </div>

          <p class="text-lg text-slate-400 max-w-2xl mb-10 font-body leading-relaxed hero-item" style="animation-delay:0.3s">
            {{ personal()?.tagline || 'Building intelligent systems at scale.' }}
          </p>

          <div class="flex flex-wrap gap-4 mb-16 hero-item" style="animation-delay:0.4s">
            <a routerLink="/projects" class="btn-primary text-base py-3 px-7">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              View Projects
            </a>
            <a routerLink="/experience" class="btn-ghost text-base py-3 px-7">Browse Experience</a>
            <a [href]="personal()?.github || '#'" target="_blank" class="btn-ghost text-base py-3 px-7">GitHub</a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 hero-item" style="animation-delay:0.5s">
            <div *ngFor="let stat of stats()" class="glass-card p-4 text-center">
              <div class="text-2xl mb-1">{{ stat.icon }}</div>
              <div class="text-2xl font-display font-bold gradient-text">{{ stat.value }}</div>
              <div class="text-xs text-slate-500 font-mono mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll hint — fades out once user scrolls down -->
      <div
        class="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs font-mono"
        [class.scroll-hint-hidden]="hasScrolled()">
        <span>scroll</span>
        <svg class="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- ═══════════ 2. ABOUT ═══════════ -->
    <section class="section-padding" id="about">
      <div class="section-container">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div appScrollReveal>
            <p class="section-label mb-4">About Me</p>
            <h2 class="font-display text-4xl text-white mb-6">
              Engineer by craft,<br>
              <span class="gradient-text">Researcher by curiosity.</span>
            </h2>
            <p class="text-slate-400 font-body leading-relaxed text-lg mb-6">
              {{ personal()?.about || 'PLACEHOLDER — replace with your bio in data.json' }}
            </p>
            <div class="flex gap-4">
              <a [href]="personal()?.email ? 'mailto:' + personal()?.email : '#'" class="btn-ghost text-sm">Get in touch</a>
              <a [href]="personal()?.linkedin || '#'" target="_blank" class="btn-ghost text-sm">LinkedIn</a>
            </div>
          </div>

          <div appScrollReveal [delay]="150">
            <div class="photo-card relative">
              <!-- Placeholder always sits behind the photo, so a slow/failed load never leaves an empty frame -->
              <div class="photo-placeholder" [class.photo-placeholder-hidden]="photoLoaded()">
                <div class="placeholder-initials">SR</div>
                <p class="text-slate-500 text-xs font-mono text-center mt-3" *ngIf="photoFailed()">
                  // Add profile.jpg to<br>src/assets/images/
                </p>
              </div>

              <!-- Photo: path comes from data.json (relative, so it works under /Portfolio/).
                   On error it retries once with a cache-buster before giving up. -->
              <img *ngIf="photoSrc() && !photoFailed()"
                   [src]="photoSrc()"
                   alt="Shrayas Raghunathan"
                   class="photo-img"
                   [class.photo-img-visible]="photoLoaded()"
                   loading="eager"
                   decoding="async"
                   (load)="photoLoaded.set(true)"
                   (error)="onPhotoError()">
              <div class="photo-decoration-1"></div>
              <div class="photo-decoration-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 3. SKILLS ═══════════ -->
    <section class="section-padding bg-dark-800/30" id="skills">
      <div class="section-container">
        <div appScrollReveal class="text-center mb-14">
          <p class="section-label mb-4">Expertise</p>
          <h2 class="font-display text-4xl text-white">
            Domain <span class="gradient-text">Knowledge</span>
          </h2>
          <p class="text-slate-400 mt-4 max-w-xl mx-auto font-body">
            Across full-stack engineering, AI research, and infrastructure
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let skill of skills(); let i = index"
            appScrollReveal [delay]="i * 80"
            class="skill-card glass-card p-6 group cursor-default">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">{{ skill.icon }}</span>
              <h3 class="font-display text-lg text-white">{{ skill.domain }}</h3>
            </div>
            <div class="skill-bar mb-4" [style.background]="getSkillBarBg(skill.color)">
              <div class="skill-bar-fill" [style.background]="skill.color"></div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let item of skill.items"
                class="tag-chip"
                [style.border-color]="getSkillBorderColor(skill.color)">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 4. ACHIEVEMENTS (from data.json) ═══════════ -->
    <section class="section-padding" id="achievements">
      <div class="section-container">
        <div appScrollReveal class="text-center mb-10 sm:mb-14">
          <p class="section-label mb-4">Impact</p>
          <h2 class="font-display text-3xl sm:text-4xl text-white">
            Major <span class="gradient-text">Achievements</span>
          </h2>
          <p class="text-slate-400 mt-4 max-w-xl mx-auto font-body">
            Recognition, hackathons, research and leadership
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div *ngFor="let a of achievements(); let i = index"
            appScrollReveal [delay]="(i % 4) * 80"
            class="achievement-card glass-card p-5 sm:p-6 flex flex-col group">

            <div class="flex items-center justify-between mb-4">
              <span class="achievement-icon">{{ a.icon }}</span>
              <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                [ngClass]="getAchievementBadge(a.category)">{{ a.category }}</span>
            </div>

            <div class="achievement-highlight gradient-text font-display">{{ a.highlight }}</div>
            <h3 class="font-display text-base text-white mt-2 mb-2 leading-snug">{{ a.title }}</h3>
            <p class="text-slate-400 font-body text-sm leading-relaxed flex-1">{{ a.description }}</p>

            <div class="flex items-center justify-between mt-4 pt-3 border-t border-blue-900/20">
              <span class="text-xs font-mono text-slate-500">{{ a.year }}</span>
              <a *ngIf="a.link" [href]="a.link" target="_blank" rel="noopener"
                class="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">Read ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 4b. EDUCATION & LEARNING (from data.json) ═══════════ -->
    <section class="section-padding bg-dark-800/30" id="education">
      <div class="section-container">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16">

          <div appScrollReveal>
            <p class="section-label mb-4">Education</p>
            <h2 class="font-display text-3xl sm:text-4xl text-white mb-8">
              Where I <span class="gradient-text">studied</span>
            </h2>
            <div class="space-y-4">
              <div *ngFor="let e of education()" class="glass-card p-5">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <h3 class="font-display text-lg text-white">{{ e.institution }}</h3>
                  <span class="text-xs font-mono text-slate-500">{{ e.period }}</span>
                </div>
                <p class="text-slate-400 font-body text-sm mt-1">{{ e.degree }}</p>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="tag-chip text-[11px]">{{ e.score }}</span>
                  <span *ngIf="e.note" class="tag-chip active text-[11px]">{{ e.note }}</span>
                </div>
              </div>
            </div>
          </div>

          <div appScrollReveal [delay]="120">
            <p class="section-label mb-4">Continuous Learning</p>
            <h2 class="font-display text-3xl sm:text-4xl text-white mb-8">
              Professional <span class="gradient-text">development</span>
            </h2>
            <div class="space-y-3">
              <div *ngFor="let c of certifications()" class="glass-card p-4 flex items-start gap-3">
                <span class="cert-dot"></span>
                <div class="min-w-0">
                  <h4 class="font-display text-sm sm:text-base text-white leading-snug">{{ c.title }}</h4>
                  <p class="text-xs font-mono text-slate-500 mt-1">{{ c.provider }} · {{ c.topic }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════ 5. MINI TIMELINE ═══════════ -->
    <section class="section-padding" id="journey">
      <div class="section-container">
        <div appScrollReveal class="flex items-end justify-between mb-12">
          <div>
            <p class="section-label mb-4">Journey</p>
            <h2 class="font-display text-4xl text-white">Career <span class="gradient-text">Timeline</span></h2>
          </div>
          <a routerLink="/timeline" class="btn-ghost text-sm !hidden sm:!inline-flex">Full timeline</a>
        </div>

        <div class="relative">
          <div class="timeline-line"></div>
          <div *ngFor="let item of timelineTeaser(); let i = index"
            appScrollReveal [delay]="i * 100"
            class="timeline-item relative flex gap-4 mb-6 sm:mb-8 pl-10 sm:pl-12">
            <div class="timeline-dot" [ngClass]="'timeline-dot-' + item.type"></div>
            <div class="glass-card p-5 flex-1">
              <div class="flex flex-col-reverse items-start sm:flex-row sm:justify-between gap-2 sm:gap-4">
                <div>
                  <span class="section-label text-[11px]">{{ item.year }}</span>
                  <h4 class="font-display text-lg text-white mt-1">{{ item.title }}</h4>
                  <p class="text-slate-400 font-body text-sm mt-2 leading-relaxed">{{ item.description }}</p>
                </div>
                <span class="flex-shrink-0 text-xs font-mono px-2 py-1 rounded-full"
                  [ngClass]="getTimelineTypeBadge(item.type)">{{ item.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <div appScrollReveal class="text-center mt-8">
          <a routerLink="/timeline" class="btn-ghost">View full journey</a>
        </div>
      </div>
    </section>

    <!-- ═══════════ 6. CTA ═══════════ -->
    <section class="section-padding">
      <div class="section-container">
        <div appScrollReveal class="cta-banner glass-card p-6 sm:p-12 text-center relative overflow-hidden">
          <div class="cta-glow"></div>
          <p class="section-label mb-6">Let's build something</p>
          <h2 class="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-6 relative z-10">
            Open to <span class="gradient-text">new challenges.</span>
          </h2>
          <p class="text-slate-400 max-w-lg mx-auto mb-8 font-body relative z-10">
            Whether it's a complex distributed system, an RL research problem, or a team that needs technical leadership — let's talk.
          </p>
          <div class="flex flex-wrap gap-4 justify-center relative z-10">
            <a [href]="personal()?.email ? 'mailto:' + personal()?.email : '#'" class="btn-primary text-base py-3 px-8">Get in touch</a>
            <a [href]="personal()?.linkedin || '#'" target="_blank" class="btn-ghost text-base py-3 px-8">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── HERO ── */
    .hero-section {
      min-height: calc(100vh - var(--navbar-height));
      /* Compensate: app.component adds padding-top:72px, but hero needs to fill full viewport height
         including that space, so min-height accounts for it */
      min-height: calc(100vh - var(--navbar-height));
      min-height: calc(100svh - var(--navbar-height));   /* mobile browsers: ignore the collapsing URL bar */
    }

    .hero-gradient {
      background:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(29, 78, 216, 0.35), transparent),
        radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6, 182, 212, 0.1), transparent);
    }

    .orb {
      position: absolute; border-radius: 50%; filter: blur(80px);
      animation: orbFloat 6s ease-in-out infinite; pointer-events: none;
    }
    .orb-1 { width:500px; height:500px; background:rgba(29,78,216,0.15);  top:-100px;   right:-100px;  animation-delay:0s; }
    .orb-2 { width:300px; height:300px; background:rgba(6,182,212,0.1);   bottom:100px; left:-50px;    animation-delay:2s; }
    .orb-3 { width:200px; height:200px; background:rgba(59,130,246,0.12); top:40%;      right:25%;     animation-delay:4s; }

    @keyframes orbFloat {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-15px); }
    }

    .hero-item {
      opacity: 0;
      animation: fadeUp 0.7s ease forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .blink-cursor { animation: blink 1s step-end infinite; }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    /* Scroll hint — visible by default, fades out on scroll */
    .scroll-hint {
      transition: opacity 0.4s ease, transform 0.4s ease;
      opacity: 1;
    }
    .scroll-hint-hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
      pointer-events: none;
    }

    .float-emoji { animation: floatAnim 3s ease-in-out infinite; display: inline-block; }
    @keyframes floatAnim {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }

    /* ── ABOUT ── */
    .photo-card { aspect-ratio: 1; width: 100%; max-width: 400px; margin: 0 auto; position: relative; }

    .photo-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: 24px;
      border: 1px solid rgba(59,130,246,0.35);
      box-shadow: 0 0 40px rgba(59,130,246,0.2);
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .photo-img-visible { opacity: 1; }

    .photo-placeholder {
      position: absolute; inset: 0;
      background: rgba(10,22,40,0.8);
      border: 2px dashed rgba(59,130,246,0.3);
      border-radius: 24px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; padding: 24px;
      transition: opacity 0.4s ease;
    }
    .photo-placeholder-hidden { opacity: 0; pointer-events: none; }
    .placeholder-initials {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(3rem, 14vw, 5rem);
      background: linear-gradient(135deg, #3b82f6, #22d3ee);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* ── ACHIEVEMENT CARDS ── */
    .achievement-highlight { font-size: clamp(1.6rem, 6vw, 2rem); font-weight: 800; line-height: 1.1; }
    .cert-dot {
      flex-shrink: 0; width: 10px; height: 10px; margin-top: 6px; border-radius: 50%;
      background: #22d3ee; box-shadow: 0 0 10px rgba(34,211,238,0.6);
    }

    .photo-decoration-1 {
      position:absolute; top:-12px; right:-12px;
      width:80px; height:80px;
      border: 2px solid rgba(59,130,246,0.25); border-radius:12px;
    }
    .photo-decoration-2 {
      position:absolute; bottom:-12px; left:-12px;
      width:60px; height:60px;
      background: rgba(59,130,246,0.08); border-radius:8px;
    }

    /* ── SKILLS ── */
    .skill-bar { height:3px; border-radius:2px; overflow:hidden; }
    .skill-bar-fill { height:100%; width:100%; opacity:0.6; border-radius:2px; }
    .skill-card:hover .skill-bar-fill { opacity:1; }

    /* ── ACHIEVEMENTS ── */
    .achievement-icon { font-size:2.5rem; display:block; transition:transform 0.3s ease; }
    .achievement-card:hover .achievement-icon { transform:scale(1.15) rotate(-5deg); }

    /* ── TIMELINE ── */
    .timeline-line {
      position:absolute; left:20px; top:0; bottom:0; width:2px;
      background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.4), transparent);
    }
    .timeline-dot {
      position:absolute; left:12px; top:20px;
      width:16px; height:16px; border-radius:50%; border:2px solid currentColor;
    }
    .timeline-dot-achievement { color:#22d3ee; background:rgba(34,211,238,0.2); }
    .timeline-dot-career      { color:#3b82f6; background:rgba(59,130,246,0.2); }
    .timeline-dot-education   { color:#a78bfa; background:rgba(167,139,250,0.2); }

    /* ── CTA ── */
    .cta-banner { background:linear-gradient(135deg, rgba(10,22,40,0.9), rgba(15,32,64,0.9)); }
    .cta-glow {
      position:absolute; top:50%; left:50%;
      transform:translate(-50%,-50%);
      width:400px; height:200px;
      background:radial-gradient(ellipse, rgba(59,130,246,0.15), transparent 70%);
      pointer-events:none;
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  private titleTimer?: ReturnType<typeof setInterval>;
  private dataService = inject(DataService);
private platformLocation = inject(PlatformLocation);

  personal       = signal<PersonalInfo | null>(null);
  stats          = signal<Stat[]>([]);
  skills         = signal<SkillDomain[]>([]);
  timelineTeaser = signal<TimelineItem[]>([]);
  currentTitle   = signal('Full Stack Engineer');
  hasScrolled    = signal(false);
  achievements   = signal<Achievement[]>([]);
  education      = signal<EducationItem[]>([]);
  certifications = signal<Certification[]>([]);

  // ── profile photo state ──
  photoLoaded = signal(false);
  photoFailed = signal(false);
  private photoRetry = signal(0);
  private photoBase  = signal('');
  /** photo URL, with a cache-buster appended on retry */
  photoSrc = computed(() => {
    const base = this.photoBase();
    if (!base) return '';
    return this.photoRetry() > 0 ? `${base}?r=${this.photoRetry()}` : base;
  });

  private titles = [
    'Full Stack Engineer', 'AI / ML Researcher',
    'System Architect', 'DevOps Practitioner', 'Team Leader',
  ];
  private titleIndex = 0;

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      if (data.personal && data.personal.photo) {
        const baseHref = this.platformLocation.getBaseHrefFromDOM() || '/';
        const cleanBase = baseHref.endsWith('/') ? baseHref : baseHref + '/';

        // Only prepend if it hasn't already been prefixed
        if (!data.personal.photo.startsWith(cleanBase)) {
          const cleanPhoto = data.personal.photo.startsWith('/') ? data.personal.photo.slice(1) : data.personal.photo;
          data.personal.photo = cleanBase + cleanPhoto;
        }
      }
      this.personal.set(data.personal);
      this.photoBase.set(data.personal.photo || '');
      this.achievements.set(data.achievements ?? []);
      this.education.set(data.education ?? []);
      this.certifications.set(data.certifications ?? []);
      this.stats.set(data.stats);
      this.skills.set(data.skills);
      this.timelineTeaser.set(data.timeline.slice(0, 3));
    });

    this.titleTimer = setInterval(() => {
      this.titleIndex = (this.titleIndex + 1) % this.titles.length;
      this.currentTitle.set(this.titles[this.titleIndex]);
    }, 3000);
  }

  ngOnDestroy() {
    // Stop the rotating-title timer when leaving the page (previously leaked forever)
    if (this.titleTimer) clearInterval(this.titleTimer);
  }

  /** Hide scroll indicator once user scrolls at all */
  @HostListener('window:scroll')
  onScroll() {
    if (window.scrollY > 80) {
      this.hasScrolled.set(true);
    }
  }

  /** Retry the photo once (cache-busted) before showing the placeholder permanently */
  onPhotoError() {
    if (this.photoRetry() < 1) {
      this.photoRetry.set(this.photoRetry() + 1);
    } else {
      this.photoFailed.set(true);
    }
  }

  getAchievementBadge(category: string): string {
    const map: Record<string, string> = {
      recognition: 'bg-amber-500/20 text-amber-400',
      hackathon:   'bg-cyan-500/20 text-cyan-400',
      research:    'bg-purple-500/20 text-purple-400',
      leadership:  'bg-blue-500/20 text-blue-400',
      academic:    'bg-green-500/20 text-green-400',
    };
    return map[category] || 'bg-slate-700/50 text-slate-400';
  }

  getSkillBarBg(hex: string): string {
    return hex + '33';
  }

  getSkillBorderColor(hex: string): string {
    return hex + '40';
  }

  getTimelineTypeBadge(type: string): string {
    const map: Record<string, string> = {
      achievement: 'bg-cyan-900 text-cyan-400',
      career:      'bg-blue-900 text-blue-400',
      education:   'bg-purple-900 text-purple-400',
    };
    return map[type] || 'bg-slate-800 text-slate-400';
  }
}

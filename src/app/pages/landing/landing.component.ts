import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { PersonalInfo, Stat, SkillDomain, TimelineItem } from '../../models/portfolio.models';

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

          <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 leading-none hero-item" style="animation-delay:0.1s">
            {{ personal()?.name || 'YOUR NAME' }}<span class="gradient-text">.</span>
          </h1>

          <div class="text-xl sm:text-2xl lg:text-3xl text-slate-400 font-display mb-6 hero-item" style="animation-delay:0.2s">
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
        <div class="grid lg:grid-cols-2 gap-16 items-center">
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
              <div class="photo-placeholder">
                <div class="text-8xl mb-4 float-emoji">&#128104;&#8205;&#128187;</div>
                <p class="text-slate-500 text-sm font-mono text-center">
                  // REPLACE: Add profile.jpg to<br>src/assets/images/
                </p>
              </div>
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

    <!-- ═══════════ 4. ACHIEVEMENTS ═══════════ -->
    <section class="section-padding" id="achievements">
      <div class="section-container">
        <div appScrollReveal class="text-center mb-14">
          <p class="section-label mb-4">Impact</p>
          <h2 class="font-display text-4xl text-white">
            Major <span class="gradient-text">Achievements</span>
          </h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div appScrollReveal [delay]="0" class="achievement-card glass-card p-8 text-center group">
            <div class="achievement-icon">&#128640;</div>
            <h3 class="font-display text-xl text-white mt-4 mb-2">REPLACE WITH YOUR ACHIEVEMENT</h3>
            <p class="text-slate-400 font-body text-sm leading-relaxed">Brief description of the achievement, impact, and context. [REPLACE]</p>
          </div>
          <div appScrollReveal [delay]="100" class="achievement-card glass-card p-8 text-center group">
            <div class="achievement-icon">&#129504;</div>
            <h3 class="font-display text-xl text-white mt-4 mb-2">REPLACE WITH YOUR ACHIEVEMENT</h3>
            <p class="text-slate-400 font-body text-sm leading-relaxed">Brief description of the achievement, impact, and context. [REPLACE]</p>
          </div>
          <div appScrollReveal [delay]="200" class="achievement-card glass-card p-8 text-center group">
            <div class="achievement-icon">&#9889;</div>
            <h3 class="font-display text-xl text-white mt-4 mb-2">REPLACE WITH YOUR ACHIEVEMENT</h3>
            <p class="text-slate-400 font-body text-sm leading-relaxed">Brief description of the achievement, impact, and context. [REPLACE]</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 5. MINI TIMELINE ═══════════ -->
    <section class="section-padding bg-dark-800/30" id="journey">
      <div class="section-container">
        <div appScrollReveal class="flex items-end justify-between mb-12">
          <div>
            <p class="section-label mb-4">Journey</p>
            <h2 class="font-display text-4xl text-white">Career <span class="gradient-text">Timeline</span></h2>
          </div>
          <a routerLink="/timeline" class="btn-ghost text-sm hidden sm:flex">Full timeline</a>
        </div>

        <div class="relative">
          <div class="timeline-line"></div>
          <div *ngFor="let item of timelineTeaser(); let i = index"
            appScrollReveal [delay]="i * 100"
            class="timeline-item relative flex gap-8 mb-8 pl-12">
            <div class="timeline-dot" [ngClass]="'timeline-dot-' + item.type"></div>
            <div class="glass-card p-5 flex-1">
              <div class="flex items-start justify-between gap-4">
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
        <div appScrollReveal class="cta-banner glass-card p-12 text-center relative overflow-hidden">
          <div class="cta-glow"></div>
          <p class="section-label mb-6">Let's build something</p>
          <h2 class="font-display text-4xl md:text-5xl text-white mb-6 relative z-10">
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
      /* Compensate: app.component adds padding-top:72px, but hero needs to fill full viewport height
         including that space, so min-height accounts for it */
      min-height: calc(100vh - var(--navbar-height));
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
    .photo-card { aspect-ratio: 1; max-width: 400px; margin: 0 auto; }
    .photo-placeholder {
      width:100%; height:100%;
      background: rgba(10,22,40,0.8);
      border: 2px dashed rgba(59,130,246,0.3);
      border-radius: 24px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; padding: 40px;
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

  personal       = signal<PersonalInfo | null>(null);
  stats          = signal<Stat[]>([]);
  skills         = signal<SkillDomain[]>([]);
  timelineTeaser = signal<TimelineItem[]>([]);
  currentTitle   = signal('Full Stack Engineer');
  hasScrolled    = signal(false);  // controls scroll hint visibility

  private titles = [
    'Full Stack Engineer', 'AI / ML Researcher',
    'System Architect', 'DevOps Practitioner', 'Team Leader',
  ];
  private titleIndex = 0;

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.personal.set(data.personal);
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

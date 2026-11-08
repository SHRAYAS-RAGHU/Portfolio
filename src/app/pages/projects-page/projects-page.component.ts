/**
 * pages/projects-page/projects-page.component.ts
 *
 * Case study style project cards.
 * Each project shows: Problem → Approach → Outcome narrative.
 * Expandable cards reveal full detail.
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Project } from '../../models/portfolio.models';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <!-- Page header -->
    <div class="page-header-gradient">
      <div class="section-container pt-16 pb-12">
        <div appScrollReveal>
          <p class="section-label mb-4">Case Studies</p>
          <h1 class="font-display text-5xl lg:text-6xl text-white mb-4">
            Project <span class="gradient-text">Showcase</span>
          </h1>
          <p class="text-slate-400 font-body text-lg max-w-2xl">
            Deep dives into the problems I've solved — the thinking, the trade-offs, and the outcomes.
          </p>
        </div>
      </div>
    </div>

    <div class="section-container pb-20">
      <!-- Featured projects first, then the rest -->
      @if (featured().length > 0) {
        <div class="mb-12">
          <p class="section-label mb-6">Featured</p>
          <div class="grid md:grid-cols-2 gap-6">
            @for (project of featured(); track project.id; let i = $index) {
              <div appScrollReveal [delay]="i * 100">
                <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: project, big: true }">
                </ng-container>
              </div>
            }
          </div>
        </div>
      }

      @if (rest().length > 0) {
        <div>
          <p class="section-label mb-6">All Projects</p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of rest(); track project.id; let i = $index) {
              <div appScrollReveal [delay]="i * 80">
                <ng-container *ngTemplateOutlet="projectCard; context: { $implicit: project, big: false }">
                </ng-container>
              </div>
            }
          </div>
        </div>
      }

      <!-- Empty state if no projects added yet -->
      @if (projects().length === 0) {
        <div class="glass-card p-20 text-center">
          <div class="text-5xl mb-4">📦</div>
          <h3 class="font-display text-2xl text-white mb-3">
            Add your projects to data.json
          </h3>
          <p class="text-slate-500 font-body max-w-md mx-auto">
            Fill in the <code class="text-blue-400 font-mono text-sm">projects</code> array in
            <code class="text-blue-400 font-mono text-sm">src/assets/data/data.json</code>
            with your case studies.
          </p>
        </div>
      }
    </div>

    <!-- ── PROJECT CARD TEMPLATE ─────────────────────────────────── -->
    <ng-template #projectCard let-project let-big="big">
      <div
        class="project-card glass-card h-full flex flex-col cursor-pointer"
        (click)="toggleExpand(project.id)">

        <!-- Card top -->
        <div class="p-6 flex-1">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div>
              <span class="text-xs font-mono text-slate-500 mb-1 block">{{ project.year }}</span>
              <h3 class="font-display text-xl text-white group-hover:text-blue-400 transition-colors">
                {{ project.title }}
              </h3>
            </div>
            <svg
              class="w-5 h-5 text-slate-500 flex-shrink-0 mt-1 transition-transform duration-300"
              [class.rotate-180]="isExpanded(project.id)"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          <!-- Problem -->
          <div class="narrative-block mb-3">
            <span class="narrative-label problem">Problem</span>
            <p class="text-slate-400 font-body text-sm leading-relaxed mt-1">
              {{ project.problem }}
            </p>
          </div>

          <!-- Expandable: Approach + Outcome -->
          @if (isExpanded(project.id)) {
            <div class="expand-content">
              <div class="narrative-block mb-3">
                <span class="narrative-label approach">Approach</span>
                <p class="text-slate-400 font-body text-sm leading-relaxed mt-1">
                  {{ project.approach }}
                </p>
              </div>
              <div class="narrative-block">
                <span class="narrative-label outcome">Outcome</span>
                <p class="text-slate-400 font-body text-sm leading-relaxed mt-1">
                  {{ project.outcome }}
                </p>
              </div>
            </div>
          }
        </div>

        <!-- Card footer: tech stack + links -->
        <div class="px-6 pb-6 border-t border-blue-900/20 pt-4">
          <div class="flex flex-wrap gap-2 mb-4">
            @for (tech of project.stack; track tech) {
              <span class="tag-chip text-[11px] py-0.5 px-2">{{ tech }}</span>
            }
          </div>

          <div class="flex gap-3">
            @if (project.github) {
              <a [href]="project.github" target="_blank"
                class="text-xs text-slate-400 hover:text-blue-400 font-mono flex items-center gap-1 transition-colors"
                (click)="$event.stopPropagation()">
                ↗ GitHub
              </a>
            }
            @if (project.demo) {
              <a [href]="project.demo" target="_blank"
                class="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                (click)="$event.stopPropagation()">
                ↗ Live Demo
              </a>
            }
            @if (!project.github && !project.demo) {
              <span class="text-xs text-slate-600 font-mono">// internal project</span>
            }
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .page-header-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6, 182, 212, 0.15), transparent);
    }

    .project-card {
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .project-card:hover {
      border-color: rgba(59, 130, 246, 0.35);
    }

    /* Narrative label styles */
    .narrative-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .narrative-label.problem  { background: rgba(239,68,68,0.15); color: #f87171; }
    .narrative-label.approach { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .narrative-label.outcome  { background: rgba(34,211,238,0.15); color: #22d3ee; }

    .expand-content {
      animation: expandIn 0.3s ease forwards;
    }
    @keyframes expandIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ProjectsPageComponent implements OnInit {
  private dataService = inject(DataService);

  projects = signal<Project[]>([]);
  featured = signal<Project[]>([]);
  rest     = signal<Project[]>([]);

  // Track which cards are expanded (set of project IDs)
  private expandedIds = signal<Set<string>>(new Set());

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.projects.set(data.projects);
      this.featured.set(data.projects.filter(p => p.featured));
      this.rest.set(data.projects.filter(p => !p.featured));
    });
  }

  toggleExpand(id: string) {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }
}

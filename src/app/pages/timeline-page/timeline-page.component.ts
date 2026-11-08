/**
 * pages/timeline-page/timeline-page.component.ts
 * Full vertical career timeline with staggered scroll reveals.
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TimelineItem } from '../../models/portfolio.models';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <div class="page-header-gradient">
      <div class="section-container pt-16 pb-12">
        <div appScrollReveal>
          <p class="section-label mb-4">Career Journey</p>
          <h1 class="font-display text-5xl lg:text-6xl text-white mb-4">
            My <span class="gradient-text">Timeline</span>
          </h1>
          <p class="text-slate-400 font-body text-lg max-w-2xl">
            Key milestones, career transitions, and defining moments.
            <!-- PLACEHOLDER: Add your milestones in data.json -->
          </p>
        </div>
      </div>
    </div>

    <div class="section-container pb-20">
      @if (timeline().length === 0) {
        <div class="glass-card p-20 text-center">
          <div class="text-5xl mb-4">📅</div>
          <h3 class="font-display text-2xl text-white mb-3">Add your timeline</h3>
          <p class="text-slate-500 font-body max-w-md mx-auto">
            Fill in the <code class="text-blue-400 font-mono text-sm">timeline</code> array
            in <code class="text-blue-400 font-mono text-sm">src/assets/data/data.json</code>.
          </p>
        </div>
      }

      <!-- Timeline vertical layout -->
      <div class="relative max-w-3xl mx-auto">
        <!-- Central line -->
        <div class="timeline-center-line"></div>

        @for (item of timeline(); track item.title; let i = $index; let even = $even) {
          <div
            appScrollReveal [delay]="i * 100"
            class="timeline-entry"
            [class.left-entry]="even"
            [class.right-entry]="!even">

            <!-- Content -->
            <div class="timeline-content glass-card p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-mono px-2 py-0.5 rounded-full"
                  [class]="getTypeBadge(item.type)">
                  {{ item.type }}
                </span>
                <span class="text-blue-400 font-display font-bold text-lg">{{ item.year }}</span>
              </div>
              <h3 class="font-display text-xl text-white mb-2">{{ item.title }}</h3>
              <p class="text-slate-400 font-body text-sm leading-relaxed">{{ item.description }}</p>
            </div>

            <!-- Center dot -->
            <div class="timeline-center-dot" [class]="'dot-' + item.type"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59, 130, 246, 0.15), transparent);
    }

    .timeline-center-line {
      position: absolute;
      left: 50%;
      top: 0; bottom: 0;
      width: 2px;
      transform: translateX(-50%);
      background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.4) 10%, rgba(59,130,246,0.4) 90%, transparent);
    }

    .timeline-entry {
      position: relative;
      display: flex;
      margin-bottom: 48px;
    }

    .left-entry {
      justify-content: flex-end;
      padding-right: calc(50% + 32px);
    }
    .right-entry {
      justify-content: flex-start;
      padding-left: calc(50% + 32px);
    }

    .timeline-content {
      max-width: 400px;
      width: 100%;
    }

    .timeline-center-dot {
      position: absolute;
      left: 50%;
      top: 24px;
      width: 16px; height: 16px;
      border-radius: 50%;
      transform: translateX(-50%);
      border: 3px solid;
      z-index: 2;
    }
    .dot-achievement { border-color: #22d3ee; background: rgba(34,211,238,0.25); }
    .dot-career      { border-color: #3b82f6; background: rgba(59,130,246,0.25); }
    .dot-education   { border-color: #a78bfa; background: rgba(167,139,250,0.25); }

    /* Mobile: single column */
    @media (max-width: 768px) {
      .timeline-center-line { left: 20px; }
      .left-entry, .right-entry {
        padding-right: 0;
        padding-left: 52px;
        justify-content: flex-start;
      }
      .timeline-center-dot { left: 20px; }
    }
  `]
})
export class TimelinePageComponent implements OnInit {
  private dataService = inject(DataService);
  timeline = signal<TimelineItem[]>([]);

  ngOnInit() {
    this.dataService.getData().subscribe(data => this.timeline.set(data.timeline));
  }

  getTypeBadge(type: string): string {
    const map: Record<string, string> = {
      achievement: 'bg-cyan-500/20 text-cyan-400',
      career:      'bg-blue-500/20 text-blue-400',
      education:   'bg-purple-500/20 text-purple-400',
    };
    return map[type] || 'bg-slate-700/50 text-slate-400';
  }
}

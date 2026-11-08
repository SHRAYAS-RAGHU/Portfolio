/**
 * pages/research-page/research-page.component.ts
 * Research papers, experiments, and write-ups.
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Research } from '../../models/portfolio.models';

@Component({
  selector: 'app-research-page',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <div class="page-header-gradient">
      <div class="section-container pt-16 pb-12">
        <div appScrollReveal>
          <p class="section-label mb-4">Research & Experiments</p>
          <h1 class="font-display text-5xl lg:text-6xl text-white mb-4">
            Research <span class="gradient-text">Work</span>
          </h1>
          <p class="text-slate-400 font-body text-lg max-w-2xl">
            Experiments, papers, and informal write-ups from my explorations in deep learning and reinforcement learning.
          </p>
        </div>
      </div>
    </div>

    <div class="section-container pb-20">
      @if (research().length === 0) {
        <div class="glass-card p-20 text-center">
          <div class="text-5xl mb-4">🧪</div>
          <h3 class="font-display text-2xl text-white mb-3">Add your research</h3>
          <p class="text-slate-500 font-body max-w-md mx-auto">
            Fill in the <code class="text-blue-400 font-mono text-sm">research</code> array
            in <code class="text-blue-400 font-mono text-sm">src/assets/data/data.json</code>.
          </p>
        </div>
      }

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (item of research(); track item.id; let i = $index) {
          <div appScrollReveal [delay]="i * 80">
            <div class="research-card glass-card p-6 h-full flex flex-col group">

              <!-- Type badge + year -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-mono px-2 py-1 rounded-full"
                  [class]="getTypeBadge(item.type)">
                  {{ item.type }}
                </span>
                <span class="text-xs font-mono text-slate-600">{{ item.year }}</span>
              </div>

              <h3 class="font-display text-lg text-white mb-3 group-hover:text-blue-400 transition-colors flex-1">
                {{ item.title }}
              </h3>

              <p class="text-slate-400 font-body text-sm leading-relaxed mb-4">
                {{ item.summary }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                @for (tag of item.tags; track tag) {
                  <span class="tag-chip text-[11px] py-0.5 px-2">{{ tag }}</span>
                }
              </div>

              <!-- Link -->
              @if (item.link) {
                <a [href]="item.link" target="_blank"
                  class="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors mt-auto">
                  Read more ↗
                </a>
              } @else {
                <span class="text-xs font-mono text-slate-600 mt-auto">// internal research</span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.15), transparent);
    }
    .research-card { transition: border-color 0.2s ease; }
    .research-card:hover { border-color: rgba(139, 92, 246, 0.3); }
  `]
})
export class ResearchPageComponent implements OnInit {
  private dataService = inject(DataService);
  research = signal<Research[]>([]);

  ngOnInit() {
    this.dataService.getData().subscribe(data => this.research.set(data.research));
  }

  getTypeBadge(type: string): string {
    const map: Record<string, string> = {
      experiment: 'bg-cyan-500/20 text-cyan-400',
      paper:      'bg-purple-500/20 text-purple-400',
      writeup:    'bg-blue-500/20 text-blue-400',
    };
    return map[type] || 'bg-slate-700/50 text-slate-400';
  }
}

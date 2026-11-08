/**
 * pages/system-design-page/system-design-page.component.ts
 *
 * Showcases system design THINKING without exposing proprietary architecture.
 * No diagrams are shown (they are internal to the employer). Each entry
 * presents: context & constraints, then the key design decisions with reasoning.
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SystemDesign } from '../../models/portfolio.models';

@Component({
  selector: 'app-system-design-page',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <!-- Page header -->
    <div class="page-header-gradient">
      <div class="section-container pt-16 pb-8">
        <div appScrollReveal>
          <p class="section-label mb-4">Architecture</p>
          <h1 class="font-display text-5xl lg:text-6xl text-white mb-4">
            System <span class="gradient-text">Design</span>
          </h1>
          <p class="text-slate-400 font-body text-lg max-w-2xl">
            The reasoning behind the architecture: constraints, trade-offs and the decisions that shaped each system.
          </p>
        </div>

        <!-- Confidentiality note -->
        <div appScrollReveal [delay]="100" class="note-banner mt-8">
          <span class="note-icon">&#128274;</span>
          <p class="text-slate-400 font-body text-sm leading-relaxed">
            These systems were built for a financial institution, so architecture diagrams and
            internal details are intentionally omitted. I'm happy to walk through the designs in an interview.
          </p>
        </div>
      </div>
    </div>

    <div class="section-container pb-20">

      <!-- Empty state -->
      <div *ngIf="designs().length === 0" class="glass-card p-20 text-center">
        <div class="text-5xl mb-4">&#127959;</div>
        <h3 class="font-display text-2xl text-white mb-3">Add your system designs</h3>
        <p class="text-slate-500 font-body max-w-md mx-auto">
          Fill in the <code class="text-blue-400 font-mono text-sm">systemDesigns</code> array
          in <code class="text-blue-400 font-mono text-sm">src/assets/data/data.json</code>.
        </p>
      </div>

      <div class="space-y-10">
        <div *ngFor="let design of designs(); let i = index" appScrollReveal [delay]="i * 80">
          <div class="design-card glass-card p-5 sm:p-8">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-3">
              <span class="design-index">{{ i + 1 < 10 ? '0' + (i + 1) : i + 1 }}</span>
              <h2 class="font-display text-2xl text-white">{{ design.title }}</h2>
            </div>

            <!-- Context -->
            <div class="context-block mb-6">
              <span class="context-label">Context &amp; Constraints</span>
              <p class="text-slate-400 font-body text-base leading-relaxed mt-2 max-w-3xl">
                {{ design.context }}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-8">
              <span *ngFor="let tag of design.tags" class="tag-chip text-[11px]">{{ tag }}</span>
            </div>

            <!-- Decisions -->
            <p class="section-label text-[11px] mb-4">Key Decisions</p>
            <div class="grid lg:grid-cols-2 gap-4">
              <div *ngFor="let decision of design.decisions; let j = index" class="decision-card">
                <div class="flex items-start gap-3">
                  <span class="decision-number">{{ j + 1 }}</span>
                  <div>
                    <h4 class="font-display text-base text-white mb-2">{{ decision.question }}</h4>
                    <p class="text-slate-400 font-body text-sm leading-relaxed">{{ decision.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header-gradient {
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16, 185, 129, 0.12), transparent);
    }

    .note-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      max-width: 720px;
      padding: 14px 18px;
      background: rgba(59, 130, 246, 0.06);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
    }
    .note-icon { font-size: 1.1rem; line-height: 1.4; }

    .design-card { transition: border-color 0.2s ease, box-shadow 0.2s ease; }

    .design-index {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 4px 10px;
      border-radius: 8px;
    }

    .context-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(34, 211, 238, 0.12);
      color: #22d3ee;
    }

    .decision-card {
      padding: 18px;
      background: rgba(10, 22, 40, 0.6);
      border: 1px solid rgba(59, 130, 246, 0.1);
      border-radius: 12px;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .decision-card:hover {
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
    }

    .decision-number {
      flex-shrink: 0;
      width: 24px; height: 24px;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 600;
    }
  `]
})
export class SystemDesignPageComponent implements OnInit {
  private dataService = inject(DataService);
  designs = signal<SystemDesign[]>([]);

  ngOnInit() {
    this.dataService.getData().subscribe(data => this.designs.set(data.systemDesigns));
  }
}

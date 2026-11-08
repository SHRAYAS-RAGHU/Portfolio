/**
 * directives/scroll-reveal.directive.ts
 *
 * Adds the "revealed" class when the host enters the viewport.
 *
 * Reliability fixes:
 *  - Looks at ALL observer entries (entries.some) instead of only the first one. When a page is
 *    re-created after navigating back, the observer can deliver several entries in one batch and
 *    the old code could ignore the "intersecting" one, leaving the element invisible.
 *  - If the element is already on screen at init it is revealed immediately.
 *  - A safety timeout reveals the element after 2.5s if nothing fired (never stays hidden).
 *  - transition-delay is cleared after the reveal so hover effects stay snappy.
 *  - Respects prefers-reduced-motion.
 */
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appScrollReveal]', standalone: true })
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Optional stagger delay in ms */
  @Input() delay = 0;

  private observer?: IntersectionObserver;
  private cleanupTimer?: ReturnType<typeof setTimeout>;
  private safetyTimer?: ReturnType<typeof setTimeout>;
  private revealed = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      this.reveal();
      return;
    }

    if (this.delay > 0) node.style.transitionDelay = `${this.delay}ms`;

    this.observer = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) this.reveal(); },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(node);

    // Already visible when the page is created? Reveal on the next frame.
    requestAnimationFrame(() => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) this.reveal();
    });

    // Last-resort safety net so content can never stay invisible
    this.safetyTimer = setTimeout(() => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) this.reveal();
    }, 2500);
  }

  private reveal() {
    if (this.revealed) return;
    this.revealed = true;
    const node = this.el.nativeElement;
    node.classList.add('revealed');
    this.observer?.disconnect();
    this.cleanupTimer = setTimeout(() => (node.style.transitionDelay = ''), this.delay + 700);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.cleanupTimer) clearTimeout(this.cleanupTimer);
    if (this.safetyTimer) clearTimeout(this.safetyTimer);
  }
}

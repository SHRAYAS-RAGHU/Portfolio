/**
 * directives/scroll-reveal.directive.ts
 *
 * Adds the "revealed" class when the host enters the viewport (IntersectionObserver).
 * Fixes vs. previous version:
 *  - transition-delay is cleared after the reveal, so hover effects on cards are not laggy
 *  - respects "prefers-reduced-motion" (reveals immediately, no animation)
 *  - no observer is created if IntersectionObserver is unavailable
 */
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appScrollReveal]', standalone: true })
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Optional stagger delay in ms */
  @Input() delay = 0;

  private observer?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    node.classList.add('reveal');

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add('revealed');
      return;
    }

    if (this.delay > 0) {
      node.style.transitionDelay = `${this.delay}ms`;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add('revealed');
        this.observer?.disconnect();
        // Remove the stagger delay once the reveal has played, so hover transitions stay snappy
        this.timer = setTimeout(() => (node.style.transitionDelay = ''), this.delay + 700);
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.timer) clearTimeout(this.timer);
  }
}

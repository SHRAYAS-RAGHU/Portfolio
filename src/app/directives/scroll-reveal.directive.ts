/**
 * directives/scroll-reveal.directive.ts
 *
 * Watches when a host element enters the viewport using IntersectionObserver.
 * Adds the CSS class 'revealed' when visible, triggering the CSS transition
 * defined in styles.scss (.reveal → .revealed).
 *
 * Usage:
 *   <div appScrollReveal>...</div>
 *   <div appScrollReveal [delay]="200">...</div>  ← stagger with delay in ms
 */

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Optional delay in milliseconds before the reveal animation starts */
  @Input() delay: number = 0;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // Start in the hidden state (defined by .reveal class in styles.scss)
    this.el.nativeElement.classList.add('reveal');

    // Apply animation-delay if provided
    if (this.delay > 0) {
      this.el.nativeElement.style.transitionDelay = `${this.delay}ms`;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('revealed');
          // Once revealed, stop observing to save resources
          this.observer.disconnect();
        }
      },
      {
        threshold: 0.1,     // trigger when 10% of element is visible
        rootMargin: '0px 0px -40px 0px',  // slight bottom offset so reveal starts a bit early
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

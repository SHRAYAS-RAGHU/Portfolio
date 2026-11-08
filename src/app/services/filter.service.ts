/**
 * services/filter.service.ts
 *
 * Powers the multi-select tag filter on the Experience page.
 * Uses Angular 17's signal() + computed() for reactive, zero-boilerplate state.
 *
 * How it works:
 *  - selectedTags: the currently active tag filters (array of strings)
 *  - matchMode:    'any' = OR logic, 'all' = AND logic
 *  - searchQuery:  free text search against title, summary, and tags
 *  - filteredExperiences: computed result — auto-updates when any input signal changes
 */

import { Injectable, signal, computed } from '@angular/core';
import { Experience, FilterMode } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class FilterService {
  // ── Input signals (written by the filter UI) ──────────────────────────
  selectedTags  = signal<string[]>([]);
  matchMode     = signal<FilterMode>('any');
  searchQuery   = signal<string>('');

  // ── Source data (set once by the ExperiencePage on load) ─────────────
  private allExperiences = signal<Experience[]>([]);

  // ── Output: computed filtered list (read by the results component) ────
  filteredExperiences = computed(() => {
    const tags   = this.selectedTags();
    const mode   = this.matchMode();
    const query  = this.searchQuery().toLowerCase().trim();
    const all    = this.allExperiences();

    return all
      .filter(exp => {
        // ── Text search: matches title, summary, or any tag ──────────
        const matchesSearch =
          !query ||
          exp.title.toLowerCase().includes(query) ||
          exp.summary.toLowerCase().includes(query) ||
          exp.tags.some(t => t.toLowerCase().includes(query));

        // ── Tag filter: OR vs AND logic ───────────────────────────────
        const matchesTags =
          tags.length === 0 ||
          (mode === 'any'
            ? tags.some(t  => exp.tags.includes(t))   // at least one tag matches
            : tags.every(t => exp.tags.includes(t)));  // all selected tags must match

        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        // When tags are selected, bubble up items that match MORE tags
        if (tags.length === 0) return b.year - a.year;
        const aScore = tags.filter(t => a.tags.includes(t)).length;
        const bScore = tags.filter(t => b.tags.includes(t)).length;
        return bScore - aScore || b.year - a.year;
      });
  });

  // ── Result count ──────────────────────────────────────────────────────
  resultCount = computed(() => this.filteredExperiences().length);
  totalCount  = computed(() => this.allExperiences().length);

  // ── Mutators (called from UI) ─────────────────────────────────────────

  setAllExperiences(experiences: Experience[]) {
    this.allExperiences.set(experiences);
  }

  toggleTag(tag: string) {
    this.selectedTags.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setMatchMode(mode: FilterMode) {
    this.matchMode.set(mode);
  }

  clearAll() {
    this.selectedTags.set([]);
    this.searchQuery.set('');
    this.matchMode.set('any');
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }
}

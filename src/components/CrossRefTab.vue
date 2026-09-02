<script setup>
import { useAppStore } from '../stores/app';
import VerseAccordion from './VerseAccordion.vue';

const store = useAppStore();

function bulkSorted(v) {
  return (v.bulk_cross_references || []).slice().sort((a, b) => b.votes - a.votes);
}

function hasAny(v) {
  return (v.cross_references || []).length > 0 || bulkSorted(v).length > 0;
}
</script>

<template>
  <div class="tab-content">
    <div class="cross-ref-list">
      <template v-for="v in store.verses" :key="v.verse_number">
        <VerseAccordion v-if="hasAny(v)" :verse-number="v.verse_number">
          <div
            v-for="(r, i) in v.cross_references || []"
            :key="'curated-' + i"
            class="cross-ref-card"
            @click="store.openVersePreview(r.reference_label)"
          >
            <div class="cross-ref-header">
              <span class="cross-ref-ref">{{ r.reference_label }}</span>
              <span class="cross-ref-tag">{{ r.tag }}</span>
            </div>
            <div class="cross-ref-text">"{{ r.text }}"</div>
          </div>

          <template v-if="bulkSorted(v).length > 0">
            <div class="bulk-xref-heading">More cross-references (by relevance)</div>
            <div
              v-for="(l, i) in bulkSorted(v)"
              :key="'bulk-' + i"
              class="bulk-xref-row"
              @click="store.openVersePreview(l.reference_label)"
            >
              <span class="bulk-xref-ref">{{ l.reference_label }}</span>
              <span class="bulk-xref-votes" :class="{ negative: l.votes < 0 }">{{ l.votes }} votes</span>
            </div>
          </template>
        </VerseAccordion>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.cross-ref-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cross-ref-card {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 8px;
}

.cross-ref-card:hover {
  border-color: var(--accent-primary);
  transform: translateX(2px);
}

.cross-ref-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.cross-ref-ref {
  font-weight: 700;
  color: var(--accent-primary);
  font-size: 0.9rem;
}

.cross-ref-tag {
  font-size: 0.7rem;
  background-color: rgba(151, 64, 47, 0.15);
  color: var(--accent-secondary);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.cross-ref-text {
  font-family: 'Lora', serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.bulk-xref-heading {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 10px 0 4px;
}

.bulk-xref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.bulk-xref-row:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.bulk-xref-ref {
  color: var(--accent-primary);
  font-weight: 500;
}

.bulk-xref-votes {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: monospace;
}

.bulk-xref-votes.negative {
  color: var(--accent-error);
}
</style>

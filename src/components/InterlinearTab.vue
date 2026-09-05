<script setup>
import { useAppStore } from '../stores/app';
import VerseAccordion from './VerseAccordion.vue';

const store = useAppStore();

function isActiveRow(verseNumber, position) {
  if (!store.activeWord) return false;
  return (
    store.activeWord.verseNumber === String(verseNumber) &&
    store.activeWord.position === String(position)
  );
}

function onRowClick(event, verseNumber, tag) {
  store.setActiveWord(verseNumber, tag.position);
  store.openPopover(tag.strongs_number);
}
</script>

<template>
  <div class="tab-content">
    <div v-if="store.interlinearCount === 0" class="interlinear-note">
      {{
        store.verses.length === 0
          ? 'Load a passage to see the real Greek/Hebrew word-by-word tagging.'
          : 'No word-by-word tagging available for this passage yet.'
      }}
    </div>
    <div v-else class="interlinear-note">
      Real word-by-word tagging, in original Greek/Hebrew word order (not English word order).
      Click a verse to reveal its words, then click any word for its full lexicon entry.
    </div>

    <div class="interlinear-list">
      <template v-for="v in store.verses" :key="v.verse_number">
        <VerseAccordion v-if="(v.word_tags || []).length > 0" :verse-number="v.verse_number">
          <div
            v-for="t in v.word_tags"
            :key="t.position"
            class="interlinear-row"
            :class="{ active: isActiveRow(v.verse_number, t.position) }"
            @click="onRowClick($event, v.verse_number, t)"
          >
            <span class="interlinear-pos">{{ t.position }}</span>
            <span class="interlinear-original">{{ t.original_word }}</span>
            <span class="interlinear-translit">{{ t.transliteration || '' }}</span>
            <span class="interlinear-gloss">{{ t.gloss || '' }}</span>
            <span class="strongs-badge">{{ t.strongs_number }}</span>
            <span class="interlinear-morph">{{ t.morphology || '' }}</span>
          </div>
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

.interlinear-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 8px 2px 12px;
  line-height: 1.4;
}

.interlinear-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.interlinear-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.interlinear-row:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.interlinear-row.active {
  background-color: rgba(201, 162, 77, 0.1);
  border-color: var(--accent-primary);
}

.interlinear-pos {
  font-size: 0.65rem;
  color: var(--text-muted);
  width: 18px;
  flex-shrink: 0;
}

.interlinear-original {
  font-family: 'Lora', serif;
  color: var(--accent-primary);
  font-size: 1rem;
  min-width: 70px;
}

.interlinear-translit {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  min-width: 70px;
}

.interlinear-gloss {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex: 1;
}

.interlinear-morph {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-family: monospace;
}

.strongs-badge {
  font-family: monospace;
  background-color: rgba(201, 162, 77, 0.1);
  color: var(--accent-primary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}
</style>



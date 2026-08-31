<script setup>
import { useAppStore } from '../stores/app';
import PassageFinder from './PassageFinder.vue';
import VerseText from './VerseText.vue';

const store = useAppStore();
</script>

<template>
  <main class="reader-panel">
    <div class="section-header">
      <h2>Scripture Reader</h2>
    </div>

    <PassageFinder />

    <div class="passage-display" :class="{ 'is-loading': store.isLoadingPassage }">
      <div v-if="store.passageError" class="empty-state">
        <i class="fa-solid fa-book-open-reader"></i>
        <div><strong>{{ store.passageError.label }}</strong> couldn't be loaded.</div>
        <div style="font-size: 0.8rem">{{ store.passageError.message }}</div>
      </div>

      <div v-else class="scripture-content">
        <template v-for="(v, i) in store.verses" :key="v.verse_number">
          <VerseText :verse="v" />
          <br v-if="i < store.verses.length - 1" />
        </template>
      </div>

      <div class="passage-footer">
        <span>{{ store.passageLabel || 'Load a passage above to begin.' }}</span>
        <span>Click a word for its Strong's entry</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.reader-panel {
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--text-primary);
}

.passage-display {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 36px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scripture-content {
  font-family: var(--font-body);
  font-size: 1.45rem;
  line-height: 1.85;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.passage-display.is-loading .scripture-content {
  opacity: 0.35;
}

.passage-footer {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  color: var(--text-muted);
  text-align: center;
  padding: 40px 20px;
}

.empty-state i {
  font-size: 1.8rem;
  color: var(--text-muted);
}

@media (max-width: 560px) {
  .reader-panel {
    padding: 16px;
    gap: 16px;
    overflow-y: visible;
  }

  .passage-display {
    padding: 20px;
  }

  .scripture-content {
    font-size: 1.2rem;
    line-height: 1.75;
  }

  .passage-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();

function onKeydown(event) {
  if (event.key === 'Escape' && store.versePreview.show) {
    store.closeVersePreview();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="store.versePreview.show" class="verse-preview-backdrop" @click.self="store.closeVersePreview()">
      <div class="verse-preview" role="dialog" aria-modal="true">
        <button class="verse-preview-close" aria-label="Close" @click="store.closeVersePreview()">&times;</button>

        <div class="verse-preview-reference">{{ store.versePreview.reference }}</div>

        <div v-if="store.versePreview.loading" class="verse-preview-loading">
          Loading {{ store.versePreview.reference }}…
        </div>

        <div v-else-if="store.versePreview.error" class="verse-preview-loading">
          {{ store.versePreview.error }}
        </div>

        <div v-else class="verse-preview-text">
          <span v-for="v in store.versePreview.verses" :key="v.verse_number">
            <sup class="verse-preview-num">{{ v.verse_number }}</sup>{{ v.text }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.verse-preview-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 400;
}

.verse-preview {
  width: min(90vw, 560px);
  max-height: min(80vh, 620px);
  background-color: var(--bg-card);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  padding: 28px 30px;
  line-height: 1.6;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
  overflow-y: auto;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary) var(--bg-card);
}

.verse-preview::-webkit-scrollbar {
  width: 8px;
}

.verse-preview::-webkit-scrollbar-track {
  background: var(--bg-card);
}

.verse-preview::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}

.verse-preview::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent-primary);
}

.verse-preview-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 1;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.verse-preview-close:hover {
  color: var(--text-primary);
}

.verse-preview-reference {
  font-family: 'Lora', serif;
  font-size: 1.7rem;
  color: var(--accent-primary);
  padding-right: 48px;
  margin-bottom: 16px;
}

.verse-preview-loading {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.verse-preview-text {
  font-family: var(--font-body);
  font-size: 1.2rem;
  line-height: 1.75;
  color: var(--text-primary);
}

.verse-preview-num {
  font-family: 'Lora', serif;
  font-style: italic;
  font-weight: 600;
  color: var(--accent-primary);
  margin-right: 4px;
}

@media (max-width: 480px) {
  .verse-preview-backdrop {
    padding: 16px;
  }

  .verse-preview {
    padding: 22px 20px;
  }

  .verse-preview-reference {
    font-size: 1.4rem;
  }

  .verse-preview-text {
    font-size: 1.05rem;
  }
}
</style>
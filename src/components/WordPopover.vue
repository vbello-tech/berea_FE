<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();

const senses = computed(() => {
  const data = store.popover.data;
  if (!data) return [];
  if (data.senses && data.senses.length) return data.senses;
  return [data.strongs_def || 'No definition available.'];
});

function onDocumentClick(event) {
  if (!store.popover.show) return;
  if (event.target.closest('.word-popover')) return;
  if (event.target.closest('.kjv-word.taggable')) return;
  if (event.target.closest('.interlinear-row')) return;
  store.closePopover();
}

onMounted(() => document.addEventListener('click', onDocumentClick));
onUnmounted(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="store.popover.show"
      class="word-popover"
      :style="{ left: store.popover.x + 'px', top: store.popover.y + 'px' }"
    >
      <button class="word-popover-close" aria-label="Close" @click="store.closePopover()">&times;</button>

      <div v-if="store.popover.loading" class="word-popover-loading">
        Loading {{ store.popover.strongsNumber }}…
      </div>

      <div v-else-if="store.popover.error" class="word-popover-loading">
        {{ store.popover.error }}
      </div>

      <template v-else-if="store.popover.data">
        <div class="word-popover-original">{{ store.popover.data.lemma || '' }}</div>
        <div class="word-popover-translit">
          {{ store.popover.data.translit || '' }} &middot; {{ store.popover.data.number }}
        </div>
        <ul class="word-popover-senses">
          <li v-for="(s, i) in senses" :key="i">{{ s }}</li>
        </ul>
        <div class="word-popover-kjv">KJV renders this as: {{ store.popover.data.kjv_def || '—' }}</div>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.word-popover {
  position: fixed;
  max-width: 360px;
  background-color: var(--bg-card);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  line-height: 1.5;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.word-popover-close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 4px;
}

.word-popover-original {
  font-family: 'Lora', serif;
  font-size: 1.6rem;
  color: var(--accent-primary);
}

.word-popover-translit {
  font-size: 0.95rem;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 8px;
}

.word-popover-senses {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 10px 0;
  padding-left: 18px;
}

.word-popover-senses li {
  margin-bottom: 5px;
}

.word-popover-loading {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.word-popover-kjv {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 4px;
}
</style>

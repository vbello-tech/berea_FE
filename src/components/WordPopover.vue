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

function onKeydown(event) {
  if (event.key === 'Escape' && store.popover.show) {
    store.closePopover();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="store.popover.show" class="word-popover-backdrop" @click.self="store.closePopover()">
      <div class="word-popover" role="dialog" aria-modal="true">
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
    </div>
  </Teleport>
</template>

<style scoped>
.word-popover-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 200;
}

.word-popover {
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

.word-popover::-webkit-scrollbar {
  width: 8px;
}

.word-popover::-webkit-scrollbar-track {
  background: var(--bg-card);
}

.word-popover::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}

.word-popover::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent-primary);
}

.word-popover-close {
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 1;
  padding: 4px;
  z-index: 1;
}

.word-popover-close:hover {
  color: var(--text-primary);
}

.word-popover-original {
  font-family: 'Lora', serif;
  font-size: 2.4rem;
  color: var(--accent-primary);
}

.word-popover-translit {
  font-size: 1.15rem;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 14px;
}

.word-popover-senses {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 14px 0;
  padding-left: 22px;
}

.word-popover-senses li {
  margin-bottom: 8px;
}

.word-popover-loading {
  font-size: 1.2rem;
  color: var(--text-muted);
}

.word-popover-kjv {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 480px) {
  .word-popover-backdrop {
    padding: 16px;
  }

  .word-popover {
    padding: 22px 20px;
  }

  .word-popover-original {
    font-size: 1.9rem;
  }

  .word-popover-senses,
  .word-popover-loading {
    font-size: 1.05rem;
  }
}
</style>

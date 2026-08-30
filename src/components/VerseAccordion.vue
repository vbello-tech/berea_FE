<script setup>
import { ref } from 'vue';

defineProps({
  verseNumber: { type: [Number, String], required: true },
});

const expanded = ref(false);
defineExpose({ expanded });
</script>

<template>
  <div class="verse-group">
    <button
      type="button"
      class="verse-group-heading"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span>Verse {{ verseNumber }}</span>
      <i class="fa-solid fa-chevron-down chevron" :class="{ open: expanded }"></i>
    </button>
    <div v-show="expanded" class="verse-group-rows">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.verse-group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 10px 0 0;
  padding: 8px 4px;
  border-bottom: 1px solid var(--border-color);
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
}

.verse-group:first-child .verse-group-heading {
  margin-top: 0;
}

.verse-group-heading:hover {
  color: var(--text-primary);
}

.chevron {
  transition: transform 0.2s ease;
  color: var(--text-muted);
}

.chevron.open {
  transform: rotate(180deg);
}

.verse-group-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 2px 4px;
}
</style>

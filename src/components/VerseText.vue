<script setup>
import { computed } from 'vue';
import { useAppStore } from '../stores/app';
import { tokenizeVerse } from '../utils/wordAlignment';

const props = defineProps({
  verse: { type: Object, required: true },
});

const store = useAppStore();
const tokens = computed(() => tokenizeVerse(props.verse));

function isActive(tag) {
  if (!tag || !store.activeWord) return false;
  return (
    store.activeWord.verseNumber === String(props.verse.verse_number) &&
    store.activeWord.position === String(tag.position)
  );
}

function onWordClick(event, tag) {
  if (!tag) return;
  store.setActiveTab('interlinear');
  store.setActiveWord(props.verse.verse_number, tag.position);
  const rect = event.target.getBoundingClientRect();
  const x = Math.max(8, Math.min(rect.left, window.innerWidth - 376));
  const y = Math.min(rect.bottom + 8, window.innerHeight - 220);
  store.openPopover(tag.strongs_number, x, y);
}
</script>

<template>
  <p>
    <span class="verse-num">{{ verse.verse_number }}</span
    ><template v-for="(token, i) in tokens" :key="i"
      ><span
        v-if="token.isWord && token.tag"
        class="kjv-word taggable"
        :class="{ active: isActive(token.tag) }"
        @click="onWordClick($event, token.tag)"
        >{{ token.text }}</span
      ><template v-else>{{ token.text }}</template></template
    >
  </p>
</template>

<style scoped>
.verse-num {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin-right: 6px;
  user-select: none;
  vertical-align: super;
}

.kjv-word.taggable {
  cursor: pointer;
  border-bottom: 1px dotted var(--accent-primary);
}

.kjv-word.taggable:hover,
.kjv-word.taggable.active {
  background-color: rgba(201, 162, 77, 0.15);
  border-radius: 3px;
}
</style>

<script setup>
import { reactive, ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useAppStore } from '../stores/app';
import { BOOKS } from '../constants/books';

const store = useAppStore();

const form = reactive({
  book: 'John',
  chapter: 3,
  start: 16,
  end: 17,
  translation: 'KJV',
});

// --- Book combobox state ---------------------------------------------------

const OLD_TESTAMENT = new Set([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
  'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes',
  'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
]);

// Books that don't match the OLD_TESTAMENT set above fall into "New Testament"
// by default. This is a soft grouping only — if BOOKS uses different naming
// (e.g. "Song of Songs" vs "Song of Solomon"), that book just lands in the
// New Testament bucket instead of breaking anything.
const bookGroups = computed(() => {
  const ot = [];
  const nt = [];
  for (const b of BOOKS) {
    (OLD_TESTAMENT.has(b) ? ot : nt).push(b);
  }
  return [
    { label: 'Old Testament', books: ot },
    { label: 'New Testament', books: nt },
  ].filter(g => g.books.length);
});

const isOpen = ref(false);
const rootEl = ref(null);
const triggerEl = ref(null);
const listEl = ref(null);

const flatBooks = computed(() => bookGroups.value.flatMap(g => g.books));
const activeIndex = computed(() => flatBooks.value.indexOf(form.book));

function openList() {
  isOpen.value = true;
  nextTick(scrollActiveIntoView);
}

function closeList() {
  isOpen.value = false;
  triggerEl.value?.focus();
}

function toggleList() {
  isOpen.value ? closeList() : openList();
}

function selectBook(book) {
  form.book = book;
  isOpen.value = false;
  triggerEl.value?.focus();
}

function moveActive(delta) {
  if (!isOpen.value) {
    openList();
    return;
  }
  const len = flatBooks.value.length;
  if (!len) return;
  const next = (activeIndex.value + delta + len) % len;
  form.book = flatBooks.value[next];
  nextTick(scrollActiveIntoView);
}

function scrollActiveIntoView() {
  const el = listEl.value?.querySelector('.combobox-option.is-active');
  el?.scrollIntoView({ block: 'nearest' });
}

function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) closeList();
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside));

// -----------------------------------------------------------------------

function submit() {
  store.loadPassage({ ...form });
}
</script>

<template>
  <div class="passage-finder">
    <div class="finder-title">Passage Finder</div>
    <div class="controls-grid" @keydown.enter.prevent="submit">
      <div class="input-group book-combobox" ref="rootEl">
        <label for="book-input">Book</label>
        <div class="combobox-wrap">
          <button
            id="book-input"
            ref="triggerEl"
            type="button"
            class="input-control combobox-trigger"
            role="combobox"
            :aria-expanded="isOpen"
            aria-haspopup="listbox"
            aria-controls="book-listbox"
            @click="toggleList"
            @keydown.down.prevent="moveActive(1)"
            @keydown.up.prevent="moveActive(-1)"
            @keydown.esc="closeList"
          >
            <span>{{ form.book }}</span>
            <i class="fa-solid fa-chevron-down combobox-caret"></i>
          </button>

          <ul
            v-if="isOpen"
            id="book-listbox"
            ref="listEl"
            class="combobox-list"
            role="listbox"
          >
            <template v-for="group in bookGroups" :key="group.label">
              <li class="combobox-group-label">{{ group.label }}</li>
              <li
                v-for="book in group.books"
                :key="book"
                role="option"
                :aria-selected="book === form.book"
                class="combobox-option"
                :class="{ 'is-active': book === form.book }"
                @click="selectBook(book)"
              >
                {{ book }}
              </li>
            </template>
          </ul>
        </div>
      </div>

      <div class="input-group">
        <label for="ch-input">Ch.</label>
        <input id="ch-input" v-model.number="form.chapter" type="number" class="input-control" min="1" required />
      </div>
      <div class="input-group">
        <label for="start-vs">Start Vs</label>
        <input
          id="start-vs"
          v-model.number="form.start"
          type="number"
          class="input-control"
          min="1"
          placeholder="All"
          title="Leave blank to load the whole chapter"
        />
      </div>
      <div class="input-group">
        <label for="end-vs">End Vs</label>
        <input
          id="end-vs"
          v-model.number="form.end"
          type="number"
          class="input-control"
          min="1"
          placeholder="All"
          title="Leave blank to load the whole chapter"
        />
      </div>
      <div class="input-group">
        <label for="trans-select">Translation</label>
        <select id="trans-select" v-model="form.translation" class="input-control">
          <option value="KJV">KJV</option>
        </select>
      </div>
      <button class="btn-fetch focus-ring" type="button" :disabled="store.isLoadingPassage" @click="submit">
        <i v-if="store.isLoadingPassage" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-arrow-right"></i>
        {{ store.isLoadingPassage ? 'Loading…' : 'Load' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.passage-finder {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.finder-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 14px;
  text-transform: uppercase;
}

.controls-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr auto;
  gap: 12px;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-control {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
}

.input-control:focus {
  border-color: var(--border-focus);
}

select.input-control {
  cursor: pointer;
}

/* --- Book combobox --- */

.combobox-wrap {
  position: relative;
}

.combobox-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  cursor: pointer;
}

.combobox-trigger:hover {
  border-color: var(--border-focus);
}

.combobox-caret {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: transform 0.15s ease;
}

.combobox-trigger[aria-expanded='true'] .combobox-caret {
  transform: rotate(180deg);
}

.combobox-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 480px;
  overflow-y: auto;
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 20;
  list-style: none;
  margin: 0;
  padding: 6px;
}

.combobox-group-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 10px 4px;
}

.combobox-option {
  padding: 8px 10px;
  border-radius: var(--radius-sm, 6px);
  font-size: 0.9rem;
  color: var(--text-primary);
  cursor: pointer;
}

.combobox-option:hover {
  background-color: var(--bg-input);
}

.combobox-option.is-active {
  background-color: var(--bg-input);
  font-weight: 700;
}

.btn-fetch {
  background-color: var(--accent-primary);
  color: #1d1811;
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  white-space: nowrap;
}

.btn-fetch:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-fetch:disabled {
  opacity: 0.7;
  cursor: default;
  transform: none;
}

@media (max-width: 1024px) {
  .controls-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 560px) {
  .passage-finder {
    padding: 16px;
  }

  .controls-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .btn-fetch {
    grid-column: 1 / -1;
    justify-content: center;
    width: 100%;
  }
}
</style>


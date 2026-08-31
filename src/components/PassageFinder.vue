<script setup>
import { reactive } from 'vue';
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

function submit() {
  store.loadPassage({ ...form });
}
</script>

<template>
  <div class="passage-finder">
    <div class="finder-title">Passage Finder</div>
    <div class="controls-grid" @keydown.enter.prevent="submit">
      <div class="input-group">
        <label for="book-select">Book</label>
        <select id="book-select" v-model="form.book" class="input-control">
          <option v-for="b in BOOKS" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>
      <div class="input-group">
        <label for="ch-input">Ch.</label>
        <input id="ch-input" v-model.number="form.chapter" type="number" class="input-control" min="1" required />
      </div>
      <div class="input-group">
        <label for="start-vs">Start Vs</label>
        <input id="start-vs" v-model.number="form.start" type="number" class="input-control" min="1" required />
      </div>
      <div class="input-group">
        <label for="end-vs">End Vs</label>
        <input id="end-vs" v-model.number="form.end" type="number" class="input-control" min="1" required />
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

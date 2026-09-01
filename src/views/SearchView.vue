<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { BOOKS } from '../constants/books';

const store = useAppStore();
const router = useRouter();
const inputEl = ref(null);

onMounted(() => {
  inputEl.value && inputEl.value.focus();
});

function onInput() {
  store.queueSearch(store.search.query);
}

function onSubmit() {
  store.runSearch(store.search.query);
}

function clearSearch() {
  store.search.query = '';
  store.queueSearch('');
}

async function selectResult(result) {
  await store.goToSearchResult(result);
  router.push('/');
}

// Highlights whichever of the query's words literally appear in a result's
// text. The backend ranks by relevance (score), not just exact substrings,
// so a result can match without containing every query word — this only
// highlights the ones that do appear, case-insensitively.
function highlightTokens(text) {
  const words = (store.search.query || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (words.length === 0) return [{ text, match: false }];

  const re = new RegExp(`(${words.join('|')})`, 'gi');
  const exactRe = new RegExp(`^(${words.join('|')})$`, 'i');
  return text
    .split(re)
    .filter((p) => p !== '')
    .map((p) => ({ text: p, match: exactRe.test(p) }));
}

function scorePercent(score) {
  return Math.round((score || 0) * 100);
}

const resultCountLabel = computed(() => {
  const n = store.search.count;
  return n === 1 ? '1 result' : `${n} results`;
});

// The backend ranks by relevance rather than requiring an exact match, so
// a query with a typo or the "wrong" word still returns something — this
// just tells the person when what they got isn't a perfect match, based on
// the top result's own score rather than a separate fuzzy flag.
const isApproximate = computed(() => {
  const top = store.search.results[0];
  return !!top && top.score < 0.999;
});
</script>

<template>
  <main class="search-page">
    <div class="section-header">
      <h2>Search Scripture</h2>
    </div>

    <div class="search-box">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        ref="inputEl"
        v-model="store.search.query"
        type="text"
        class="search-input"
        placeholder="Search for a word or phrase…"
        autocomplete="off"
        @input="onInput"
        @keydown.enter="onSubmit"
      />
      <button v-if="store.search.query" class="search-clear" aria-label="Clear search" @click="clearSearch">
        &times;
      </button>
    </div>

    <div class="search-filters">
      <select
        class="filter-select"
        :value="store.search.testament"
        @change="store.setSearchTestament($event.target.value)"
      >
        <option value="">Whole Bible</option>
        <option value="OT">Old Testament</option>
        <option value="NT">New Testament</option>
      </select>
      <select
        class="filter-select"
        :value="store.search.book"
        @change="store.setSearchBook($event.target.value)"
      >
        <option value="">All Books</option>
        <option v-for="b in BOOKS" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div class="search-results">
      <div v-if="store.search.loading" class="search-status">
        <i class="fa-solid fa-spinner fa-spin"></i> Searching…
      </div>

      <div v-else-if="store.search.error" class="search-status error">
        {{ store.search.error }}
      </div>

      <template v-else-if="store.search.hasSearched">
        <div v-if="store.search.results.length === 0" class="search-status">
          No results for "{{ store.search.query }}". Try a different word, or check the spelling.
        </div>

        <template v-else>
          <div v-if="isApproximate" class="fuzzy-note">
            No exact match for "{{ store.search.query }}" — showing the closest verses instead, ranked by relevance.
          </div>
          <div class="result-count">{{ resultCountLabel }}</div>

          <button
            v-for="(r, i) in store.search.results"
            :key="i"
            type="button"
            class="result-card"
            @click="selectResult(r)"
          >
            <div class="result-header">
              <span class="result-ref">{{ r.book }} {{ r.chapter }}:{{ r.verse_number }}</span>
              <span class="result-score" :class="{ weak: r.score < 0.6 }">{{ scorePercent(r.score) }}% match</span>
            </div>
            <div class="result-text">
              <template v-for="(tok, ti) in highlightTokens(r.text)" :key="ti">
                <mark v-if="tok.match">{{ tok.text }}</mark>
                <template v-else>{{ tok.text }}</template>
              </template>
            </div>
          </button>
        </template>
      </template>

      <div v-else class="search-status">Search across every verse for a word or phrase.</div>
    </div>
  </main>
</template>

<style scoped>
.search-page {
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.section-header h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--text-primary);
}

.search-box {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--border-focus);
}

.search-box i.fa-magnifying-glass {
  color: var(--accent-primary);
  font-size: 1.1rem;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.15rem;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.3rem;
  line-height: 1;
  padding: 4px;
}

.search-clear:hover {
  color: var(--text-primary);
}

.search-filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 8px 10px;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: var(--border-focus);
}

.search-results {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.search-status {
  padding: 48px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.search-status.error {
  color: var(--accent-error);
}

.fuzzy-note {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 10px 12px;
  margin: 4px 4px 8px;
  background-color: rgba(201, 162, 77, 0.08);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.result-count {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 10px 10px 6px;
}

.result-card {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin-bottom: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.result-card:hover {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: var(--border-color);
  transform: translateX(2px);
}

.result-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.result-ref {
  font-weight: 700;
  color: var(--accent-primary);
  font-size: 0.85rem;
}

.result-score {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: monospace;
  flex-shrink: 0;
}

.result-score.weak {
  color: var(--accent-secondary);
}

.result-text {
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.result-text mark {
  background-color: rgba(201, 162, 77, 0.28);
  color: var(--text-primary);
  border-radius: 3px;
  padding: 0 2px;
}

@media (max-width: 560px) {
  .search-page {
    padding: 16px;
    gap: 14px;
    overflow-y: visible;
  }

  .search-results {
    overflow-y: visible;
  }

  .search-input {
    font-size: 1rem;
  }

  .search-filters {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
    min-width: 130px;
  }
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';

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

async function selectResult(result) {
  await store.goToSearchResult(result);
  router.push('/');
}

// Splits a verse's text around whatever term actually matched (the
// corrected/fuzzy term when the search fell back to one) so it can be
// highlighted, case-insensitively, without touching the original casing.
function highlightTokens(text) {
  const term = (store.search.fuzzy && store.search.correctedQuery) || store.search.query;
  const words = (term || '')
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

const resultCountLabel = computed(() => {
  const n = store.search.results.length;
  return n === 1 ? '1 result' : `${n} results`;
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
      <button v-if="store.search.query" class="search-clear" aria-label="Clear search" @click="store.queueSearch(''); store.search.query = ''">
        &times;
      </button>
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
          <div v-if="store.search.fuzzy" class="fuzzy-note">
            No exact match for "{{ store.search.query }}" — showing results for
            <strong>"{{ store.search.correctedQuery }}"</strong> instead.
          </div>
          <div class="result-count">{{ resultCountLabel }}</div>

          <button
            v-for="(r, i) in store.search.results"
            :key="i"
            type="button"
            class="result-card"
            @click="selectResult(r)"
          >
            <div class="result-ref">{{ r.book }} {{ r.chapter }}:{{ r.verse_number }}</div>
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

.fuzzy-note strong {
  color: var(--accent-primary);
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

.result-ref {
  font-weight: 700;
  color: var(--accent-primary);
  font-size: 0.85rem;
  margin-bottom: 4px;
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
}
</style>

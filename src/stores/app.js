import { defineStore } from 'pinia';
import { apiFetch } from '../api/client';

let notesSaveTimer = null;
let toastTimer = null;
let searchDebounceTimer = null;

export const useAppStore = defineStore('app', {
  state: () => ({
    // Auth. Token lives only in memory for this session (no localStorage),
    // matching the original — refreshing the page requires logging in again.
    // For a real deployment, persist it in an httpOnly cookie set by the
    // server, or in localStorage from your own app shell.
    authToken: null,
    username: null,

    // Current passage + results
    currentPassage: null, // { book, chapter, start, end, translation }
    verses: [],
    passageLabel: '',

    // Mobile hamburger menu — the trigger lives in AppHeader, the menu
    // content in SidebarNav; shared here since they're sibling components.
    mobileMenuOpen: false,
    isLoadingPassage: false,
    passageError: null,

    // Study panel
    activeTab: 'interlinear',
    activeWord: null, // { verseNumber, position }

    // Notes
    notesText: '',
    notesStatus: '',
    notesDisabled: true,

    // Word popover
    popover: {
      show: false,
      loading: false,
      error: null,
      data: null,
      strongsNumber: null,
      x: 0,
      y: 0,
    },

    // Search
    search: {
      query: '',
      book: '',       // '' = all books
      testament: '',  // '' = all, else 'OT' | 'NT'
      loading: false,
      error: null,
      results: [],
      count: 0,
      hasSearched: false,
    },

    // Toast
    toast: { show: false, message: '', isError: false },
  }),

  getters: {
    isLoggedIn: (state) => !!state.authToken,

    interlinearCount: (state) =>
      state.verses.reduce((sum, v) => sum + (v.word_tags || []).length, 0),

    crossRefCount: (state) =>
      state.verses.reduce(
        (sum, v) => sum + (v.cross_references || []).length + (v.bulk_cross_references || []).length,
        0
      ),
  },

  actions: {
    // ---------- Mobile menu ----------
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },

    // ---------- Toast ----------
    showToast(message, isError = false) {
      this.toast = { show: true, message, isError };
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 2600);
    },

    // ---------- Passage loading ----------
    // start/end are optional — when omitted, the backend returns the
    // whole chapter. The actual verse range for a whole-chapter response
    // is derived from what's returned (first/last verse_number), so
    // currentPassage always has concrete numbers and everything
    // downstream (notes, popovers, etc.) works unchanged either way.
    async loadPassage({ book, chapter, start, end, translation }) {
      if (!book || !chapter) {
        this.showToast('Please choose a book and chapter.', true);
        return;
      }
      if (start && end && Number(start) > Number(end)) {
        this.showToast('Start verse must come before end verse.', true);
        return;
      }

      this.isLoadingPassage = true;
      this.passageError = null;
      const wholeChapter = !start;

      try {
        let url = `/passage/?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`;
        if (start) url += `&start=${start}`;
        if (end) url += `&end=${end}`;

        const data = await apiFetch(url, {}, this.authToken);
        this.verses = data.results;

        const firstVerse = data.results[0];
        const lastVerse = data.results[data.results.length - 1];
        const actualStart = start || (firstVerse ? firstVerse.verse_number : 1);
        const actualEnd = end || (lastVerse ? lastVerse.verse_number : actualStart);

        const rangeLabel = wholeChapter
          ? `${book} ${chapter}`
          : actualStart === actualEnd
            ? `${book} ${chapter}:${actualStart}`
            : `${book} ${chapter}:${actualStart}-${actualEnd}`;

        this.passageLabel = `Current Display: ${rangeLabel} (${translation})`;
        this.currentPassage = { book, chapter, start: actualStart, end: actualEnd, translation };
        this.activeWord = null;
        this.closePopover();

        this.showToast(`Loaded ${rangeLabel} (${translation})`);
        await this.loadNoteForCurrentPassage();
      } catch (err) {
        this.verses = [];
        this.passageError = {
          label: wholeChapter ? `${book} ${chapter}` : `${book} ${chapter}:${start}${end && end !== start ? '-' + end : ''}`,
          message: err.message,
        };
        this.showToast(err.message || 'Could not reach the API. Is the Django server running?', true);
      } finally {
        this.isLoadingPassage = false;
      }
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    setActiveWord(verseNumber, position) {
      this.activeWord = { verseNumber: String(verseNumber), position: String(position) };
    },

    // ---------- Word popover (Strong's lexicon lookup) ----------
    // Always centered on screen rather than anchored to the clicked word,
    // so it stays put and readable regardless of where in the passage
    // someone clicks.
    async openPopover(strongsNumber) {
      this.popover = {
        show: true,
        loading: true,
        error: null,
        data: null,
        strongsNumber,
      };
      try {
        const data = await apiFetch(`/strongs/?number=${encodeURIComponent(strongsNumber)}`, {}, this.authToken);
        this.popover.data = data;
        this.popover.loading = false;
      } catch (err) {
        this.popover.error = `Could not load ${strongsNumber}.`;
        this.popover.loading = false;
      }
    },

    closePopover() {
      this.popover.show = false;
    },

    // ---------- Search ----------
    // Called on every keystroke in the search box. Debounces, then defers
    // to runSearch — kept separate so a component can also trigger an
    // immediate search (e.g. on Enter) via runSearch directly.
    queueSearch(query) {
      this.search.query = query;
      clearTimeout(searchDebounceTimer);
      if (!query.trim()) {
        this.search.results = [];
        this.search.count = 0;
        this.search.hasSearched = false;
        this.search.error = null;
        return;
      }
      searchDebounceTimer = setTimeout(() => this.runSearch(query), 400);
    },

    // Hits GET /search/?q=<query>&translation=<t>&limit=<n>, optionally
    // &book=<book>&testament=<OT|NT>. book/testament are only appended when
    // set — the API 400s on an invalid value for either, and an empty
    // string isn't a valid book or testament. The backend does its own
    // relevance-ranked matching (word/phrase overlap, not just an exact
    // substring) and returns each result with a 0–1 `score` — that's how
    // near-misses ("doesn't get the exact word") are handled: a query that
    // doesn't exactly appear anywhere still returns the closest verses,
    // ranked, rather than nothing.
    async runSearch(query) {
      const trimmed = query.trim();
      if (!trimmed) return;

      this.search.loading = true;
      this.search.error = null;

      try {
        const translation = (this.currentPassage && this.currentPassage.translation) || 'KJV';
        let url = `/search/?q=${encodeURIComponent(trimmed)}&translation=${translation}&limit=20`;
        if (this.search.book) url += `&book=${encodeURIComponent(this.search.book)}`;
        if (this.search.testament) url += `&testament=${encodeURIComponent(this.search.testament)}`;

        const data = await apiFetch(url, {}, this.authToken);
        this.search.results = data.results || [];
        this.search.count = data.count ?? this.search.results.length;
        this.search.hasSearched = true;
      } catch (err) {
        this.search.error = err.message || 'Search failed. Is the API reachable?';
        this.search.results = [];
        this.search.count = 0;
        this.search.hasSearched = true;
      } finally {
        this.search.loading = false;
      }
    },

    // Updates the book/testament filter and re-runs the current search (if
    // there is one) so results reflect the new filter immediately.
    setSearchBook(book) {
      this.search.book = book;
      if (this.search.query.trim()) this.runSearch(this.search.query);
    },

    setSearchTestament(testament) {
      this.search.testament = testament;
      if (this.search.query.trim()) this.runSearch(this.search.query);
    },

    // Loads a search result's passage into the reader. Navigation back to
    // the reader route is handled by the calling component (SearchView),
    // keeping the store free of router dependencies.
    async goToSearchResult(result) {
      await this.loadPassage({
        book: result.book,
        chapter: result.chapter,
        start: result.verse_number,
        end: result.verse_number,
        translation: (this.currentPassage && this.currentPassage.translation) || 'KJV',
      });
    },

    // ---------- Notes ----------
    async loadNoteForCurrentPassage() {
      if (!this.authToken || !this.currentPassage) {
        this.notesText = '';
        this.notesDisabled = true;
        return;
      }
      this.notesDisabled = false;
      try {
        const { book, chapter, start, end } = this.currentPassage;
        const note = await apiFetch(
          `/notes/by_passage/?book=${encodeURIComponent(book)}&chapter=${chapter}&start=${start}&end=${end}`,
          {},
          this.authToken
        );
        this.notesText = note.text || '';
      } catch (err) {
        this.showToast('Could not load your note for this passage.', true);
      }
    },

    queueNoteSave() {
      if (!this.authToken) return;
      this.notesStatus = 'Saving…';
      clearTimeout(notesSaveTimer);
      notesSaveTimer = setTimeout(() => this.saveCurrentNote(), 700);
    },

    async saveCurrentNote() {
      if (!this.authToken || !this.currentPassage) return;
      const { book, chapter, start, end } = this.currentPassage;
      try {
        await apiFetch(
          `/notes/by_passage/?book=${encodeURIComponent(book)}&chapter=${chapter}&start=${start}&end=${end}`,
          { method: 'PUT', body: JSON.stringify({ text: this.notesText }) },
          this.authToken
        );
        this.notesStatus = 'Saved';
        setTimeout(() => {
          this.notesStatus = '';
        }, 1500);
      } catch (err) {
        this.notesStatus = 'Save failed';
      }
    },

    async clearNote() {
      this.notesText = '';
      await this.saveCurrentNote();
      this.showToast('Notes cleared');
    },

    // ---------- Auth ----------
    async handleAuth(endpoint, username, password) {
      if (!username || !password) {
        this.showToast('Enter a username and password.', true);
        return false;
      }
      try {
        const data = await apiFetch(`/auth/${endpoint}/`, {
          method: 'POST',
          body: JSON.stringify({ username, password, email: `${username}@example.com` }),
        });
        this.authToken = data.token;
        this.username = data.username;
        this.showToast(endpoint === 'register' ? `Welcome, ${data.username}!` : `Logged in as ${data.username}`);
        await this.loadNoteForCurrentPassage();
        return true;
      } catch (err) {
        this.showToast(err.message || 'Authentication failed.', true);
        return false;
      }
    },

    async logout() {
      try {
        await apiFetch('/auth/logout/', { method: 'POST' }, this.authToken);
      } catch (_) {
        /* ignore */
      }
      this.authToken = null;
      this.username = null;
      this.notesText = '';
      this.notesDisabled = true;
      this.showToast('Logged out.');
    },
  },
});

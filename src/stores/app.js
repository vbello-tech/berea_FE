import { defineStore } from 'pinia';
import { apiFetch } from '../api/client';

let notesSaveTimer = null;
let toastTimer = null;

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
    // ---------- Toast ----------
    showToast(message, isError = false) {
      this.toast = { show: true, message, isError };
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 2600);
    },

    // ---------- Passage loading ----------
    async loadPassage({ book, chapter, start, end, translation }) {
      if (!chapter || !start || start > end) {
        this.showToast('Please enter a valid chapter and verse range.', true);
        return;
      }

      this.isLoadingPassage = true;
      this.passageError = null;

      try {
        const data = await apiFetch(
          `/passage/?book=${encodeURIComponent(book)}&chapter=${chapter}&start=${start}&end=${end}&translation=${translation}`,
          {},
          this.authToken
        );
        this.verses = data.results;
        this.passageLabel = `Current Display: ${book} ${chapter}:${start}-${end} (${translation})`;
        this.currentPassage = { book, chapter, start, end, translation };
        this.activeWord = null;
        this.closePopover();

        this.showToast(`Loaded ${book} ${chapter}:${start}-${end} (${translation})`);
        await this.loadNoteForCurrentPassage();
      } catch (err) {
        this.verses = [];
        this.passageError = {
          label: `${book} ${chapter}:${start}${end !== start ? '-' + end : ''}`,
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
        return;
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
      } catch (err) {
        this.showToast(err.message || 'Authentication failed.', true);
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

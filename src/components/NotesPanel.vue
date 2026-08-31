<script setup>
import { useAppStore } from '../stores/app';

const store = useAppStore();

function onInput() {
  store.queueNoteSave();
}

function onClear() {
  if (store.notesText.trim() && !confirm('Clear your personal notes for this passage?')) {
    return;
  }
  store.clearNote();
}
</script>

<template>
  <div class="notes-section">
    <div class="notes-header">
      <label for="study-notes">
        <i class="fa-regular fa-note-sticky"></i>
        Personal Notes
      </label>
      <div class="notes-actions">
        <span class="notes-status">{{ store.notesStatus }}</span>
        <button type="button" title="Clear Note" aria-label="Clear note" class="btn-clear" @click="onClear">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
    <textarea
      id="study-notes"
      v-model="store.notesText"
      class="notes-editor focus-ring"
      :disabled="store.notesDisabled"
      :placeholder="
        store.notesDisabled ? 'Log in to save personal notes for this passage.' : 'Type your personal study notes here...'
      "
      @input="onInput"
    ></textarea>
  </div>
</template>

<style scoped>
.notes-section {
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-panel);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 220px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notes-header label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.notes-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notes-status {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.btn-clear {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.notes-editor {
  width: 100%;
  flex: 1;
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 12px;
  font-family: var(--font-ui);
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
}

.notes-editor:focus {
  border-color: var(--border-focus);
}

@media (max-width: 560px) {
  .notes-section {
    height: 170px;
    padding: 12px;
  }
}
</style>

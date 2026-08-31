<script setup>
import { useAppStore } from '../stores/app';
import InterlinearTab from './InterlinearTab.vue';
import CrossRefTab from './CrossRefTab.vue';
import NotesPanel from './NotesPanel.vue';

const store = useAppStore();
</script>

<template>
  <aside class="study-panel">
    <div class="study-header">
      <div class="study-title">Study Suite</div>

      <div class="tabs-header" role="tablist">
        <button
          class="tab-btn"
          :class="{ active: store.activeTab === 'interlinear' }"
          role="tab"
          :aria-selected="store.activeTab === 'interlinear'"
          @click="store.setActiveTab('interlinear')"
        >
          <i class="fa-solid fa-language"></i>
          Interlinear
          <span class="tab-count">{{ store.interlinearCount }}</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: store.activeTab === 'crossref' }"
          role="tab"
          :aria-selected="store.activeTab === 'crossref'"
          @click="store.setActiveTab('crossref')"
        >
          <i class="fa-solid fa-diagram-project"></i>
          Cross Ref
          <span class="tab-count">{{ store.crossRefCount }}</span>
        </button>
      </div>
    </div>

    <div class="tabs-body">
      <InterlinearTab v-show="store.activeTab === 'interlinear'" />
      <CrossRefTab v-show="store.activeTab === 'crossref'" />
    </div>

    <NotesPanel />
  </aside>
</template>

<style scoped>
.study-panel {
  background-color: var(--bg-panel);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.study-header {
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid var(--border-color);
}

.study-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.tabs-header {
  display: flex;
  gap: 8px;
  position: relative;
  bottom: -1px;
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  min-height: 44px;
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-secondary);
  background-color: rgba(255, 255, 255, 0.02);
}

.tab-btn.active {
  color: var(--accent-primary);
  background-color: var(--bg-card);
  border-color: var(--border-color);
  border-bottom: 2px solid var(--accent-primary);
}

.tab-count {
  background-color: var(--bg-input);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tab-btn.active .tab-count {
  background-color: rgba(201, 162, 77, 0.2);
  color: var(--accent-primary);
}

.tabs-body {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-card);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .study-panel {
    border-left: none;
    border-top: 1px solid var(--border-color);
  }

  .tabs-body {
    max-height: 55vh;
  }
}

@media (max-width: 560px) {
  .study-header {
    padding: 16px 16px 0 16px;
  }

  .tab-btn {
    padding: 10px 8px;
    font-size: 0.8rem;
    gap: 5px;
  }

  .tabs-body {
    padding: 12px;
    max-height: 50vh;
  }
}
</style>

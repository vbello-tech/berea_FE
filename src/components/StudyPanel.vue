<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '../stores/app';
import InterlinearTab from './InterlinearTab.vue';
import CrossRefTab from './CrossRefTab.vue';
import NotesPanel from './NotesPanel.vue';

const store = useAppStore();

// Only meaningful on mobile — see the max-width:1024px block in <style>.
// At desktop widths .tabs-drawer is `display:contents`, so this state is
// simply unused there and the panel behaves exactly as before.
const drawerOpen = ref(false);

function openTab(tab) {
  store.setActiveTab(tab);
  drawerOpen.value = true;
}

function onKeydown(event) {
  if (event.key === 'Escape' && drawerOpen.value) {
    drawerOpen.value = false;
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <aside class="study-panel">
    <!-- Mobile only: two floating buttons: instead of scrolling down to
         reach Interlinear/Cross Ref, tapping one opens that tab directly
         in a drawer that slides in from the right. -->
    <button type="button" class="tab-fab crossref focus-ring" aria-label="Open Cross References" @click="openTab('crossref')">
      <i class="fa-solid fa-diagram-project"></i>
      <span v-if="store.crossRefCount" class="fab-badge">{{ store.crossRefCount }}</span>
    </button>
    <button type="button" class="tab-fab interlinear focus-ring" aria-label="Open Interlinear" @click="openTab('interlinear')">
      <i class="fa-solid fa-language"></i>
      <span v-if="store.interlinearCount" class="fab-badge">{{ store.interlinearCount }}</span>
    </button>

    <div v-if="drawerOpen" class="drawer-backdrop" @click="drawerOpen = false"></div>

    <div class="tabs-drawer" :class="{ open: drawerOpen }">
      <div class="study-header">
        <div class="study-title">Study Suite</div>
        <button type="button" class="drawer-close" aria-label="Close" @click="drawerOpen = false">&times;</button>

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

/* Desktop (default): an invisible wrapper — study-header/tabs-body behave
   exactly as if they were direct children of .study-panel, unchanged. */
.tabs-drawer {
  display: contents;
}

.study-header {
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.study-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.drawer-close {
  display: none;
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

/* Floating trigger buttons: desktop-hidden, since the panel is already
   visible inline there. */
.tab-fab {
  display: none;
}

.drawer-backdrop {
  display: none;
}

@media (max-width: 1024px) {
  .study-panel {
    border-left: none;
    border-top: 1px solid var(--border-color);
  }

  /* The drawer: fixed to the viewport regardless of where it sits in the
     document, off-screen by default, slides in from the right when open. */
  .tabs-drawer {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: min(88vw, 420px);
    background-color: var(--bg-panel);
    box-shadow: -12px 0 32px rgba(0, 0, 0, 0.5);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 220;
  }

  .tabs-drawer.open {
    transform: translateX(0);
  }

  .tabs-body {
    max-height: none;
    flex: 1;
  }

  .drawer-close {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
  }

  .drawer-close:hover {
    color: var(--text-primary);
  }

  .drawer-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 210;
  }

  .tab-fab {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    right: 16px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--accent-primary);
    color: #1d1811;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    z-index: 190;
    transition: transform 0.15s ease;
  }

  .tab-fab:active {
    transform: scale(0.94);
  }

  .tab-fab.crossref {
    bottom: 100px;
  }

  .tab-fab.interlinear {
    bottom: 32px;
  }

  .fab-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: var(--accent-secondary);
    color: var(--text-primary);
    font-size: 0.65rem;
    font-family: monospace;
    padding: 1px 5px;
    border-radius: 10px;
    min-width: 16px;
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
  }

  .tabs-drawer {
    width: 100vw;
  }
}
</style>

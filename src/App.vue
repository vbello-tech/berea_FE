<script setup>
import { onMounted } from 'vue';
import { useAppStore } from './stores/app';
import AppHeader from './components/AppHeader.vue';
import SidebarNav from './components/SidebarNav.vue';
import WordPopover from './components/WordPopover.vue';
import ToastNotification from './components/ToastNotification.vue';

const store = useAppStore();

// Mirrors the original's initial load: John 3:16-17 (KJV) on first paint.
onMounted(() => {
  store.loadPassage({ book: 'John', chapter: 3, start: 16, end: 17, translation: 'KJV' });
});
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <div class="app-container">
      <SidebarNav />
      <router-view />
    </div>
    <WordPopover />
    <ToastNotification />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 60px);
  overflow: hidden;
}

@media (max-width: 1024px) {
  .app-container {
    height: auto;
    overflow: visible;
    align-items: flex-start;
  }
}
</style>

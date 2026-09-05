<script setup>
import AppHeader from './components/AppHeader.vue';
import SidebarNav from './components/SidebarNav.vue';
import WordPopover from './components/WordPopover.vue';
import VersePreviewModal from './components/VersePreviewModal.vue';
import ToastNotification from './components/ToastNotification.vue';
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <div class="app-container">
      <SidebarNav />
      <router-view />
    </div>
    <WordPopover />
    <VersePreviewModal />
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
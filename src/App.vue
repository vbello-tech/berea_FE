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
  height: 100vh;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .app-shell {
    height: auto;
    overflow: visible;
  }

  .app-container {
    height: auto;
    overflow: visible;
    align-items: flex-start;
  }
}
</style>
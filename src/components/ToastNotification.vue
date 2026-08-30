<script setup>
import { useAppStore } from '../stores/app';

const store = useAppStore();
</script>

<template>
  <div class="toast" :class="{ show: store.toast.show, error: store.toast.isError }">
    <i :class="store.toast.isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'"></i>
    <span>{{ store.toast.message }}</span>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 300;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast i {
  color: var(--accent-success);
}

.toast.error i {
  color: var(--accent-error);
}
</style>

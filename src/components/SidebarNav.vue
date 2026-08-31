<script setup>
import { ref } from 'vue';

const active = ref('reader');
</script>

<template>
  <nav class="sidebar-nav" aria-label="Primary">
    <router-link to="/" custom v-slot="{ navigate, isActive }">
      <button
        type="button"
        class="nav-icon focus-ring"
        :class="{ active: isActive }"
        title="Scripture Reader"
        aria-label="Scripture Reader"
        :aria-pressed="isActive"
        @click="navigate"
      >
        <i class="fa-solid fa-book-open"></i>
      </button>
    </router-link>
    <router-link to="/search" custom v-slot="{ navigate, isActive }">
      <button
        type="button"
        class="nav-icon focus-ring"
        :class="{ active: isActive }"
        title="Search Scripture"
        aria-label="Search Scripture"
        :aria-pressed="isActive"
        @click="navigate"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </router-link>
    <button
      type="button"
      class="nav-icon focus-ring"
      :class="{ active: active === 'notes' }"
      title="Saved Notes"
      aria-label="Saved Notes"
      :aria-pressed="active === 'notes'"
      @click="active = 'notes'"
    >
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button
      type="button"
      class="nav-icon focus-ring"
      :class="{ active: active === 'settings' }"
      title="Settings"
      aria-label="Settings"
      :aria-pressed="active === 'settings'"
      style="margin-top: auto"
      @click="active = 'settings'"
    >
      <i class="fa-solid fa-gear"></i>
    </button>
  </nav>
</template>

<style scoped>
.sidebar-nav {
  width: 60px;
  background-color: var(--bg-panel);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 24px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  background: none;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.nav-icon:hover,
.nav-icon.active {
  background-color: var(--bg-card);
  color: var(--accent-primary);
}

@media (max-width: 1024px) {
  .sidebar-nav {
    align-self: flex-start;
    padding: 12px 0;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .sidebar-nav {
    width: 56px;
  }

  .nav-icon {
    width: 44px;
    height: 44px;
  }
}
</style>

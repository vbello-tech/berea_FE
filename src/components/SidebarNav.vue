<script setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();
const active = ref('reader');
</script>

<template>
  <!-- Desktop: persistent icon rail (unchanged). Hidden on mobile via CSS
       in favor of the hamburger-triggered menu below, freeing the full
       width for the Bible text. -->
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

  <!-- Mobile: hamburger-triggered menu (trigger button lives in
       AppHeader), slides in from the left. -->
  <div v-if="store.mobileMenuOpen" class="menu-backdrop" @click="store.closeMobileMenu()"></div>
  <nav class="mobile-menu" :class="{ open: store.mobileMenuOpen }" aria-label="Primary menu">
    <div class="mobile-menu-header">
      <span class="mobile-menu-title">Menu</span>
      <button type="button" class="menu-close" aria-label="Close menu" @click="store.closeMobileMenu()">&times;</button>
    </div>

    <router-link to="/" custom v-slot="{ navigate, isActive }">
      <button type="button" class="menu-item" :class="{ active: isActive }" @click="navigate(); store.closeMobileMenu()">
        <i class="fa-solid fa-book-open"></i>
        Scripture Reader
      </button>
    </router-link>
    <router-link to="/search" custom v-slot="{ navigate, isActive }">
      <button type="button" class="menu-item" :class="{ active: isActive }" @click="navigate(); store.closeMobileMenu()">
        <i class="fa-solid fa-magnifying-glass"></i>
        Search Scripture
      </button>
    </router-link>
    <button type="button" class="menu-item" :class="{ active: active === 'notes' }" @click="active = 'notes'; store.closeMobileMenu()">
      <i class="fa-solid fa-pen-to-square"></i>
      Saved Notes
    </button>
    <button type="button" class="menu-item" :class="{ active: active === 'settings' }" @click="active = 'settings'; store.closeMobileMenu()">
      <i class="fa-solid fa-gear"></i>
      Settings
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

.menu-backdrop,
.mobile-menu {
  display: none;
}

@media (max-width: 1024px) {
  /* Hide the icon rail entirely on mobile — the reader gets the full
     width, and navigation moves to the hamburger menu instead. */
  .sidebar-nav {
    display: none;
  }

  .menu-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 210;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: min(80vw, 300px);
    background-color: var(--bg-panel);
    border-right: 1px solid var(--border-color);
    box-shadow: 12px 0 32px rgba(0, 0, 0, 0.5);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 220;
    padding: 8px;
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 14px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 8px;
  }

  .mobile-menu-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .menu-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    padding: 4px;
  }

  .menu-close:hover {
    color: var(--text-primary);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 12px;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
  }

  .menu-item i {
    width: 20px;
    text-align: center;
    color: var(--text-muted);
  }

  .menu-item:hover {
    background-color: var(--bg-card);
  }

  .menu-item.active {
    color: var(--accent-primary);
    background-color: var(--bg-card);
  }

  .menu-item.active i {
    color: var(--accent-primary);
  }
}
</style>

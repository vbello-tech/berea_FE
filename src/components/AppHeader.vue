<script setup>
import { useAppStore } from '../stores/app';

const store = useAppStore();
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button type="button" class="hamburger focus-ring" aria-label="Open menu" @click="store.toggleMobileMenu()">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="brand">
        <i class="fa-solid fa-book-bible"></i>
        <span>Berea</span>
      </div>
    </div>

    <div class="user-nav">
      <div v-if="!store.isLoggedIn" class="auth-links">
        <router-link to="/login" class="btn-fetch btn-compact btn-secondary">Log In</router-link>
        <router-link to="/register" class="btn-fetch btn-compact">Sign Up</router-link>
      </div>

      <div v-else class="auth-loggedin">
        <span class="workspace-label">{{ store.username }}'s Workspace</span>
        <div class="user-avatar">{{ store.username.charAt(0).toUpperCase() }}</div>
        <button type="button" class="btn-fetch btn-compact btn-secondary" @click="store.logout()">Log Out</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  position: sticky;
  top: 0;
  z-index: 150;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger {
  display: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.35rem;
  color: var(--text-primary);
  letter-spacing: 0.2px;
  flex-shrink: 0;
}

.brand i {
  color: var(--accent-primary);
  font-size: 1.3rem;
}

.user-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.auth-links,
.auth-loggedin {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-loggedin {
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-main);
  font-weight: 600;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.btn-fetch {
  background-color: var(--accent-primary);
  color: #1d1811;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-fetch:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-compact {
  padding: 6px 12px;
}

.btn-secondary {
  background-color: var(--bg-input);
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: var(--radius-md);
  }

  .hamburger:hover {
    background-color: var(--bg-card);
  }
}

@media (max-width: 480px) {
  .brand {
    font-size: 1.15rem;
  }

  .btn-compact {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .workspace-label {
    display: none;
  }
}
</style>

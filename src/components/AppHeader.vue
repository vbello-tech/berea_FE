<script setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();
const username = ref('');
const password = ref('');

function submit(endpoint) {
  store.handleAuth(endpoint, username.value.trim(), password.value);
  password.value = '';
}
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <i class="fa-solid fa-book-bible"></i>
      <span>Berea</span>
    </div>

    <div class="user-nav">
      <div v-if="!store.isLoggedIn" class="auth-controls">
        <input
          v-model="username"
          type="text"
          class="input-control auth-input"
          placeholder="Username"
          autocomplete="username"
          @keydown.enter="submit('login')"
        />
        <input
          v-model="password"
          type="password"
          class="input-control auth-input"
          placeholder="Password"
          autocomplete="current-password"
          @keydown.enter="submit('login')"
        />
        <button type="button" class="btn-fetch btn-compact" @click="submit('login')">Log In</button>
        <button type="button" class="btn-fetch btn-compact btn-secondary" @click="submit('register')">Sign Up</button>
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

.auth-controls,
.auth-loggedin {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
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

.input-control {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-control:focus {
  border-color: var(--border-focus);
}

.auth-input {
  width: 110px;
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

/* Phone: allow the auth row to wrap under the brand rather than overflow */
@media (max-width: 560px) {
  .app-header {
    flex-wrap: wrap;
    row-gap: 10px;
    padding: 12px 16px;
  }

  .user-nav {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Phone: shrink controls and drop non-essential text so everything fits
   without horizontal scrolling. */
@media (max-width: 480px) {
  .brand {
    font-size: 1.15rem;
  }

  .auth-input {
    width: 130px;
    padding: 8px 10px;
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

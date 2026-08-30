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
          class="input-control"
          placeholder="Username"
          style="width: 110px"
          autocomplete="username"
          @keydown.enter="submit('login')"
        />
        <input
          v-model="password"
          type="password"
          class="input-control"
          placeholder="Password"
          style="width: 110px"
          autocomplete="current-password"
          @keydown.enter="submit('login')"
        />
        <button type="button" class="btn-fetch btn-compact" @click="submit('login')">Log In</button>
        <button type="button" class="btn-fetch btn-compact btn-secondary" @click="submit('register')">Sign Up</button>
      </div>

      <div v-else class="auth-loggedin">
        <span>{{ store.username }}'s Workspace</span>
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
  height: 60px;
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

.btn-fetch {
  background-color: var(--accent-primary);
  color: #1d1811;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
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
</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';

const store = useAppStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const submitting = ref(false);
const error = ref('');

async function submit() {
  if (!username.value.trim() || !password.value) {
    error.value = 'Enter a username and password.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords don\u2019t match.';
    return;
  }
  error.value = '';
  submitting.value = true;
  const ok = await store.handleAuth('register', username.value.trim(), password.value);
  submitting.value = false;
  if (ok) {
    router.push('/');
  } else {
    error.value = 'Couldn\u2019t create that account. The username may already be taken.';
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card" @submit.prevent="submit">
      <div class="auth-brand">
        <i class="fa-solid fa-book-bible"></i>
        <span>Berea</span>
      </div>
      <h2 class="auth-title">Sign Up</h2>
      <p class="auth-subtitle">Create an account to save personal notes on any passage.</p>

      <div class="field">
        <label for="register-username">Username</label>
        <input id="register-username" v-model="username" type="text" autocomplete="username" autofocus />
      </div>
      <div class="field">
        <label for="register-password">Password</label>
        <input id="register-password" v-model="password" type="password" autocomplete="new-password" />
      </div>
      <div class="field">
        <label for="register-confirm">Confirm Password</label>
        <input id="register-confirm" v-model="confirmPassword" type="password" autocomplete="new-password" />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button type="submit" class="btn-primary" :disabled="submitting">
        <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
        {{ submitting ? 'Creating account…' : 'Sign Up' }}
      </button>

      <p class="auth-switch">
        Already have an account?
        <router-link to="/login">Log in</router-link>
      </p>
    </form>
  </main>
</template>

<style scoped>
.auth-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.auth-brand i {
  color: var(--accent-primary);
  font-size: 1.25rem;
}

.auth-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
}

.auth-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 12px 14px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.field input:focus {
  border-color: var(--border-focus);
}

.auth-error {
  color: var(--accent-error);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.btn-primary {
  background-color: var(--accent-primary);
  color: #1d1811;
  border: none;
  border-radius: var(--radius-md);
  padding: 13px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;
  margin-top: 8px;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: default;
}

.auth-switch {
  text-align: center;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-top: 20px;
}

.auth-switch a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>

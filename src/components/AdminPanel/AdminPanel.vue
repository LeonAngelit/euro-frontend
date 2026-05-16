<script setup lang="ts">
import Form from '../Form/Form.vue'

interface AdminPanelProps {
  action: (event: Event) => void
  refer: (el: any) => void
  error: any
  close: () => void
}

defineProps<AdminPanelProps>()
</script>

<template>
  <div>
    <div class="background"></div>
    <div class="admin-panel">
      <button class="close-panel-button" @click="close">
        X
      </button>
      <Form :action="action" :error="error" :submitValue="$t('adminPanel.enter')" :showPassword="true" :fields="[
        {
          name: 'password',
          placeholder: $t('adminPanel.passwordPlaceholder'),
          id: 'passwordField',
          type: 'password',
          setRef: refer,
        },
      ]" />
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  display: block;
  position: absolute;
  width: 90%;
  border: 1px solid var(--primary-color);
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
}

.background {
  display: block;
  width: 100%;
  height: 100vh;
  z-index: 98;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
}

.close-panel-button {
  display: block;
  width: 10%;
  margin: 0.5rem auto;
  background-color: var(--euro-pink);
  border: none;
  padding: 0.2rem;
  border-radius: 50%;
}
</style>
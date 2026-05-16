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

<style src="../../Components/AdminPanel/AdminPanel.component.css"></style>
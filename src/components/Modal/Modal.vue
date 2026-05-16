<script setup lang="ts">

interface ModalProps {
  message?: string
  status?: string
  onclick?: () => void
  onaccept?: () => void
  confirm?: boolean
  component?: any
}

defineProps<ModalProps>()
</script>

<template>
  <div class="modal-container">
    <div
      :class="
        status == 'success'
          ? 'modal success-modal'
          : status == 'error'
            ? 'modal error-modal'
            : component
              ? 'modal modal-component'
              : 'modal'
      "
    >
      <button class="modal-button" @click="onclick && onclick()">
        <p>X</p>
      </button>
      <template v-if="!component">
        <p>{{ message }}</p>
        <div v-if="confirm" class="modal-action-buttons">
          <button class="action-btn" @click="onaccept && onaccept()">
            {{ $t('modal.accept') }}
          </button>
          <button class="action-delete-btn" @click="onclick && onclick()">
            {{ $t('modal.cancel') }}
          </button>
        </div>
      </template>
      <component :is="component" v-if="component" />
    </div>
  </div>
</template>

<style src="../../Components/Modal/Modal.component.css"></style>
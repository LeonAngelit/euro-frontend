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
    <div :class="status == 'success'
        ? 'modal success-modal'
        : status == 'error'
          ? 'modal error-modal'
          : component
            ? 'modal modal-component'
            : 'modal'
      ">
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

<style scoped>
#root > div.modal-container {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 80;
  background-color: rgba(2, 2, 94, 0.85);
  backdrop-filter: blur(4px);
}


.modal {
  width: 70%;
  background-color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  font-size: 1rem;
  position: absolute;
  top: 101px;
  right: 9px;
  animation: slideIn 0.2s ease-out forwards;
  border: 2px solid var(--euro-pink);
  box-shadow: 0 0 30px rgba(255, 0, 135, 0.2);
  color: white;
}

.modal.modal-component{
  right: 16%;
  border: 1px solid var(--primary-color);
  animation: none;
}

.password-container {
  position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
}

@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-button {
  position: absolute;
  top: 5%;
  right: 2%;
  width: 2em;
  height: 2em;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--euro-pink);
}

.modal-action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  width: 80%;
}

.modal-action-buttons > button {
  width: 40%;
}

.modal-button > p {
  font-size: 1rem;
}

.modal-button:active {
  color: white;
  background-color: grey;
}

.success-modal {
  background: linear-gradient(135deg, var(--euro-gold) 0%, rgb(180, 150, 20) 100%);
  font-weight: bold;
  color: var(--primary-color);
  border-color: var(--euro-gold);
}

.error-modal {
  background: linear-gradient(135deg, rgb(164, 8, 8) 0%, rgb(120, 0, 0) 100%);
  font-weight: bold;
  color: white;
  border-color: rgb(255, 60, 60);
}

.action-btn,
.action-delete-btn {
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 0.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn {
  background-color: var(--euro-pink);
  box-shadow: 0 0 10px rgba(255, 0, 135, 0.3);
}
.action-btn:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 16px rgba(255, 0, 135, 0.5);
}
.action-delete-btn {
  background-color: rgb(164, 8, 8);
}
.action-delete-btn:hover {
  background-color: rgb(200, 20, 20);
}
.modal-container p {
  text-align: center;
}


@media (min-width: 1000px) {

  .modal {
    width: 30%;
  }
  
 

}
</style>
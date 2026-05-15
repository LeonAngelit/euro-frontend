<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../../stores/app'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

interface FormField {
  name: string
  placeholder?: string
  label?: string
  id?: string
  type?: string
  ref?: HTMLInputElement | null
  required?: boolean
}

interface FormProps {
  action: (event: Event) => void | Promise<void>
  error?: any
  submitValue?: string
  showPassword?: boolean
  remember?: boolean
  fields: FormField[]
  preview?: string | null
  default?: string
  onImageChange?: (event: Event) => void
}

const props = withDefaults(defineProps<FormProps>(), {
  submitValue: 'Submit',
  showPassword: false,
  remember: false,
  preview: null,
})

const store = useAppStore()
const showPassword = ref<string[]>([])
const showButton = ref<string[]>([])

function togglePassword(event: Event) {
  event.preventDefault()
  const button = event.currentTarget as HTMLButtonElement
  const id = button.id || ''
  if (showPassword.value.includes(id)) {
    showPassword.value = showPassword.value.filter((i) => i !== id)
    showButton.value = showButton.value.filter((i) => i !== id)
  } else {
    showPassword.value = [...showPassword.value, id]
    showButton.value = [...showButton.value, id]
  }
}

function handlePasswordChange(event: Event, fieldRef?: HTMLInputElement | null) {
  const input = event.target as HTMLInputElement
  const id = input.id || ''
  if (input.value.length > 0) {
    if (!showButton.value.includes(id)) {
      showButton.value = [...showButton.value, id]
    }
  } else {
    showButton.value = showButton.value.filter((i) => i !== id)
  }
}

function storeLocal(event: Event) {
  const checkbox = event.target as HTMLInputElement
  if (checkbox.checked) {
    store.setRememberUser(true)
  } else {
    store.setRememberUser(false)
  }
}
</script>

<template>
  <div class="login-form">
    <form @submit.prevent="action">
      <template v-for="(field, index) in fields" :key="index">
        <div class="input-container">
          <label v-if="field.label" :for="field.name">{{ field.label }}</label>
          <div v-if="props.preview" class="profile-button">
            <img :src="props.preview" alt="Profile Preview" style="width: 100px; height: 100px; border-radius: 50%;" />
          </div>
          <div v-if="field.type === 'password'" class="password-wrapper">
            <input
              :type="showPassword.includes(field.id || '') ? 'text' : 'password'"
              :placeholder="field.placeholder"
              :name="field.name"
              :defaultValue="props.default"
              :id="field.id || ''"
              :ref="(el: any) => { if (field.ref && el) field.ref = el }"
              @change="(e: Event) => handlePasswordChange(e, field.ref)"
              :required="field.required"
            />
            <button
              v-if="showPassword"
              type="button"
              @click="togglePassword"
              :name="'passtoggle'"
              :id="field.id || ''"
            >
              <FontAwesomeIcon
                v-if="showButton.includes(field.id || '')"
                :icon="showPassword.includes(field.id || '') ? faEyeSlash : faEye"
              />
            </button>
          </div>
          <input
            v-else
            :type="field.type || 'text'"
            :placeholder="field.placeholder"
            :name="field.name"
            :defaultValue="props.default"
            :id="field.id || ''"
            :ref="(el: any) => { if (field.ref && el) field.ref = el }"
            @change="props.onImageChange"
            :required="field.required"
          />
</div>
      </template>
      <div v-if="remember" class="checkbox-container">
        <input type="checkbox" @click="storeLocal" name="passtoggle" />
        <label for="passtoggle">Mantener sesión</label>
      </div>
      <div v-if="error?.status" class="error-span">
        {{ error.message }}
      </div>
      <div class="submit-container">
        <input type="submit" :value="submitValue" />
      </div>
     </form>
   </div>
</template>

<style src="../../Components/Form/Form.Component.css"></style>
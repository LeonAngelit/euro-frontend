<script setup lang="ts">
import { ref } from 'vue' // Removed toRaw and type Ref
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const { t } = useI18n()

interface FormField {
  name: string
  placeholder?: string
  label?: string
  id?: string
  type?: string
  // Use a callback function instead of passing a Ref object
  setRef?: (el: any) => void
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

// Removed the unused fieldRef parameter since we only need the event target
function handlePasswordChange(event: Event) {
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
            <img :src="props.preview" :alt="t('form.profilePreview')"
              style="width: 100px; height: 100px; border-radius: 50%;" />
          </div>
          <div v-if="field.type === 'password'" class="password-wrapper">
            <input :type="showPassword.includes(field.id || '') ? 'text' : 'password'" :placeholder="field.placeholder"
              :name="field.name" :defaultValue="props.default" :id="field.id || ''"
              :ref="(el: any) => { if (field.setRef) field.setRef(el) }" @change="handlePasswordChange"
              :required="field.required" />
            <button v-if="showPassword" type="button" @click="togglePassword" :name="'passtoggle'" :id="field.id || ''">
              <FontAwesomeIcon v-if="showButton.includes(field.id || '')"
                :icon="showPassword.includes(field.id || '') ? faEyeSlash : faEye" />
            </button>
          </div>
          <input v-else :type="field.type || 'text'" :placeholder="field.placeholder" :name="field.name"
            :defaultValue="props.default" :id="field.id || ''"
            :ref="(el: any) => { if (field.setRef) field.setRef(el) }" @change="props.onImageChange"
            :required="field.required" />
        </div>
      </template>
      <div v-if="remember" class="checkbox-container">
        <input type="checkbox" @click="storeLocal" name="passtoggle" />
        <label for="passtoggle">{{ t('form.rememberSession') }}</label>
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

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 30%;
  margin: 1rem auto;
}

.login-form span {
  margin: 1rem auto;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  width: 100%;
}

.input-container>input {
  border: none;
  border-bottom: 1px solid var(--primary-color);
  width: 50%;
  text-align: center;
  margin-top: 1rem;
}

.input-container input:focus {
  outline: none;
  background: none;
}

.submit-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.checkbox-container {
  width: 70%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.checkbox-container>input {
  margin-right: 1rem;
}

.submit-container input {
  min-width: 30%;
  padding: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
}

.submit-container input:hover {
  background-color: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  cursor: pointer;
}
.password-wrapper {
  position: relative;
  display: flex;
  width: 50%;
  justify-content: center;
}

.password-wrapper >input {
  border: none;
  border-bottom: 1px solid var(--primary-color);
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

.password-wrapper button {
  position: absolute;
  bottom: 0;
  right: 0;
  background: none;
  border: none;
}
@media (max-width: 700px) {
  .login-form {
    width: 90%;
  }
}

@media (min-width: 1000px) {

  .login-form {
    display: flex;
    border: 1px solid var(--primary-color);
    margin-top: 5rem;
    width: 100%;
    max-width: 500px;
  }

  .checkbox-container {
    justify-content: center;
  }
  
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import CountryPicker from '../../components/CountryPicker/CountryPicker.vue'
import Collapsible from '../../components/Collapsible/Collapsible.vue'
import Form from '../../components/Form/Form.vue'
import axios from 'axios'
import { validateEmailRegex, validateRegex, validateUserNameRegex } from '../../utils/regexUtils'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
const preview = ref<string | null>(null)
const error = ref<any>({})
const currentCollapsed = ref(true)
const passRef = ref<HTMLInputElement | null>(null)
const pass2Ref = ref<HTMLInputElement | null>(null)
const userNameRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const colorRef = ref<HTMLInputElement | null>(null)
const imageRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    if (window.location.pathname == '/join-room' || window.location.href.includes(config.confirmemailLink)) {
      useNavigateWithCallback(router, '/login?callback_url=' + window.location.href)
    } else {
      useNavigateWithCallback(router, '/login')
    }
  }
  if ((store.userLogged as any)?.email == null && !window.location.href.includes(config.confirmemailLink)) {
    useNavigateWithCallback(router, '/missing-email')
  }
})

function handleCollapsed() {
  currentCollapsed.value = !currentCollapsed.value
}

async function updateUserData(event: Event, data: any) {
  await axios
    .put(
      `${config.baseUrl}users/${(store.userLogged as any)?.id}`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    .then((response) => {
      if (response.status == 200) {
        store.setModal({
          visible: true,
          message: t('layout.updateSuccess'),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
        store.setUserLogged(response.data)
      }
    })
    .catch((error) => {
      store.setModal({
        visible: true,
        message: error.response?.data?.message,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
    })
}

function updateUserName(event: Event) {
  event.preventDefault()
  if (
    !validateUserNameRegex(userNameRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: t('validation.invalidUsername'),
      },
    )
  ) {
    return
  }
  updateUserData(event, { username: userNameRef.value?.value })
}

function updateEmail(event: Event) {
  event.preventDefault()
  if (
    !validateEmailRegex(emailRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: t('validation.invalidEmail'),
      },
    )
  ) {
    return
  }
  updateUserData(event, { email: emailRef.value?.value })
}

function updateColor(event: Event) {
  event.preventDefault()
  updateUserData(event, { color: colorRef.value?.value })
}

function updatePassword(event: Event) {
  event.preventDefault()
  if (passRef.value?.value != pass2Ref.value?.value) {
    error.value = { status: true, message: t('validation.passwordsDontMatch') }
    return
  }
  if (
    !validateRegex(passRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: t('validation.invalidPassword'),
      },
    )
  ) {
    return
  }
  updateUserData(event, { password: passRef.value!.value })
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    preview.value = URL.createObjectURL(target.files[0])
  }
}

async function updateImage(event: Event) {
  event.preventDefault()
  if (!imageRef.value?.files?.[0]) return
  const formData = new FormData()
  formData.append('image', imageRef.value.files[0])
  updateUserData(event, formData)
}

function onImageChange(event: Event) {
  handleImageChange(event)
}
</script>

<template>
  <div class="container details-container">
    <div class="section-one">
      <Collapsible :title="$t('userDetails.updateUsername')">
        <Form :action="updateUserName" :error="error" :submitValue="$t('userDetails.update')" :fields="[
          {
            name: 'username',
            placeholder: $t('userDetails.usernamePlaceholder'),
            type: 'text',
            setRef: (el: any) => userNameRef = el,
            required: true,
          },
        ]" />
      </Collapsible>

      <Collapsible :title="$t('userDetails.updateEmail')">
        <Form :action="updateEmail" :error="error" :submitValue="$t('userDetails.update')" :fields="[
          {
            name: 'email',
            placeholder: $t('userDetails.emailPlaceholder'),
            type: 'email',
            setRef: (el: any) => emailRef = el,
            required: true,
          },
        ]" />
      </Collapsible>

      <Collapsible :title="$t('userDetails.updatePassword')">
        <Form :action="updatePassword" :error="error" :submitValue="$t('userDetails.update')" :showPassword="true"
          :fields="[
            {
              name: 'password',
              placeholder: $t('userDetails.passwordPlaceholder'),
              id: 'passwordField',
              type: 'password',
              setRef: (el: any) => passRef = el,
              required: true,
            },
            {
              name: 'password2',
              placeholder: $t('userDetails.repeatPasswordPlaceholder'),
              id: 'passwordTwoField',
              type: 'password',
              setRef: (el: any) => pass2Ref = el,
              required: true,
            },
          ]" />
      </Collapsible>

      <Collapsible :title="$t('userDetails.updateImage')">
        <Form :action="updateImage" :error="error" :submitValue="$t('userDetails.update')" :preview="preview"
          :onImageChange="onImageChange" :fields="[
            {
              name: 'image',
              type: 'file',
              setRef: (el: any) => imageRef = el,
              required: false,
            },
          ]" />
      </Collapsible>

      <Collapsible :title="$t('userDetails.updateColor')">
        <Form :action="updateColor" :error="error" :submitValue="$t('userDetails.update')" :fields="[
          {
            name: 'color',
            placeholder: $t('userDetails.colorPlaceholder'),
            type: 'color',
            setRef: (el: any) => colorRef = el,
            required: true,
          },
        ]" />
      </Collapsible>

      <Collapsible :title="$t('userDetails.selectedCountries')" :collapsed="currentCollapsed" @toggle="handleCollapsed">
        <CountryPicker :additionalAction="handleCollapsed" />
      </Collapsible>
    </div>

    <div class="section-two">
      <button class="delete-user-button">{{ $t('userDetails.deleteAccount') }}</button>
    </div>
  </div>
</template>

<style scoped>
.user-form {
  display: flex;
  justify-content: space-around;
}

.form-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
}

.input-container > div {
  width: 50%;
  margin: 0 auto;
}

.input-container > select {
  width: 30%;
  margin-top: 1rem;
}

.action-btn {
  border: none;
  background-color: var(--primary-color);
  color: whitesmoke;
  width: 30%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.action-delete-btn {
  border: none;
  background-color: var(--error-color);
  color: whitesmoke;
  width: 30%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.action-btn:hover {
  border: 1px solid var(--primary-color);
  background-color: whitesmoke;
  color: var(--primary-color);
}

.submit-usuario-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.submit-usuario-container input {
  width: 30%;
  padding: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
}

.submit-usuario-container input:hover {
  background-color: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  cursor: pointer;
}

.delete-user-button {
  display: none;
}

@media (max-width: 420px) {
  .submit-usuario-container input,
  .submit-usuario-container .action-btn {
    width: 100%;
  }

  .submit-usuario-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .user-form {
    flex-direction: column;
    align-items: center;
  }
}
</style>
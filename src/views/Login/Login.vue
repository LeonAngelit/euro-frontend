<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GoogleLogin } from 'vue3-google-login'
import { useAppStore } from '@/stores/app.js'
import axios from 'axios'
import { validateEmailRegex, validateRegex, validateUserNameRegex } from '@/utils/regexUtils.js'
import Form from '@/components/Form/Form.vue'
import config from '@/config/config.js'
import useNavigateWithCallback from '@/composables/useNavigateWithCallback.js'
import useGetAuthToken from '@/composables/useGetAuthToken.js'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
const passwordRef = ref<HTMLInputElement | null | undefined>(null)
const userNameRef = ref<HTMLInputElement | null | undefined>(null)
const callbackUrl = ref('')
const error = ref<any>(false)

watch(() => store.userLogged, () => {
  if (store.userLogged) {
    useNavigateWithCallback(router, '/app')
  }
})

onMounted(() => {
  if (window.location.href.includes('callback_url')) {
    callbackUrl.value = '?callback_url=' + window.location.href.split('callback_url=')[1]
  }
})

async function googleLogin(data: any) {
  const token = await useGetAuthToken(store)
  try {
    const response = await axios.post(
      `${config.baseUrl}users/google-login`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: token,
        },
      },
    )
    if (response.status === 200) {
      store.setXToken(`${response.data.token}`)
      store.setUserLogged(response.data.user)
    } else {
      error.value = {
        status: true,
        message: t('error.wrongCredentials'),
      }
    }
  } catch (err: any) {
    if (err?.response?.status === 404) {
      error.value = {
        status: true,
        message: t('error.userNotFound'),
      }
    } else {
      error.value = {
        status: true,
        message: err?.response?.data?.message || t('error.serverError'),
      }
    }
  }
}

async function login(event: Event) {
  event.preventDefault()

  const token = await useGetAuthToken(store)
  if (!token) {
    error.value = { status: true, message: t('error.invalidToken') }
    return
  }


  if (!(validateUserNameRegex(userNameRef.value?.value || '') || validateEmailRegex(userNameRef.value?.value || ''))) {
    error.value = {
      status: true,
      message: t('login.usernameLabel'),
    }
    return
  }

  if (
    passwordRef.value?.value &&
    !validateRegex(passwordRef.value.value, () =>
      error.value = {
        status: true,
        message: t('validation.invalidPassword'),
      },
    )
  ) {
    return
  }

  const data = {
    name: userNameRef.value?.value,
    password: passwordRef.value?.value?.split('').reverse().join(''),
  }

  try {
    const response = await axios.post(
      `${config.baseUrl}users/login`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: token,
        },
      },
    )
    if (response.status === 200) {
      store.setXToken(`${response.data.token}`)
      store.setUserLogged(response.data.user)
    } else {
      error.value = {
        status: true,
        message: t('error.wrongCredentials'),
      }
    }
  } catch (err: any) {
    error.value = {
      status: true,
      message: err?.response?.data?.message || t('error.serverError'),
    }
  }
}
</script>

<template>
  <div class="container">
    <Form :action="login" :error="error" :submitValue="t('login.title')" :showPassword="true" :remember="true" :fields="[
      {
        name: 'username',
        label: t('login.usernameLabel'),
        type: 'text',
        setRef: (el: any) => userNameRef = el, // Triggers the callback to bind the element
        required: true,
      },
      {
        name: 'password',
        label: t('login.passwordLabel'),
        id: 'passwordField',
        type: 'password',
        setRef: (el: any) => passwordRef = el, // Triggers the callback to bind the element
        required: true,
      },
    ]" />
    <div class="subtitle">
      <p>
        {{ t('login.subtitle') }} <router-link :to="'/signup' + callbackUrl">{{ $t('login.createAccount')
          }}</router-link>
      </p>
      <GoogleLogin :callback="googleLogin" :error="() => console.error(t('login.loginFailed'))" />
    </div>
  </div>
</template>
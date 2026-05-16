<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GoogleLogin } from 'vue3-google-login'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import Form from '../../components/Form/Form.vue'
import { validateRegex, validateUserNameRegex, validateEmailRegex } from '../../utils/regexUtils'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useGetAuthToken from '../../composables/useGetAuthToken'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
const passwordRef = ref<HTMLInputElement | null>(null)
const passwordTwodRef = ref<HTMLInputElement | null>(null)
const userNameRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const error = ref<any>(false)

watch(() => store.userLogged, () => {
  if (store.userLogged) {
    useNavigateWithCallback(router, '/app')
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
    error.value = {
      status: true,
      message: err?.response?.data?.message || t('error.serverError'),
    }
  }
}

async function createNewUser(event: Event) {
  event.preventDefault()
  const token = await useGetAuthToken(store)
  if (!token) {
    error.value = { status: true, message: t('error.invalidToken') }
    return
  }

  if (!validateUserNameRegex(userNameRef.value?.value || '')) {
    error.value = {
      status: true,
      message: t('validation.invalidUsername'),
    }
    return
  }

  if (!validateEmailRegex(emailRef.value?.value || '')) {
    error.value = {
      status: true,
      message: t('validation.invalidEmail'),
    }
    return
  }

  if (
    passwordRef.value?.value !== passwordTwodRef.value?.value
  ) {
    error.value = {
      status: true,
      message: t('validation.passwordsDontMatch'),
    }
    return
  }

  if (
    !validateRegex(passwordRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: t('validation.invalidPassword'),
      },
    )
  ) {
    return
  }

  const data = {
    username: userNameRef.value?.value,
    email: emailRef.value?.value,
    password: passwordRef.value!.value?.split('').reverse().join(''),
  }

  try {
    const response = await axios.post(
      `${config.baseUrl}users/signup`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: token,
        },
      },
    )
    if (response.status == 201) {
      store.setXToken(response.data.token)
      store.setUserLogged(response.data.user)
    } else {
      error.value = {
        status: true,
        message: t('error.createUser'),
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
    <Form :action="createNewUser" :error="error" :showPassword="true" :submitValue="$t('signup.register')"
      :remember="true" :fields="[
        {
          name: 'username',
          placeholder: $t('signup.usernamePlaceholder'),
          type: 'text',
          setRef: (el: any) => userNameRef = el,
          required: true,
        },
        {
          name: 'email',
          placeholder: $t('signup.emailPlaceholder'),
          type: 'email',
          setRef: (el: any) => emailRef = el,
          required: true,
        },
        {
          name: 'password',
          placeholder: $t('signup.passwordPlaceholder'),
          type: 'password',
          id: 'passwordOne',
          setRef: (el: any) => passwordRef = el,
          required: true,
        },
        {
          name: 'password2',
          placeholder: $t('signup.repeatPasswordPlaceholder'),
          id: 'passwordTwo',
          type: 'password',
          setRef: (el: any) => passwordTwodRef = el,
          required: true,
        },
      ]" />
    <div class="google-container">
      <GoogleLogin :callback="googleLogin" :error="() => console.error(t('signup.loginFailed'))" />
    </div>
  </div>
</template>
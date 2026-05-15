<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import { validateEmailRegex, validateRegex, validateUserNameRegex } from '../../utils/regexUtils'
import Form from '../../components/Form/Form.vue'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useGetAuthToken from '../../composables/useGetAuthToken'

const store = useAppStore()
const router = useRouter()
const passwordRef = ref<HTMLInputElement | null>(null)
const userNameRef = ref<HTMLInputElement | null>(null)
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
        message: 'Usuario o contraseña incorrectos',
      }
    }
  } catch (err: any) {
    if (err?.response?.status === 404) {
      error.value = {
        status: true,
        message: 'Usuario no encontrado',
      }
    } else {
      error.value = {
        status: true,
        message: err?.response?.data?.message || 'Error de servidor',
      }
    }
  }
}

async function login(event: Event) {
  event.preventDefault()

  const token = await useGetAuthToken(store)
  if (!token) {
    error.value = { status: true, message: 'Token inválido' }
    return
  }

  if (!(validateUserNameRegex(userNameRef.value?.value || '') || validateEmailRegex(userNameRef.value?.value || ''))) {
    error.value = {
      status: true,
      message: 'Nombre de usuario o email no válido',
    }
    return
  }

  if (
    passwordRef.value?.value &&
    !validateRegex(passwordRef.value.value, () =>
      error.value = {
        status: true,
        message: 'Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula',
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
        message: 'Usuario o contraseña incorrectos',
      }
    }
  } catch (err: any) {
    error.value = {
      status: true,
      message: err?.response?.data?.message || 'Error de servidor',
    }
  }
}
</script>

<template>
  <div class="container">
    <Form :action="login" :error="error" submitValue="Login" :showPassword="true" :remember="true" :fields="[
      {
        name: 'username',
        label: 'Nombre de usuario o email',
        type: 'text',
        ref: userNameRef,
        required: true,
      },
      {
        name: 'password',
        label: 'Contraseña',
        id: 'passwordField',
        type: 'password',
        ref: passwordRef,
        required: true,
      },
    ]" />
    <div class="subtitle">
      <p>
        Inicia sesión o <router-link :to="'/signup' + callbackUrl">Crea una cuenta</router-link>
      </p>
      <GoogleLogin :callback="googleLogin" :error="() => console.error('Login Failed')" />
    </div>
  </div>
</template>
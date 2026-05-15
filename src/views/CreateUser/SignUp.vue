<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import Form from '../../components/Form/Form.vue'
import { validateRegex, validateUserNameRegex, validateEmailRegex } from '../../utils/regexUtils'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useGetAuthToken from '../../composables/useGetAuthToken'

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

async function createNewUser(event: Event) {
  event.preventDefault()
  const token = await useGetAuthToken(store)
  if (!token) {
    error.value = { status: true, message: 'Token inválido' }
    return
  }

  if (!validateUserNameRegex(userNameRef.value?.value || '')) {
    error.value = {
      status: true,
      message: 'Nombre de usuario no válido, debe contener 5 a 25 caracteres, evita caracteres especiales',
    }
    return
  }

  if (!validateEmailRegex(emailRef.value?.value || '')) {
    error.value = {
      status: true,
      message: 'Correo electrónico no válido',
    }
    return
  }

  if (
    passwordRef.value?.value !== passwordTwodRef.value?.value
  ) {
    error.value = {
      status: true,
      message: 'Las contraseñas no coinciden',
    }
    return
  }

  if (
    !validateRegex(passwordRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: 'Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula',
      },
    )
  ) {
    return
  }

  const data = {
    username: userNameRef.value?.value,
    email: emailRef.value?.value,
    password: passwordRef.value!.value,
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
        message: 'Error al crear el usuario',
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
    <Form
      :action="createNewUser"
      :error="error"
      :showPassword="true"
      submitValue="Registrarse"
      :remember="true"
      :fields="[
        {
          name: 'username',
          placeholder: 'Nombre de usuario',
          type: 'text',
          ref: userNameRef,
          required: true,
        },
        {
          name: 'email',
          placeholder: 'Correo electrónico',
          type: 'email',
          ref: emailRef,
          required: true,
        },
        {
          name: 'password',
          placeholder: 'Contraseña',
          type: 'password',
          id: 'passwordOne',
          ref: passwordRef,
          required: true,
        },
        {
          name: 'password2',
          placeholder: 'Repetir contraseña',
          id: 'passwordTwo',
          type: 'password',
          ref: passwordTwodRef,
          required: true,
        },
      ]"
    />
    <div class="google-container">
      <GoogleLogin
        :callback="googleLogin"
        :error="() => console.error('Login Failed')"
      />
    </div>
  </div>
</template>
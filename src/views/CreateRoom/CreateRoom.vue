<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'
import useUpdateUserData from '../../composables/useUpdateUserData'
import { validateRegex, validateUserNameRegex } from '../../utils/regexUtils'
import Form from '../../components/Form/Form.vue'
import config from '../../config/config'

const store = useAppStore()
const router = useRouter()
const passwordRef = ref<HTMLInputElement | null>(null)
const passwordTwodRef = ref<HTMLInputElement | null>(null)
const roomNameRef = ref<HTMLInputElement | null>(null)
const error = ref<any>(false)

onMounted(async () => {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    router.push('/login')
  }
})

async function crearSala(event: Event) {
  event.preventDefault()

  if (!validateUserNameRegex(roomNameRef.value?.value || '')) {
    error.value = {
      status: true,
      message: 'Nombre de sala no válido',
    }
    return
  }

  if (passwordRef.value?.value !== passwordTwodRef.value?.value) {
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
    name: roomNameRef.value?.value,
    password: passwordRef.value!.value,
    adminId: (store.userLogged as any)?.id,
  }

  await axios
    .post(`${config.baseUrl}rooms`, data, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 201) {
        useUpdateUserData(store, router)
      }
    })
    .catch((err) => {
      error.value = {
        status: true,
        message: err.response?.data?.message,
      }
    })
}
</script>

<template>
  <div class="container">
    <Form
      :action="crearSala"
      :error="error"
      :showPassword="true"
      submitValue="Crear Sala"
      :fields="[
        {
          name: 'username',
          placeholder: 'Nombre de sala',
          type: 'text',
          ref: roomNameRef,
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
  </div>
</template>

<style src="../../Views/CreateRoom/CreateRoom.Component.css"></style>
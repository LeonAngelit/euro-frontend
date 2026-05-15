<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import useHandleCloseSession from '../../composables/useHandleCloseSession'
import useValidateToken from '../../composables/useValidateToken'
import { validateRegex, validateUserNameRegex } from '../../utils/regexUtils'
import axios from 'axios'
import Form from '../../components/Form/Form.vue'
import RoomPicker from '../../components/RoomPicker/RoomPicker.vue'
import useUpdateUserData from '../../composables/useUpdateUserData'
import Collapsible from '../../components/Collapsible/Collapsible.vue'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'

const store = useAppStore()
const router = useRouter()
const passwordRef = ref<HTMLInputElement | null>(null)
const roomNameRef = ref<HTMLInputElement | null>(null)
const error = ref<any>(false)
const rooms = ref((store.userLogged as any)?.rooms)

const targetCount = computed(() => store.songs?.length > 5 ? 6 : 5)

async function validateUserToken() {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    if (window.location.pathname == '/join-room' || window.location.href.includes(config.confirmemailLink)) {
      useNavigateWithCallback(router, '/login?callback_url=' + window.location.href)
    } else {
      useNavigateWithCallback(router, '/login')
    }
  }
}

onMounted(() => {
  validateUserToken()
})

watch([targetCount, () => store.userLogged], () => {
  if ((store.userLogged as any)?.email == null) {
    useNavigateWithCallback(router, '/missing-email')
  } else if ((store.userLogged as any)?.countries?.length < targetCount.value) {
    store.setCurrentRoom(() => ({}))
    if (
      window.location.pathname == '/join-room' ||
      window.location.href.includes(config.confirmemailLink)
    ) {
      useNavigateWithCallback(router, '/country-select?callback_url=' + window.location.href)
    } else {
      useNavigateWithCallback(router, '/country-select')
    }
  } else {
    if (window.location.href.includes('callback_url')) {
      window.location.href = window.location.href.split('callback_url=')[1]
    }
  }
})

watch(() => store.userLogged, () => {
  rooms.value = (store.userLogged as any)?.rooms
})

async function joinRoom(event: Event) {
  event.preventDefault()
  if (!validateUserNameRegex(roomNameRef.value?.value || '')) {
    error.value = {
      status: true,
      message: 'Nombre de sala no válido, debe contener 5 a 25 caracteres, evita caracteres especiales',
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
    roomId: roomNameRef.value?.value,
    password: passwordRef.value?.value,
  }

  try {
    const response = await axios.post(
      `${config.baseUrl}rooms/join`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
      useUpdateUserData(store, router)
    }
  } catch (err: any) {
    if (err.response?.status == 404) {
      error.value = {
        status: true,
        message: 'Sala no encontrada, prueba con otro ID',
      }
    } else {
      error.value = {
        status: true,
        message: err.response?.data?.message,
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <template v-if="(store.userLogged as any)?.countries?.length >= targetCount && !store.currentRoom?.current">
      <div class="rooms-options">
        <p>Selecciona una sala de tu lista:</p>
        <RoomPicker :rooms="rooms" />
        <Collapsible title="Unirte a una sala: ">
          <Form
            :action="joinRoom"
            :error="error"
            submitValue="Unirme"
            :showPassword="true"
            :fields="[
              {
                name: 'roomname',
                placeholder: 'ID de la sala',
                type: 'text',
                ref: roomNameRef,
                required: true,
              },
              {
                name: 'password',
                placeholder: 'Contraseña',
                id: 'passwordField',
                type: 'password',
                ref: passwordRef,
                required: true,
              },
            ]"
          />
          <div class="subtitle">
            <p>
              Únete o <router-link to="/createroom">Crea una sala</router-link>
            </p>
          </div>
        </Collapsible>
      </div>
    </template>
  </div>
</template>

<style src="../../Views/App/Home.Component.css"></style>
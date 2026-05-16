<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore, type User } from '../../stores/app'
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

const { t } = useI18n()
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
  if (store.currentRoom?.current) {
    router.push('/room')
  }
  if ((store.userLogged as any)?.countries?.length < targetCount.value) {
    store.setCurrentRoom(() => ({}))

    store.setUserLogged({
      ...(store.userLogged as User),
      countries: [],

    })
    store.setSelection({
      current: []
    })

    if (
      window.location.pathname == '/join-room' ||
      window.location.href.includes(config.confirmemailLink)
    ) {
      useNavigateWithCallback(router, '/country-select?callback_url=' + window.location.href)
    } else {
      useNavigateWithCallback(router, '/country-select')
    }
  }
})

watch([targetCount, () => store.userLogged, () => store.songs, () => store.currentRoom], () => {

  // Guard: only evaluate redirect logic once songs are loaded
  if (!store.songs || store.songs.length === 0) return

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
  } else if (store.currentRoom?.current) {
    router.push('/room')
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
      message: t('validation.invalidRoomName'),
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
    roomId: roomNameRef.value?.value,
    password: passwordRef.value?.value?.split('').reverse().join(''),
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
        message: t('home.roomNotFound'),
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
        <p>{{ $t('home.selectRoom') }}</p>
        <RoomPicker :rooms="rooms" />
        <Collapsible :title="$t('home.joinRoom')">
          <Form :action="joinRoom" :error="error" :submitValue="$t('home.join')" :showPassword="true" :fields="[
            {
              name: 'roomname',
              placeholder: $t('home.roomIdPlaceholder'),
              type: 'text',
              setRef: (el: any) => roomNameRef = el,
              required: true,
            },
            {
              name: 'password',
              placeholder: $t('home.passwordPlaceholder'),
              id: 'passwordField',
              type: 'password',
              setRef: (el: any) => passwordRef = el,
              required: true,
            },
          ]" />
          <div class="subtitle">
            <p>
              {{ $t('home.joinOr') }} <router-link to="/createroom">{{ $t('home.createRoom') }}</router-link>
            </p>
          </div>
        </Collapsible>
      </div>
    </template>
  </div>
</template>

<style scoped>
.rooms-options {
  width: 90%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.rooms-options>p {
  margin-top: 1rem;
}

.subtitle {
  margin-bottom: 0.5rem;
}
</style>
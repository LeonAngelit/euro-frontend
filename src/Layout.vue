<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from './stores/app'
import axios from 'axios'
import config from './config/config'
import useUpdateUserData from './composables/useUpdateUserData'
import useNavigateWithCallback from './composables/useNavigateWithCallback'
import { useDetectLocale } from './composables/useDetectLocale'
import Navigation from './components/Navigation/Navigation.vue'
import Footer from './components/Footer/Footer.vue'
import Modal from './components/Modal/Modal.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()

const d = new Date()
const intervalRef = ref<ReturnType<typeof setInterval> | null>(null)
const roomIntervalRef = ref<ReturnType<typeof setInterval> | null>(null)

const modal = computed(() => store.modal)

function updatePointRequest() {
  axios
    .get(`${config.baseUrl}countries/refresh/${d.getFullYear()}`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        return response.data
      }
    })
    .catch((error) => {
      return error.response?.data?.message
    })
}

function updateRoomData(roomId: string) {
  axios
    .get(`${config.baseUrl}rooms/${roomId}/${(store.userLogged as any)?.id}`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        if (store.currentRoom?.current) {
          const userToUpdate = response.data.users.find(
            (element: any) => element.id == (store.userLogged as any)?.id,
          )
          store.setUserLogged({
            ...(store.userLogged as any),
            countries: userToUpdate.countries,
          })
          store.setCurrentRoom({
            ...store.currentRoom,
            current: response.data,
          })
        }
      }
    })
    .catch((error) => {
      if (error.response?.status == 404) {
        return { status: true, message: t('layout.roomNotFound') }
      } else {
        return { status: true, message: error.response?.data?.message }
      }
    })
}

async function handleJoinRoomLink() {
  if (window.location.href.includes('roomAuth')) {
    const roomAuth = window.location.href.split('roomAuth=')[1]
    try {
      const response = await axios.post(
        `${config.baseUrl}rooms/verifyRoomToken/${(store.userLogged as any)?.id}`,
        { token: roomAuth },
        {
          headers: {
            Accept: 'application/json',
            Bearer: store.xToken,
          },
        },
      )
      if (response.status == 201) {
        useUpdateUserData(store, router)
        store.setModal({
          visible: true,
          message: t('layout.updateSuccess'),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
      }
    } catch (error: any) {
      store.setModal({
        visible: true,
        message: error.response?.data?.message,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
      router.push('/app')
    }
  }
}

// Poll: refresh countries for admin
watch(
  () => store.userLogged,
  () => {
    if (
      store.xToken &&
      (store.userLogged as any)?.username === config.appAdmin &&
      store.updatable?.refresh_enabled
    ) {
      if (intervalRef.value) clearInterval(intervalRef.value)
      intervalRef.value = setInterval(() => {
        updatePointRequest()
      }, 40000)
    } else {
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
        intervalRef.value = null
      }
    }
  },
  { deep: true },
)

// Poll: room data
watch(
  () => store.currentRoom,
  () => {
    if (store.xToken && store.currentRoom?.current != undefined) {
      if (!roomIntervalRef.value) {
        roomIntervalRef.value = setInterval(() => {
          updateRoomData(store.currentRoom?.current?.id)
        }, 60000)
      }
    } else {
      if (roomIntervalRef.value) {
        clearInterval(roomIntervalRef.value)
        roomIntervalRef.value = null
      }
    }
  },
  { deep: true },
)

// User auth and join-room link handling
watch(
  () => store.userLogged,
  () => {
    if (
      store.userLogged &&
      (store.userLogged as any)?.email != null &&
      (store.userLogged as any)?.countries?.length ==
        (store.songs?.length > 5 ? 6 : 5) &&
      window.location.pathname == '/join-room'
    ) {
      handleJoinRoomLink()
    }
    if (!store.userLogged) {
      if (
        window.location.href.includes('/join-room') ||
        window.location.href.includes(config.confirmemailLink)
      ) {
        useNavigateWithCallback(router, '/login?callback_url=' + window.location.href)
      } else {
        useNavigateWithCallback(router, '/login')
      }
    }
  },
)

onMounted(() => {
  // Detect locale from IP geolocation
  useDetectLocale().then(detected => { locale.value = detected })
  // Initial room poll setup
  if (store.xToken && store.currentRoom?.current != undefined) {
    roomIntervalRef.value = setInterval(() => {
      updateRoomData(store.currentRoom?.current?.id)
    }, 60000)
  }
})

onUnmounted(() => {
  if (intervalRef.value) clearInterval(intervalRef.value)
  if (roomIntervalRef.value) clearInterval(roomIntervalRef.value)
})
</script>

<template>
  <div>
    <Navigation />
    <RouterView v-slot="{ Component }">
      <Suspense>
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          <p>{{ $t('layout.loading') }}</p>
        </template>
      </Suspense>
    </RouterView>
    <!-- Confirm dialog -->
    <Modal
      v-if="modal.visible && modal.confirm && !modal.component"
      :message="modal.message"
      :status="modal.status"
      :onaccept="modal.onaccept"
      :confirm="true"
      :onclick="() => store.setModal({})"
    />
    <!-- Custom component modal -->
    <Modal
      v-if="modal.visible && modal.component"
      :onclick="modal.onclick"
      :onaccept="modal.onaccept"
      :message="modal.message"
      :component="modal.component"
    />
    <!-- Plain message modal -->
    <Modal
      v-if="modal.visible && !modal.confirm && !modal.component"
      :message="modal.message"
      :status="modal.status"
      :onclick="() => store.setModal({})"
    />
    <Footer />
  </div>
</template>
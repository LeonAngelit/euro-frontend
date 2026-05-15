<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import Classification from '../../components/ClassificationView/ClassificationView.vue'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'
import config from '../../config/config'

const store = useAppStore()
const router = useRouter()
const targetCount = computed(() => store.songs?.length > 5 ? 6 : 5)

onMounted(() => {
  if (!store.currentRoom?.current) {
    useNavigateWithCallback(router, '/app')
  }
})

onMounted(() => {
  if (
    (store.userLogged as any)?.email == null &&
    !window.location.href.includes(config.confirmemailLink)
  ) {
    useNavigateWithCallback(router, '/missing-email')
  } else if (
    (store.userLogged as any)?.countries?.length < targetCount.value &&
    (store.userLogged as any)?.countries != undefined
  ) {
    useNavigateWithCallback(router, '/country-select')
  }
})

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
})
</script>

<template>
  <template v-if="(store.userLogged as any)?.countries?.length >= targetCount && store.currentRoom != undefined && store.currentRoom?.current != undefined">
    <div class="container">
      <Classification
        :room="store.currentRoom?.current"
        :animate="true"
      />
    </div>
  </template>
</template>
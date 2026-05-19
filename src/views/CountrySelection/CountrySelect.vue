<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import CountryPicker from '../../components/CountryPicker/CountryPicker.vue'
import useValidateToken from '../../composables/useValidateToken'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import config from '../../config/config'
import useHandleCloseSession from '../../composables/useHandleCloseSession'

const store = useAppStore()
const router = useRouter()
const targetCount = computed(() => store.songs?.length > 5 ? 6 : 5)

onMounted(async () => {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    useNavigateWithCallback(router, '/login')
  }
})

watch([() => store.userLogged, targetCount], () => {
  if ((store.userLogged as any)?.countries?.length >= targetCount.value) {
    if (
      window.location.href.includes('callback_url=') &&
      window.location.href.includes(config.joinRoomLink)
    ) {
      window.location.href = window.location.href.split('callback_url=')[1]
    } else {
      useNavigateWithCallback(router, '/app')
    }
  }
})
</script>

<template>
  <div class="container">
    <template v-if="(store.userLogged as any)?.countries?.length < targetCount || (store.userLogged as any)?.countries == undefined">
      <CountryPicker :modal="true" />
    </template>
  </div>
</template>

<style scoped>
h1, h2, h3 {
  color: var(--euro-pink);
}
</style>
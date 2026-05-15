<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'

const store = useAppStore()
const router = useRouter()

onMounted(() => {
  if (store.userLogged) {
    router.push('/app')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div className="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
  </div>
</template>

<style src="../../Components/NotFoundComponent/App.css"></style>
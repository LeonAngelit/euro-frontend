<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'

const { t } = useI18n()
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
    <h1>{{ $t('notFound.title') }}</h1>
    <p>{{ $t('notFound.message') }}</p>
  </div>
</template>

<style src="../../Components/NotFoundComponent/App.css"></style>
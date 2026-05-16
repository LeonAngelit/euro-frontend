<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import Classification from '../../components/ClassificationView/ClassificationView.vue'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
const historicalRooms = ref<any>(false)
const selectedHistoricalRoom = ref<any>(false)
const loading = ref(true)

onMounted(async () => {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    useNavigateWithCallback(router, '/login')
  }
  if ((store.userLogged as any)?.email == null && !window.location.href.includes(config.confirmemailLink)) {
    useNavigateWithCallback(router, '/missing-email')
  }
  await fetchRooms()
})

async function setSelectedRoom(roomId: string) {
  if (roomId) {
    try {
      const response = await axios.get(
        `${config.baseUrl}archive/room/${roomId}/${(store.userLogged as any)?.id}`,
        {
          headers: {
            Accept: 'application/json',
            Bearer: store.xToken,
          },
        },
      )
      if (response.status == 200) {
        selectedHistoricalRoom.value = response.data
      }
    } catch (error: any) {
      if (error.response?.status == 404) {
        return {
          status: true,
          message: t('archive.noData'),
        }
      } else {
        return {
          status: true,
          message: error.response?.data?.message,
        }
      }
    }
  } else {
    selectedHistoricalRoom.value = false
  }
}

async function fetchRooms() {
  try {
    const response = await axios.get(
      `${config.baseUrl}archive/users/${(store.userLogged as any)?.id}`,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
      historicalRooms.value = response.data
    }
  } catch (error: any) {
    if (error.response?.status == 404) {
      return {
        status: true,
        message: t('archive.noData'),
      }
    } else {
      return {
        status: true,
        message: error.response?.data?.message,
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <template v-if="loading">
      <p class="archive-element">{{ $t('archive.loading') }}</p>
    </template>
    <template v-else-if="historicalRooms">
      <template v-if="selectedHistoricalRoom">
        <select
          @change="(e: Event) => setSelectedRoom((e.target as HTMLSelectElement).value)"
          class="select-css selected"
        >
          <option value="">{{ $t('archive.selectRoom') }}</option>
          <option
            v-for="room in historicalRooms"
            :key="room._id"
            :value="room._id"
            :id="room._id"
          >
            {{ room.room.name }} - {{ room.year }}
          </option>
        </select>
        <Classification :room="selectedHistoricalRoom" :animate="false" />
      </template>
      <template v-else>
        <select @change="(e: Event) => setSelectedRoom((e.target as HTMLSelectElement).value)" class="select-css">
          <option value="">{{ $t('archive.selectRoom') }}</option>
          <option
            v-for="room in historicalRooms"
            :key="room._id"
            :value="room._id"
            :id="room._id"
          >
            {{ room.room.name }} - {{ room.year }}
          </option>
        </select>
      </template>
    </template>
    <template v-else>
      <p>{{ $t('archive.noResults') }}</p>
    </template>
  </div>
</template>

<style src="../../Views/App/Home.Component.css"></style>
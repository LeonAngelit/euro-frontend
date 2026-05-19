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

const dropdownOpen = ref(false)
const selectedRoomName = ref<string | null>(null)

function selectHistoricalRoom(roomId: string, displayName: string) {
  selectedRoomName.value = displayName
  dropdownOpen.value = false
  setSelectedRoom(roomId)
}
</script>

<template>
  <div class="container archive-container">
    <template v-if="loading">
      <p class="archive-element">{{ $t('archive.loading') }}</p>
    </template>
    <template v-else-if="historicalRooms">
      <!-- Custom dropdown trigger button -->
      <div class="custom-select-wrapper">
        <button class="custom-select-trigger" @click="dropdownOpen = !dropdownOpen">
          <span v-if="selectedRoomName" class="selected-label">{{ selectedRoomName }}</span>
          <span v-else class="placeholder-label">{{ $t('archive.selectRoom') }}</span>
          <svg :class="['dropdown-arrow', { 'arrow-up': dropdownOpen }]" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"></path>
          </svg>
        </button>
        <!-- Dropdown list -->
        <div v-if="dropdownOpen" class="custom-select-dropdown">
          <button
            v-for="room in historicalRooms"
            :key="room._id"
            class="custom-select-option"
            @click="selectHistoricalRoom(room._id, `${room.room.name} - ${room.year}`)"
          >
            {{ room.room.name }} - {{ room.year }}
          </button>
        </div>
      </div>
      
      <!-- Close dropdown when clicking outside -->
      <div v-if="dropdownOpen" class="dropdown-overlay" @click="dropdownOpen = false"></div>

      <!-- Classification view when a room is selected -->
      <div v-if="selectedHistoricalRoom" class="classification-wrapper">
        <Classification :room="selectedHistoricalRoom" :animate="false" :isArchive="true" />
      </div>
    </template>
    <template v-else>
      <p class="archive-element">{{ $t('archive.noResults') }}</p>
    </template>
  </div>
</template>

<style scoped>
.archive-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  position: relative;
}

.archive-element {
  color: white;
  font-size: 1.1rem;
  margin-top: 2rem;
}

/* Custom dropdown */
.custom-select-wrapper {
  width: 85%;
  max-width: 420px;
  position: relative;
  z-index: 10;
}

.custom-select-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--euro-gold);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.custom-select-trigger:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--euro-pink);
}

.selected-label {
  color: white;
  font-weight: bold;
}

.placeholder-label {
  color: rgba(255, 255, 255, 0.5);
}

.dropdown-arrow {
  color: var(--euro-pink);
  transition: transform 0.2s ease;
}

.arrow-up {
  transform: rotate(90deg);
}

.custom-select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgb(2, 2, 94);
  border: 1px solid var(--euro-pink);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 20;
  max-height: 50vh;
  overflow-y: auto;
}

.custom-select-option {
  width: 100%;
  display: block;
  padding: 0.8rem 1.2rem;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.custom-select-option:last-child {
  border-bottom: none;
}

.custom-select-option:hover {
  background: rgba(255, 0, 135, 0.15);
  color: var(--euro-pink);
  padding-left: 1.5rem;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background: transparent;
}

.classification-wrapper {
  width: 100%;
  margin-top: 1.5rem;
}
</style>
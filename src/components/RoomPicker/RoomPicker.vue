<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import config from '../../config/config'
import useUpdateUserData from '../../composables/useUpdateUserData'
import RoomNameEditForm from './RoomNameEditForm.vue'

const { t } = useI18n()

interface Room {
  id: string
  name: string
  adminId: string
  [key: string]: any
}

interface RoomPickerProps {
  rooms?: Room[]
}

const props = defineProps<RoomPickerProps>()
const store = useAppStore()
const router = useRouter()
const editingRoomId = ref<string | null>(null)

const currentRoomName = computed(() => {
  if (!editingRoomId.value) return ''
  const room = props.rooms?.find(r => r.id === editingRoomId.value)
  return room?.name || ''
})

watch(() => store.modal.visible, (visible) => {
  if (!visible) {
    editingRoomId.value = null
  }
})

function openEditModal(room: Room) {
  editingRoomId.value = room.id
  store.setModal({
    visible: true,
    component: RoomNameEditForm,
    editingRoomId: room.id,
    currentRoomName: room.name,
    onaccept: undefined,
    onclick: () => {
      editingRoomId.value = null
      store.setModal({})
    },
  })
}

async function selectRoom(event: Event) {
  const button = (event.currentTarget as HTMLElement)
  const roomId = button.id
  initializeRoom(roomId)
}

async function initializeRoom(roomId: string) {
  try {
    const response = await axios.get(
      `${config.baseUrl}rooms/${roomId}/${(store.userLogged as any)?.id}`,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
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
  } finally {
    router.push('/room')
  }
}

async function forgetRoom(id: string) {
  const data = {
    userId: parseInt((store.userLogged as any)?.id),
    roomId: parseInt(id),
  }
  try {
    const response = await axios.post(
      `${config.baseUrl}rooms/remove-user`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 204) {
      useUpdateUserData(store, router)
    }
  } catch (error: any) {
    return error.response?.data?.message
  }
}

async function deleteRoom(id: string) {
  try {
    const response = await axios.delete(
      `${config.baseUrl}rooms/${id}/${(store.userLogged as any)?.id}`,
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
  } catch (error: any) {
    return error.response?.data?.message
  }
}

async function getRoomToken(roomId: string, roomName: string): Promise<string> {
  try {
    const response = await axios.get(
      `${config.baseUrl}rooms/generateRoomToken/${roomId}/${(store.userLogged as any)?.id}`,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
      const url = `${config.joinRoomLink}roomAuth=${response.data}`
      if (navigator.share) {
        await navigator.share({
          title: t('roomPicker.shareTitle', { roomName }),
          text: t('roomPicker.shareText', { roomName }),
          url: url,
        }).catch(() => '')
      } else {
        navigator.clipboard.writeText(url)
        alert(t('roomPicker.linkCopied'))
      }
      return ''
    }
  } catch {
    return ''
  }
  return ''
}

async function shareRoom(event: Event) {
  event.preventDefault()
  const button = event.currentTarget as HTMLElement
  const roomId = button.getAttribute('data-room-id') || ''
  const roomName = button.getAttribute('name') || ''
  await getRoomToken(roomId, roomName)
}


</script>

<template>
  <div class="room-picker">
    <template v-if="props.rooms && props.rooms.length > 0">
      <div v-for="(room, index) in props.rooms" :key="index" class="room-card">
        <!-- Main clickable area — selects the room -->
        <button :id="room.id" @click="selectRoom" class="room-select-btn">
          <div class="room-info">
            <span class="room-icon">🎤</span>
            <span class="room-name">{{ room.name }}</span>
          </div>
          <div class="room-enter">
            <span class="enter-text">{{ $t('roomPicker.enter') }}</span>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="18px"
              width="18px" xmlns="http://www.w3.org/2000/svg" style="color: var(--euro-pink);">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"></path>
            </svg>
          </div>
        </button>

        <!-- Actions row -->
        <div class="room-actions">
          <button class="action-btn forget-btn" @click="(event) => {
            event.preventDefault()
            store.setModal({
              visible: true,
              confirm: true,
              message: t('roomPicker.forgetConfirm'),
              onaccept: () => { forgetRoom(room.id); store.setModal({}) },
              onclick: () => store.setModal({}),
            })
          }">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16px"
              width="16px" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
            </svg>
            {{ $t('roomPicker.forget') }}
          </button>

          <div class="action-group">
            <button v-if="room.adminId == (store.userLogged as any)?.id" :id="room.id" @click="openEditModal(room)"
              class="action-btn icon-btn edit-btn" :title="t('roomPicker.edit')">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="18px"
                width="18px" xmlns="http://www.w3.org/2000/svg" style="color: var(--euro-pink);">
                <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
              </svg>
            </button>

            <button :data-room-id="room.id" :name="room.name" @click="shareRoom"
              class="action-btn icon-btn share-btn" :title="t('roomPicker.share')">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
                stroke-linejoin="round" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>

            <button v-if="room.adminId == (store.userLogged as any)?.id" :id="room.id" class="action-btn icon-btn delete-btn"
              @click="(event) => {
                event.preventDefault()
                store.setModal({
                  visible: true,
                  confirm: true,
                  message: t('roomPicker.deleteConfirm'),
                  onaccept: () => { deleteRoom(room.id); store.setModal({}) },
                  onclick: () => store.setModal({}),
                })
              }" :title="t('roomPicker.delete')">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="18px"
                width="18px" xmlns="http://www.w3.org/2000/svg" style="color: var(--error-color);">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.room-picker {
  width: 100%;
}

.room-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(218, 183, 29, 0.3);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.room-card:hover {
  border-color: var(--euro-gold);
  box-shadow: 0 0 20px rgba(255, 0, 135, 0.15);
}

.room-select-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.room-select-btn:hover {
  background: rgba(255, 0, 135, 0.08);
}

.room-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.room-icon {
  font-size: 1.5rem;
}

.room-name {
  font-size: 1.15rem;
  font-weight: bold;
  color: white;
  letter-spacing: 0.5px;
}

.room-enter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--euro-pink);
  font-weight: bold;
  font-size: 0.9rem;
}

.enter-text {
  color: var(--euro-pink);
}

.room-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.2rem;
  border-top: 1px solid rgba(218, 183, 29, 0.15);
}

.action-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.forget-btn {
  background: rgba(164, 8, 8, 0.15);
  color: rgb(255, 150, 150);
  border: 1px solid rgba(164, 8, 8, 0.3);
}

.forget-btn:hover {
  background: rgba(164, 8, 8, 0.3);
  border-color: rgb(164, 8, 8);
  color: white;
  box-shadow: 0 0 10px rgba(164, 8, 8, 0.3);
}

.icon-btn {
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  min-width: 34px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.edit-btn:hover {
  box-shadow: 0 0 10px rgba(255, 0, 135, 0.3);
}

.share-btn:hover {
  box-shadow: 0 0 10px rgba(218, 183, 29, 0.3);
}

.delete-btn:hover {
  background: rgba(164, 8, 8, 0.2);
  box-shadow: 0 0 10px rgba(164, 8, 8, 0.3);
}
</style>
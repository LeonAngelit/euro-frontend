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
  const roomId = button.getAttribute('data') || ''
  const roomName = button.getAttribute('name') || ''
  await getRoomToken(roomId, roomName)
}


</script>

<template>
  <div>
    <template v-if="props.rooms && props.rooms.length > 0">
      <div v-for="(room, index) in props.rooms" :key="index" class="room-card">
        <article class="room-container">
          <button :id="room.id" @click="selectRoom" class="room-icon-container room-name">
            <p>{{ room.name }}</p>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20px"
              width="20px" xmlns="http://www.w3.org/2000/svg" style="color: black; stroke-width: 1;">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"></path>
            </svg>
          </button>
          <button v-if="room.adminId == (store.userLogged as any)?.id" :id="room.id" @click="openEditModal(room)"
            class="room-icon-edit-container">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="20px"
              width="20px" xmlns="http://www.w3.org/2000/svg" style="color: black; stroke-width: 1;">
              <path
                d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z">
              </path>
            </svg>
          </button>
          <button :id="`share-${room.id}`" :data="room.id" :name="room.name" @click="shareRoom"
            class="room-icon-container">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </article>
        <div class="room-actions">
          <button :id="room.id" @click="(event) => {
            event.preventDefault()
            store.setModal({
              visible: true,
              confirm: true,
              message: t('roomPicker.forgetConfirm'),
              onaccept: () => { forgetRoom(room.id); store.setModal({}) },
              onclick: () => store.setModal({}),
            })
          }">
            {{ $t('roomPicker.forget') }}
          </button>
          <button v-if="room.adminId == (store.userLogged as any)?.id" :id="room.id" class="delete-button" @click="(event) => {
            event.preventDefault()
            store.setModal({
              visible: true,
              confirm: true,
              message: t('roomPicker.deleteConfirm'),
              onaccept: () => { deleteRoom(room.id); store.setModal({}) },
              onclick: () => store.setModal({}),
            })
          }">
            <div class="header-icon-container">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20px"
                width="20px" xmlns="http://www.w3.org/2000/svg" style="color: white;">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z">
                </path>
              </svg>
              <p>{{ $t('roomPicker.delete') }}</p>
            </div>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.room-container {
  margin-top: 1rem;
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  background-color: whitesmoke;
}

.room-icon-container {
  display: flex;
  background-color: whitesmoke;
  border: none;
  justify-content: flex-end;
  align-items: flex-end;
  text-decoration: none;
  width: 90%;
  font-weight: bold;
}

.room-icon-edit-container {
  display: flex;
  background-color: whitesmoke;
  border: none;
  justify-content: flex-start;
  align-items: flex-end;
  text-decoration: none;
  width: 90%;
  font-weight: bold;
}

.room-icon-container.room-name {
  justify-content: flex-start;
}

.room-icon-container p {
  font-size: 1rem;
  text-align: center;

}

.room-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.room-actions {
  display: flex;
  justify-content: space-between;
}

.room-actions>button {
  width: 40%;
  margin-top: 0.2rem;
  border: none;
  background-color: var(--primary-color);
  border-radius: 0.2rem;
  padding: 0.2rem;
  color: whitesmoke;
}

.room-actions .delete-button {
  background-color: var(--error-color);
}

.delete-button .header-icon-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}




@media (min-width: 1000px) {
  .room-icon-container.room-name {
    width: auto;
  }

}
</style>
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
          <button
            :id="room.id"
            @click="selectRoom"
            class="room-icon-container room-name"
          >
            <p>{{ room.name }}</p>
            <Icon icon="vscode-icons:file-type-chevron-right" style="color: black; font-size: 20px;" />
          </button>
          <button
            v-if="room.adminId == (store.userLogged as any)?.id"
            :id="room.id"
            data-testid="delete-room-btn"
            @click="(event) => {
              event.preventDefault()
              store.setModal({
                visible: true,
                confirm: true,
                message: t('roomPicker.deleteConfirm'),
                onaccept: () => { deleteRoom(room.id); store.setModal({}) },
                onclick: () => store.setModal({}),
              })
            }"
            class="room-icon-edit-container"
          >
            <Icon icon="mdi:delete" style="color: black; font-size: 20px;" />
          </button>
          <button
            v-if="room.adminId == (store.userLogged as any)?.id"
            :id="room.id"
            data-testid="edit-room-name-btn"
            @click="openEditModal(room)"
            class="room-icon-edit-container"
          >
            <Icon icon="mdi:pencil-outline" style="color: black; font-size: 20px;" />
          </button>
          <button
            v-if="room.adminId == (store.userLogged as any)?.id"
            :id="room.id"
            data-testid="forget-room-btn"
            @click="(event) => {
              event.preventDefault()
              store.setModal({
                visible: true,
                confirm: true,
                message: t('roomPicker.forgetConfirm'),
                onaccept: () => { forgetRoom(room.id); store.setModal({}) },
                onclick: () => store.setModal({}),
              })
            }"
            class="room-icon-edit-container"
          >
            <Icon icon="mdi:link-off" style="color: black; font-size: 20px;" />
          </button>
          <button
            :id="`share-${room.id}`"
            :data="room.id"
            :name="room.name"
            @click="shareRoom"
            class="room-icon-container"
          >
            <Icon icon="mdi:share-variant" style="font-size: 20px;" />
          </button>
        </article>
      </div>
    </template>
  </div>
</template>

<style src="../../Components/RoomPicker/RoomPicker.Component.css"></style>
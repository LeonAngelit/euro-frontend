<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import config from '../../config/config'
import useUpdateUserData from '../../composables/useUpdateUserData'
import { validateUserNameRegex } from '../../utils/regexUtils'

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
const error = ref<any>({})
const roomNameRef = ref<HTMLInputElement | null>(null)

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
          title: `Participa conmigo en la sala ${roomName}!`,
          text: `Participa conmigo en la sala ${roomName}!\nHaz clic en el link para unirte a la sala:\n `,
          url: url,
        }).catch(() => '')
      } else {
        navigator.clipboard.writeText(url)
        alert('Link copiado al portapapeles')
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

async function updateRoomName(event: Event, roomId: string) {
  event.preventDefault()
  if (roomNameRef.value && !validateUserNameRegex(roomNameRef.value.value)) {
    error.value = {
      status: true,
      message: 'Nombre de sala no válido',
    }
    return
  }
  const data = {
    name: roomNameRef.value?.value,
  }
  try {
    const response = await axios.put(
      `${config.baseUrl}rooms/${roomId}/${(store.userLogged as any)?.id}`,
      data,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
      const userResponse = await axios.get(
        `${config.baseUrl}users/${(store.userLogged as any)?.id}`,
        {
          headers: {
            Accept: 'application/json',
            Bearer: store.xToken,
          },
        },
      )
      if (userResponse.status == 200) {
        store.setModal({
          visible: true,
          message: 'Actualización correcta',
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
        store.setUserLogged(userResponse.data)
      }
    }
  } catch (err: any) {
    store.setModal({
      visible: true,
      message: err.response?.data?.message,
      status: 'error',
      confirm: store.setModal({}),
    })
    setTimeout(() => {
      store.setModal({})
    }, 5000)
  }
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
            @click="(event) => {
              event.preventDefault()
              store.setModal({
                visible: true,
                confirm: true,
                message: '¿Deseas eliminar la sala? Esta acción es irreversible',
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
            @click="(event) => {
              event.preventDefault()
              store.setModal({
                visible: true,
                confirm: true,
                message: '¿Deseas olvidar la sala? Podrás volver a unirte introduciendo id y contraseña en el formulario',
                onaccept: () => { forgetRoom(room.id); store.setModal({}) },
                onclick: () => store.setModal({}),
              })
            }"
            class="room-icon-edit-container"
          >
            <Icon icon="mdi:pencil-outline" style="color: black; font-size: 20px;" />
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
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import config from '../../config/config'
import { validateUserNameRegex } from '../../utils/regexUtils'

const { t } = useI18n()
const store = useAppStore()

const editingRoomId = computed(() => store.modal.editingRoomId as string)
const currentRoomName = computed(() => store.modal.currentRoomName as string)

const roomNameRef = ref<HTMLInputElement | null>(null)
const error = ref<any>({})
const roomName = ref('')

onMounted(() => {
  roomName.value = currentRoomName.value
})

async function updateRoomName(event: Event) {
  event.preventDefault()
  const newName = roomNameRef.value?.value || ''
  if (!validateUserNameRegex(newName)) {
    error.value = {
      status: true,
      message: t('roomNameEdit.invalidName'),
    }
    return
  }
  const data = {
    name: newName,
  }
  try {
    const response = await axios.put(
      `${config.baseUrl}rooms/${editingRoomId.value}/${(store.userLogged as any)?.id}`,
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
          message: t('layout.updateSuccess'),
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

function closeEditModal() {
  store.setModal({})
}
</script>

<template>
  <div class="edit-room-name-form">
    <form @submit.prevent="updateRoomName">
      <div class="input-container">
        <input ref="roomNameRef" v-model="roomName" type="text" name="roomName" data-testid="room-name-input" />
      </div>
      <div v-if="error.status" class="error-span">
        {{ error.message }}
      </div>
      <div class="modal-action-buttons">
        <button type="submit" class="action-btn" data-testid="submit-room-name-btn">{{ $t('roomNameEdit.save')
          }}</button>

      </div>
    </form>
  </div>
</template>

<style src="../../Components/RoomPicker/RoomNameEditForm.Component.css"></style>
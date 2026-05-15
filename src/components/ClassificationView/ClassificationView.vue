<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/app'
import config from '../../config/config'

interface ClassificationProps {
  room: any
  animate?: boolean
}

const props = defineProps<ClassificationProps>()
const store = useAppStore()

const users = ref<any[]>([])
const animActive = ref(false)
const targetCount = computed(() => store.songs?.length > 5 ? 6 : 5)

onMounted(() => {
  if (props.room) {
    const roomUsers = props.room.users ?? props.room?.room?.users
    if (roomUsers) {
      const usersTemp = roomUsers.filter(
        (element: any) => element.countries?.length >= targetCount.value,
      )
      users.value = usersTemp
      animActive.value = !!props.animate
    }
  }
})

watch(() => store.currentRoom, () => {
  if (props.room) {
    const roomUsers = props.room.users ?? props.room?.room?.users
    if (roomUsers) {
      const usersTemp = roomUsers.filter(
        (element: any) => element.countries?.length >= targetCount.value,
      )
      users.value = usersTemp
      animActive.value = !!props.animate
    }
  }
})

watch(() => store.currentRoom, () => {
  setTimeout(() => {
    if (
      store.xToken &&
      store.currentRoom?.current != undefined &&
      props.animate
    ) {
      animActive.value = !animActive.value
    }
  }, 60000)
})
</script>

<template>
  <div class="classification-container"
    :class="{
      'animate-classification': animActive,
    }"
  >
    <div class="room-title-container">
      <h2>{{ room?.name || room?.room?.name }}</h2>
    </div>
    <div class="users-container">
      <div
        v-for="(user, index) in users"
        :key="user.id || index"
        class="user-card-wrapper"
      >
        <div class="user-card-data">
          <div class="user-card-image">
            <img
              :src="user.image ? user.image : `${config.defProfilePicUrl}${user.username}`"
              alt="user"
            />
          </div>
          <div class="user-card-info">
            <p>{{ user.username }}</p>
          </div>
          <div class="user-card-countries">
            <span
              v-for="countryId in user.countries"
              :key="countryId"
              :class="[
                'fi',
                'fis',
                'country-flag',
                store.songs?.find((s: any) => s.id == countryId)?.code
                  ? `fi-${store.songs.find((s: any) => s.id == countryId).code}`
                  : '',
              ]"
            ></span>
          </div>
          <div class="user-card-total">
            <p>{{ user.total || user.countries?.length }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../../Components/ClassificationView/Classification.Component.css"></style>
<style src="flag-icons/css/flag-icons.min.css"></style>
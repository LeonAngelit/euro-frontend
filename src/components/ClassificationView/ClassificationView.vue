<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/app'
import config from '../../config/config'
import UserCard from './UserCard.vue'

interface ClassificationProps {
  room: any
  animate?: boolean
  isArchive?: boolean
}

const props = defineProps<ClassificationProps>()
const store = useAppStore()

const targetCount = computed(() => store.songs?.length > 5 ? 6 : 5)

const users = computed(() => {
  if (!props.room) return []
  const roomUsers = props.room.users ?? props.room?.room?.users
  if (!roomUsers) return []

  return roomUsers
    .filter((element: any) =>
      props.isArchive ? element.countries?.length > 0 : element.countries?.length >= targetCount.value
    )
    .sort((a: any, b: any) => (b.points ?? 0) - (a.points ?? 0))
})

const animActive = ref(!!props.animate)

onMounted(() => {
  store.fetchSongs()
})

const getCountryCode = (country: any) => {
  if (!country) return ''
  if (typeof country === 'object' && country.code) return country.code.toLowerCase()
  const id = typeof country === 'object' ? country.id : country
  const song = store.songs?.find((s: any) => s.id == id)
  return song?.code?.toLowerCase() || ''
}

watch(() => props.room, (newRoom) => {
  if (newRoom && props.animate) {
    animActive.value = true
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
  <div class="classification-container" :class="{
    'animate-classification': animActive,
  }">
    <div class="room-title-container">
      <h2>{{ room?.name || room?.room?.name }}</h2>
    </div>
    <div class="users-container">
      <template v-for="(user, index) in users" :key="user.id || index">
        <UserCard
          :user="user"
          :index="index"
          :animActive="animActive"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.classification-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.room-title-container {
  flex-shrink: 0;
  width: 100%;
  height: 5dvh;
  margin-bottom: 1rem;
  z-index: 5;
  border-bottom: 2px solid var(--euro-gold);
  padding: .5rem;
  display: flex;
  align-items: center;
}

.users-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: none;
}

.room-title-container h2 {
  color: var(--euro-gold);
  text-shadow: 0 0 12px rgba(218, 183, 29, 0.3);
  font-size: 1.1rem;
  margin: 0;
}
</style>
<style src="flag-icons/css/flag-icons.min.css"></style>
<!-- Non-scoped: hide webkit scrollbar (scoped attr selector breaks ::-webkit-scrollbar) -->
<style>
.users-container::-webkit-scrollbar {
  display: none;
}
</style>
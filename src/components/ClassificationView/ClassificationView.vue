<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/app'
import config from '../../config/config'

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
        <div class="user-card-wrapper" :class="{ 'animate': animActive }" :style="{
          animationDelay: `${Number(index) * 120}ms`,
        }">
          <article class="user-card" :style="{ backgroundColor: user.color }">
            <div class="user-card-position">
              <p>{{ Number(index) + 1 }}</p>
            </div>
            <div class="user-card-image">
              <img :src="user.image ? user.image : `${config.defProfilePicUrl}${user.username}`"
                alt="imagen de usuario" />
            </div>
            <div class="user-card-data">
              <div class="user-card-info">
                <p :class="{ 'user-winner': index === 0 }">
                  {{ user.username }}
                </p>
              </div>
              <div class="user-card-countries">
                <div v-for="(country, cIndex) in user.countries" :key="cIndex" class="country-wrapper">
                  <p :style="{
                    fontWeight:
                      user.winnerOption?.[0]?.countryId === true ||
                        user.winnerOption?.[0]?.countryId === country.id ||
                        user.tailOption?.[0]?.countryId === country.id
                        ? 'bold'
                        : '100',
                    color:
                      user.tailOption?.[0]?.countryId === country.id ? 'blue' : 'black',
                  }">
                    <span :class="[
                      'fi',
                      'fis',
                      'country-flag',
                      getCountryCode(country) ? `fi-${getCountryCode(country)}` : '',
                    ]" :style="{
                      outline:
                        country.position === 1
                          ? '2px solid var(--euro-gold)'
                          : country.position === store.songs?.length
                            ? '2px solid blue'
                            : '',
                    }"></span>
                    {{
                      country.position === 1 && user.winnerOption?.[0]?.countryId === country.id
                        ? Math.floor(country.points + country.points * 0.1)
                        : country.points
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="user-card-total">
              <p>{{ user.points }}</p>
            </div>
          </article>
        </div>
      </template>
    </div>
  </div>
</template>

<style src="../../Components/ClassificationView/Classification.Component.css"></style>
<style src="flag-icons/css/flag-icons.min.css"></style>
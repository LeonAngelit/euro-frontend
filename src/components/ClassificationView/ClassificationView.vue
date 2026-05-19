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
            <div
              :class="['user-card-position', index === 0 ? 'pos-1' : index === 1 ? 'pos-2' : index === 2 ? 'pos-3' : '']">
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
                      user.tailOption?.[0]?.countryId === country.id ? 'blue' : 'white',
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

<style scoped>
.user-card-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 0.6rem;
  height: 82px;
  clip-path: polygon(0% 0%, 97% 0%, 100% 100%, 3% 100%);
  border-top: 2px solid var(--euro-gold);
  border-bottom: 2px solid var(--euro-gold);
  padding-top: 0.15rem;
  padding-bottom: 0.15rem;
  z-index: 1;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.25s ease;
  position: relative;
}

.user-card-wrapper:hover {
  border-top-color: var(--euro-pink);
  border-bottom-color: var(--euro-pink);
  box-shadow: 0 4px 20px rgba(255, 0, 135, 0.2);
  background: rgba(255, 255, 255, 0.07);
}

/* Top 3 special styling */
.user-card-wrapper:has(.pos-1) {
  border-top-color: var(--euro-gold);
  box-shadow: 0 2px 16px rgba(218, 183, 29, 0.15);
}

.user-card-wrapper:has(.pos-2) {
  border-top-color: rgba(192, 192, 192, 0.6);
}

.user-card-wrapper:has(.pos-3) {
  border-top-color: rgba(205, 127, 50, 0.5);
}

.room-title-container {
  position: sticky;
  top: 0;
  width: 100%;
  height: 5dvh;
  margin-bottom: 1rem;
  z-index: 5;
  border-bottom: 2px solid var(--euro-gold);
  padding: .5rem;
  display: flex;
  align-items: center;
}

.room-title-container h2 {
  color: var(--euro-gold);
  text-shadow: 0 0 12px rgba(218, 183, 29, 0.3);
  font-size: 1.1rem;
  margin: 0;
}

.user-card {
  display: flex;
  width: 100%;
  align-items: stretch;
}

.animate {
  animation: slide-in-left 0.5s ease-in;
}

@keyframes slide-in-left {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.user-card-position {
  width: 13%;
  background: linear-gradient(135deg, rgba(255, 0, 135, 0.2) 0%, rgba(255, 0, 135, 0.05) 100%);
  clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: -1rem;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 8px rgba(255, 0, 135, 0.3);
  position: relative;
  z-index: 2;
}

/* Top 3 position badges */
.pos-1 {
  color: var(--euro-gold) !important;
  font-size: 1.3rem !important;
  text-shadow: 0 0 16px rgba(218, 183, 29, 0.5) !important;
  background: linear-gradient(135deg, rgba(218, 183, 29, 0.2) 0%, rgba(218, 183, 29, 0.05) 100%) !important;
}

.pos-2 {
  color: rgba(192, 192, 192, 0.9) !important;
  text-shadow: 0 0 10px rgba(192, 192, 192, 0.3) !important;
}

.pos-3 {
  color: rgba(205, 127, 50, 0.9) !important;
  text-shadow: 0 0 10px rgba(205, 127, 50, 0.3) !important;
}

.user-card-image {
  width: 18%;
  clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 23% 100%);
  background-color: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: -1.2rem;
  z-index: 1;
  overflow: hidden;
}

.user-card-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.user-card-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-left: 0.8rem;
}

.user-card-info {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: 0.15rem;
  border-radius: 2px;
}

.user-card-info p {
  font-weight: bold;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.user-card-total {
  width: 15%;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(218, 183, 29, 0.2);
  padding: 0.3rem;
  font-weight: bold;
  color: var(--euro-pink);
  font-size: 1.2rem;
  text-shadow: 0 0 8px rgba(255, 0, 135, 0.3);
  background: rgba(255, 0, 135, 0.04);
}

.user-card-total::before {
  content: "PTS";
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  margin-bottom: 0.1rem;
}

.user-card-data p {
  color: white;
  margin: 0;
}

.user-card-countries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding: 0.15rem 0;
}

.country-wrapper {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex: 0 0 auto;
  min-width: 0;
}

.country-wrapper p {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  white-space: nowrap;
  color: white;
}

.user-winner {
  font-weight: bold;
  color: var(--euro-gold) !important;
  text-shadow: 0 0 10px rgba(218, 183, 29, 0.6) !important;
  font-size: 1rem;
}

/* Winner star indicator */
.user-winner::after {
  content: " ★";
  color: var(--euro-gold);
  font-size: 1.1rem;
}

@media (min-width: 1000px) {
  .user-card-position {
    margin-right: -3rem;
  }

  .country-wrapper {
    margin: 0.1rem;
    margin-bottom: 0.4rem;
  }

  .user-card-image {
    margin-right: -3rem;
  }

  .room-title-container h2 {
    font-size: 1.3rem;
  }
}
</style>
<style src="flag-icons/css/flag-icons.min.css"></style>
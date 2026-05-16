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

<style scoped>
.user-card-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  height: 85px;
  clip-path: polygon(0% 0%, 97% 0%, 100% 100%, 3% 100%);
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  z-index: 1;
}

.room-title-container{
  position: sticky;
  top: 0;
  width: 100%;
  background-color: white;
  height: 5dvh;
  margin-bottom: 1rem;
  z-index: 5;
  border-bottom: 2px solid black;
  padding: .5rem;
}

.user-card {
  display: flex;
  width: 100%;
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

.user-card-position{
  width: 15%;
  background-color: rgb(255, 255, 255, .5);
  clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: -1rem;
}

.user-card-image{
  width: 20%;
  clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 23% 100%);
  background-color: rgb(255, 255, 255, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: -1.5rem;
  z-index: 60;
}

.user-card-image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.user-card-data {
  width: 70%;
  display: flex;
  flex-direction: column;
}

.user-card-info {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  padding-right: 1rem;
  background-color: rgba(245, 245, 245, 0.15);
  margin-bottom: 0.2rem;
}

.user-card-total {
  width: 17%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-left: 1px solid black;
  padding: 0.5rem;
  font-weight: bold;
}

.user-card-countries {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-left: 1rem;
}

.country-wrapper {
  margin: 0.1rem;
  margin-bottom: 0.4rem;
  width: 30%;
}

.user-winner {
  font-weight: bold;
  color: var(--euro-pink);
}

@media (min-width: 1000px) {
  .user-card-position{
    margin-right: -3rem;
  }

  .country-wrapper {
    margin: 0.1rem;
    margin-bottom: 0.4rem;
    width: 25%;
  }
  .user-card-image{
    margin-right: -3rem;
  }

}
</style>
<style src="flag-icons/css/flag-icons.min.css"></style>
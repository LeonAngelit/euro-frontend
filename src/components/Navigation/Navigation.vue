<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { Icon } from '@iconify/vue'
import AdminPanel from '../AdminPanel/AdminPanel.vue'
import useHandleCloseSession from '../../composables/useHandleCloseSession'
import axios from 'axios'
import config from '../../config/config'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()

const userMenu = ref(false)
const adminPanel = ref(false)
const passwordRef = ref<HTMLInputElement | null | undefined>(null)
const error = ref<any>({})

const callbackUrl = computed(() => {
  if (window.location.href.includes('callback_url=') && window.location.href.includes(config.joinRoomLink)) {
    return '?callback_url=' + window.location.href.split('callback_url=')[1]
  }
  return ''
})

async function loginAdmin(event: Event) {
  event.preventDefault()
  const pass = passwordRef.value?.value?.split('').reverse().join('') || ''
  try {
    const response = await axios.get(`${config.baseUrl}updatable`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    }).then(async (response) => {
      if (response.status == 200) {
        if (
          pass == response.data.master_password
        ) {
          store.setUpdatable(response.data)
          router.push("/admin")
        } else {
          error.value = {
            status: true,
            message: t('nav.wrongPassword'),
          }
        }
      }
      adminPanel.value = false
      return
    })
      .catch((error) => {
        error.value = {
          status: true,
          message: error.response.data.message || error,
        }
        adminPanel.value = false
        return
      });
  } catch (err: any) {
    error.value = {
      status: true,
      message: err.response?.data?.message || t('nav.wrongPassword'),
    }
    adminPanel.value = false
    return
  }
}

function handleMenu(event: Event) {
  event.preventDefault()
  userMenu.value = !userMenu.value
}

function handleMenuHome() {
  if (userMenu.value) {
    userMenu.value = false
  }
}

function handleClickProfile() {
  userMenu.value = !userMenu.value
}

function handleAdmin(event: Event) {
  event.preventDefault()
  adminPanel.value = true
  userMenu.value = false
}

function handleCloseSession() {
  userMenu.value = false
  useHandleCloseSession(store)
}

function handleLeaveRoom() {
  store.setCurrentRoom(undefined)
  userMenu.value = false
}
</script>

<template>
  <header class="header-container">
    <div class="header">
      <div class="home-container">
        <router-link :to="'/' + callbackUrl" class="header-text" @click="handleMenuHome">
          <div class="header-icon-container">
            <Icon icon="mdi:star" style="color: #FF0087; font-size: 40px;" />
            <p>{{ $t('nav.euroContest') }}</p>
          </div>
        </router-link>
      </div>
      <template v-if="store.userLogged">
        <div class="profile-button-container">
          <button class="profile-button" @click="handleMenu">
            <img
              :src="(store.userLogged as any)?.image ? `${(store.userLogged as any)?.image}` : `${config.defProfilePicUrl}${(store.userLogged as any)?.username}`"
              :alt="$t('nav.userImage')" />
          </button>
        </div>
      </template>
    </div>
    <div :class="userMenu ? 'user-menu menu-visible' : 'user-menu'">
      <ul>
        <li>
          <router-link to="/profile" @click="handleClickProfile">
            {{ $t('nav.profile') }}
          </router-link>
        </li>
        <li v-if="(store.userLogged as any)?.username == config.appAdmin">
          <router-link to="/" @click="handleAdmin">
            {{ $t('nav.admin') }}
          </router-link>
        </li>
        <li v-if="store.currentRoom?.current != undefined">
          <router-link to="/app" @click="handleLeaveRoom">
            {{ $t('nav.leaveRoom') }}
          </router-link>
        </li>
        <li>
          <router-link to="/archive" @click="handleClickProfile">
            {{ $t('nav.archive') }}
          </router-link>
        </li>
        <li>
          <router-link to="/login" @click="handleCloseSession">
            {{ $t('nav.logout') }}
          </router-link>
        </li>
      </ul>
    </div>
    <AdminPanel v-if="adminPanel" :action="loginAdmin" :refer="(el: any) => passwordRef = el" :error="error"
      :close="() => (adminPanel = false)" />
  </header>
</template>

<style scoped>
.header-container {
  max-width: 100vw;
  z-index: 30;
  position: sticky;
  top: 0;
}

.header {
  display: flex;
  position: relative;
  max-width: 100vw;
  height: 8vh;
  background-color: var(--primary-color);
  justify-content: space-between;
  z-index: 10;
}

.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  margin-left: .5rem;
}

.header-icon-container {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.header-text,
.header-text:link,
.header-text:visited,
.header-text:hover,
.header-text:active {
  text-decoration: none;
  color: whitesmoke;
}

.home-container a {
  display: flex;
  width: 100%;
}

.nav-container {
  width: 80%;
  display: flex;
  justify-content: space-between;
}

.navigation {
  width: 100%;
  display: flex;
  align-items: center;
}

.navigation ul {
  list-style: none;
  display: flex;
  width: 50%;
  justify-content: space-evenly;
}

.navigation ul li {
  font-size: medium;
}

.navigation a {
  text-decoration: none;
  color: whitesmoke;
  padding: 0.5rem;
  font-size: 1.5vw;
  width: 100%;
}

.navigation a:hover {
  text-decoration: none;
  color: var(--primary-color);
  border-radius: 0.5rem;
  background-color: whitesmoke;
}

.profile-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15%;
}

.profile-button:hover {
  cursor: pointer;
}

.mobile-nav-container {
  display: none;
  width: 10%;
  align-items: center;
}

.mobile-nav-toggle {
  width: 100%;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
}

.mobile-nav-toggle:hover {
  cursor: pointer;
}

.mobile-links {
  width: 60vw;
  background-color: rgba(245, 245, 245, 0.8);
  border-radius: 0.25rem;
  position: absolute;
  top: 10vh;
  left: -100%;
  transition: all 0.25s;
  visibility: hidden;
}

.mobile-links ul {
  list-style: none;
}

.mobile-links li {
  margin: 1rem;
}

.mobile-links li:hover {
  background-color: var(--primary-color);
}

.mobile-links a {
  text-decoration: none;
  color: var(--primary-color);
  padding: 0.2rem;
  width: 100%;
}

.mobile-links li:hover a {
  color: whitesmoke;
}

.links-visible {
  left: 0;
  visibility: visible;
  z-index: 3;
}

.user-menu {
  max-width: 50vw;
  min-width: 15vw;
  position: absolute;
  top: -100%;
  right: 0;
  background-color: rgba(245, 245, 245, 0.8);
  border-radius: 0.25rem;
  transition: all 0.10s;
  visibility: hidden;
}

.user-menu ul {
  list-style: none;
}

.user-menu li {
  display: flex;
  justify-content: flex-end;
  margin: 1rem;
}

.user-menu li:hover {
  background-color: var(--primary-color);
  cursor: pointer;
}

.user-menu a {
  text-decoration: none;
  color: var(--primary-color);
  padding: 0.2rem;
  text-align: right;
  width: 100%;
}

.user-menu button {
  width: 100%;
  background: none;
  border: none;
}

.menu-visible {
  visibility: visible;
  top: 8vh;
  z-index: -5;
}

.user-menu li:hover a {
  color: whitesmoke;
}

.user-menu li:hover button {
  color: whitesmoke;
  cursor: pointer;
}

@media (max-width: 600px) {
  .nav-container {
    display: none;
  }
  .mobile-nav-container {
    display: flex;
    width: 10%;
  }


}

@media (min-width: 1000px) {
  .profile-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5%;
  }

}
</style>
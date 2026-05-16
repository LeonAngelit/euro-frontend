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
const passwordRef = ref<HTMLInputElement | null>(null)
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
    const response = await axios.post(`${config.baseUrl}updatable/verify-password`, {
      password: pass,
    }, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    if (response.status == 200) {
      store.setUpdatable(response.data)
      router.push('/admin')
    }
  } catch (err: any) {
    error.value = {
      status: true,
      message: err.response?.data?.message || t('nav.wrongPassword'),
    }
  }
  adminPanel.value = false
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
    <AdminPanel v-if="adminPanel" :action="loginAdmin" :refer="passwordRef" :error="error"
      :close="() => (adminPanel = false)" />
  </header>
</template>

<style src="../../Components/Navigation/Navigation.component.css"></style>
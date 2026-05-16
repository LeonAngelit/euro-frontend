import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import getSongs from '../composables/useGetSongs'

interface User {
  id: number
  username: string
  email: string | null
  image: string
  countries: number[]
  rooms: any[]
  [key: string]: any
}

interface RoomState {
  current?: any
  [key: string]: any
}

interface Updatable {
  refresh_enabled?: boolean
  updatable?: boolean
  updatable_user?: boolean
  master_password?: string
  [key: string]: any
}

interface ModalState {
  visible?: boolean
  message?: string
  status?: string
  confirm?: boolean | any
  component?: any
  onaccept?: () => void
  onclick?: () => void
  [key: string]: any
}

interface SelectionState {
  current: number[]
}

const STORAGE_KEY = 'app-context'

// Custom storage that reads from localStorage first, then sessionStorage,
// and writes to localStorage when remember_user is true, sessionStorage otherwise.
const appContextStorage = {
  getItem: (key: string): string | null => {
    const localStr = window.localStorage.getItem(key)
    if (localStr) return localStr
    const sessionStr = window.sessionStorage.getItem(key)
    if (sessionStr) return sessionStr
    return null
  },
  setItem: (key: string, value: string): void => {
    try {
      const parsed = JSON.parse(value)
      if (parsed.remember_user) {
        window.localStorage.setItem(key, value)
        window.sessionStorage.setItem(key, value)
      } else {
        window.sessionStorage.setItem(key, value)
        window.localStorage.removeItem(key)
      }
    } catch {
      window.sessionStorage.setItem(key, value)
    }
  },
  removeItem: (key: string): void => {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

export const useAppStore = defineStore('app', () => {
  const userLogged = ref<User | false>(false)
  const rememberUser = ref<boolean>(false)
  const currentRoom = ref<RoomState | undefined>(undefined)
  const songs = ref<any[]>([])
  const updatable = ref<Updatable | undefined>(undefined)
  const selection = ref<SelectionState>({ current: [] })
  const xToken = ref<string>('')
  const modal = ref<ModalState>({})

  function setUserLogged(user: User | false) {
    userLogged.value = user
  }

  function setRememberUser(remember: boolean) {
    rememberUser.value = remember
    if (!remember) {
      window.localStorage.clear()
    }
  }

  function setCurrentRoom(room: RoomState | undefined) {
    currentRoom.value = room
  }

  function setSongs(s: any[]) {
    songs.value = s
  }

  function setUpdatable(u: Updatable | undefined) {
    updatable.value = u
  }

  function setSelection(s: SelectionState) {
    selection.value = s
  }

  function setXToken(t: string) {
    xToken.value = t
  }

  function setModal(m: ModalState) {
    modal.value = m
  }

  function closeSession() {
    setRememberUser(false)
    setUserLogged(false)
    setSelection({ current: [] })
    setCurrentRoom(undefined)
    setSongs([])
    setXToken('')
    setUpdatable(undefined)
    setModal({})
    window.localStorage.clear()
    window.sessionStorage.removeItem(STORAGE_KEY)
  }

  async function fetchSongs() {
    if (xToken.value && songs.value.length === 0) {
      const data = await getSongs(xToken.value)
      if (Array.isArray(data)) {
        setSongs(data)
      }
    }
  }

  // Fetch songs when token is set
  watch(xToken, (newToken) => {
    if (newToken && songs.value.length === 0) {
      fetchSongs()
    }
  })

  return {
    userLogged,
    rememberUser,
    currentRoom,
    songs,
    updatable,
    selection,
    xToken,
    modal,
    setUserLogged,
    setRememberUser,
    setCurrentRoom,
    setSongs,
    setUpdatable,
    setSelection,
    setXToken,
    setModal,
    closeSession,
    fetchSongs,
  }
}, {
  persist: {
    key: STORAGE_KEY,
    storage: appContextStorage,
    paths: ['userLogged', 'rememberUser', 'currentRoom', 'songs', 'updatable', 'selection', 'xToken'],
  },
})

export type { User, RoomState, Updatable, ModalState, SelectionState }
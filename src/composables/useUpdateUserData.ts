import axios from 'axios'
import config from '../config/config'
import type { Router } from 'vue-router'
import type { useAppStore } from '../stores/app'

async function useUpdateUserData(store: ReturnType<typeof useAppStore>, router: Router): Promise<void> {
  await axios
    .get(`${config.baseUrl}users/${(store.userLogged as any)?.id}`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setUserLogged(response.data)
      }
    })
    .then(() => {
      router.push('/app')
    })
    .catch((error) => {
      return error.response?.data?.message
    })
}

export default useUpdateUserData
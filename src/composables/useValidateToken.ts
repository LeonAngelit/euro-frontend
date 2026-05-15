import axios from 'axios'
import config from '../config/config'
import type { useAppStore } from '../stores/app'

async function useValidateToken(store: ReturnType<typeof useAppStore>): Promise<boolean> {
  try {
    const response = await axios.get(
      `${config.baseUrl}users/validateToken/${(store.userLogged as any)?.id}`,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    if (response.status == 200) {
      return response.data.isValidToken
    } else {
      return false
    }
  } catch {
    return false
  }
}

export default useValidateToken
import axios from 'axios'
import config from '../config/config'
import type { useAppStore } from '../stores/app'

async function useGetAuthToken(store: ReturnType<typeof useAppStore>): Promise<string | null> {
  try {
    const response = await axios.get(`${config.baseUrl}getAuthToken`, {
      headers: {
        Accept: 'application/json',
        Authorization: config.authP,
      },
    })

    if (response.status === 200) {
      store.setXToken(response.data)
      return response.data
    }
    return null
  } catch (error: any) {
    console.error('Auth token error:', error.response?.data?.message || error.message)
    return null
  }
}

export default useGetAuthToken
import axios from 'axios'
import config from '../config/config'

async function getSongs(xToken: string): Promise<any[]> {
  try {
    const response = await axios.get(`${config.baseUrl}countries`, {
      headers: {
        Accept: 'application/json',
        Bearer: xToken,
      },
    })
    if (response.status === 200) {
      return response.data
    }
    return []
  } catch (error) {
    console.error('Error fetching songs:', error)
    return []
  }
}

export default getSongs
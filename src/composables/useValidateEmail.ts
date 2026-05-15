import axios from 'axios'
import config from '../config/config'
import type { useAppStore } from '../stores/app'

interface ValidateEmailResult {
  result: boolean
  data: any
}

async function useValidateEmail(store: ReturnType<typeof useAppStore>, argToken: string): Promise<ValidateEmailResult> {
  let responseReturn: ValidateEmailResult = { result: false, data: null }

  if (!argToken) {
    return { result: false, data: null }
  }

  await axios
    .post(
      `${config.baseUrl}users/updateUserEmail/${(store.userLogged as any)?.id}`,
      { token: argToken },
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken as string,
        },
      },
    )
    .then((response) => {
      if (response.status == 200) {
        responseReturn = {
          result: true,
          data: response.data,
        }
      } else {
        responseReturn = {
          result: false,
          data: response,
        }
      }
    })
    .catch((error) => {
      responseReturn = {
        result: false,
        data: error.response?.data?.message,
      }
    })

  return responseReturn
}

export default useValidateEmail
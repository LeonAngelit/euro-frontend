<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import { validateEmailRegex } from '../../utils/regexUtils'
import Form from '../../components/Form/Form.vue'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useValidateEmail from '../../composables/useValidateEmail'
import useUpdateUserData from '../../composables/useUpdateUserData'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
const emailRef = ref<HTMLInputElement | null>(null)
const error = ref<any>(false)
const emailSent = ref(false)

async function validateUserToken() {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    useNavigateWithCallback(router, '/login')
  }
}

watch(() => emailSent.value, async () => {
  if (window.location.href.includes(config.confirmemailLink) && emailSent.value) {
    const response = await useValidateEmail(store, window.location.href.split(config.confirmemailLink)[1])
    if (response.result) {
      store.setModal({
        visible: true,
        message: t('missingEmail.emailConfirmed'),
        status: 'success',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
      useUpdateUserData(store, router)
    } else {
      store.setModal({
        visible: true,
        message: response.data,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
      useNavigateWithCallback(router, '/missing-email')
    }
  }
  if ((store.userLogged as any)?.email != null && !emailSent.value) {
    useNavigateWithCallback(router, '/app')
  }
})

watch(() => store.userLogged, async () => {
  if (store.userLogged) {
    validateUserToken()
    await isEmailSent()
    if ((store.userLogged as any)?.email != null) {
      useNavigateWithCallback(router, '/app')
    }
  }
})

async function isEmailSent() {
  try {
    const mailResponse = await axios.get(
      `${config.baseUrl}users/validateEmailSent/${(store.userLogged as any)?.id}`,
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    emailSent.value = mailResponse.data?.emailSent || false
  } catch {
    emailSent.value = false
  }
}

async function requestEmail(event: Event) {
  event.preventDefault()
  if (
    !validateEmailRegex(emailRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: t('validation.invalidEmail'),
      },
    )
  ) {
    return
  }
  error.value = false
  await axios
    .put(
      `${config.baseUrl}users/${(store.userLogged as any)?.id}`,
      { email: emailRef.value?.value },
      {
        headers: {
          Accept: 'application/json',
          Bearer: store.xToken,
        },
      },
    )
    .then((response) => {
      if (response.status == 200) {
        store.setModal({
          visible: true,
          message: t('missingEmail.emailSent'),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
        emailSent.value = true
      }
    })
    .catch((err) => {
      store.setModal({
        visible: true,
        message: err.response?.data?.message,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
    })
}
</script>

<template>
  <div class="container">
    <template v-if="store.userLogged && (store.userLogged as any)?.email == null">
      <template v-if="!emailSent">
        <div>
          <p style="text-align: center">
            {{ $t('missingEmail.intro') }}
          </p>
          <p style="font-weight: bold; margin-top: 1rem; text-align: center">
            {{ $t('missingEmail.formInstruction') }}
          </p>
          <Form
            :action="requestEmail"
            :error="error"
            :submitValue="$t('missingEmail.submit')"
            :fields="[
              {
                name: 'email',
                placeholder: $t('missingEmail.emailPlaceholder'),
                type: 'email',
                ref: emailRef,
                required: true,
              },
            ]"
          />
        </div>
      </template>
      <template v-else>
        <div>
          <p style="text-align: center">
            {{ $t('missingEmail.checkInbox') }}
          </p>
          <br />
          <p style="font-weight: bold; margin-top: 1rem; text-align: center">{{ $t('missingEmail.checkSpam') }}</p>
        </div>
      </template>
    </template>
    <template v-else>
      <div>
        <p style="text-align: center">
          {{ $t('missingEmail.redirectSuccess') }}
        </p>
        <br />
        <p style="font-weight: bold; margin-top: 1rem; text-align: center">{{ $t('missingEmail.manualReload') }}</p>
      </div>
    </template>
  </div>
</template>
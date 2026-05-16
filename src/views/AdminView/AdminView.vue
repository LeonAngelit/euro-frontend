<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import axios from 'axios'
import Form from '../../components/Form/Form.vue'
import { validateRegex } from '../../utils/regexUtils'
import useHandleCloseSession from '../../composables/useHandleCloseSession'
import Collapsible from '../../components/Collapsible/Collapsible.vue'
import config from '../../config/config'

const { t } = useI18n()
const store = useAppStore()
const error = ref<any>({})
const passRef = ref<HTMLInputElement | null>(null)
const passTwoRef = ref<HTMLInputElement | null>(null)
const modelRef = ref<HTMLSelectElement | null>(null)
const promptRef = ref<HTMLTextAreaElement | null>(null)
const roomNameRef = ref<HTMLInputElement | null>(null)
const imgPathRef = ref<HTMLInputElement | null>(null)
const framesRef = ref<HTMLInputElement | null>(null)
const strengthRef = ref<HTMLInputElement | null>(null)
const genStepsRef = ref<HTMLInputElement | null>(null)
const cfgRef = ref<HTMLInputElement | null>(null)
const endPercentRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  if (!store.userLogged || (store.userLogged as any)?.username !== config.appAdmin) {
    useHandleCloseSession(store)
  }
  await fetchUpdatable()
})

async function fetchUpdatable() {
  await axios
    .get(`${config.baseUrl}updatable`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setUpdatable(response.data)
      }
    })
}

async function setUpdatable(event: Event) {
  const target = event.target as HTMLElement
  let data: any = {}
  if (target.id == 'updatable_countries') {
    data = { updatable: !store.updatable?.updatable }
  }
  if (target.id == 'updatable_users') {
    data = { updatable_user: !store.updatable?.updatable_user }
  }
  if (target.id == 'updatable_refresh_enabled') {
    data = { refresh_enabled: !store.updatable?.refresh_enabled }
  }
  if (event.type == 'submit') {
    if (passRef.value?.value != passTwoRef.value?.value) {
      error.value = { status: true, message: t('validation.passwordsDontMatch') }
      return
    }
    if (
      !validateRegex(passRef.value?.value || '', () =>
        error.value = {
          status: true,
          message: t('validation.invalidPassword'),
        },
      )
    ) {
      return
    }
    data = { master_password: passRef.value!.value }
  }

  await axios
    .put(`${config.baseUrl}updatable`, data, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setUpdatable(response.data)
        store.setModal({
          visible: true,
          message: t('layout.updateSuccess'),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
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

async function archiveResults() {
  await axios
    .get(`${config.baseUrl}archive/results/${new Date().getFullYear()}`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setModal({
          visible: true,
          message: response.data.message,
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
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

async function sendModelRequest(data: any) {
  await axios
    .post(`${config.baseUrl}${config.requestsUrl}`, data, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setModal({
          visible: true,
          message: response.data.message,
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
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

async function deleteRequests() {
  await axios
    .delete(`${config.baseUrl}${config.requestsBaseUrl}`, {
      headers: {
        Accept: 'application/json',
        Bearer: store.xToken,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        store.setModal({
          visible: true,
          message: response.data.toString(),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
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

async function handleCreateRequest(event: Event) {
  event.preventDefault()
  let data: any
  switch (modelRef.value?.value) {
    case 'clean':
      data = { model: modelRef.value?.value, imgPath: 'no need' }
      await sendModelRequest(data)
      break
    case 'image_to_video':
      data = {
        model: modelRef.value?.value,
        imgPath: imgPathRef.value?.value,
        frames: framesRef.value?.value,
        prompt: promptRef.value?.value,
      }
      await sendModelRequest(data)
      break
    case 'anime_to_real':
      data = {
        model: modelRef.value?.value,
        endPercent: endPercentRef.value?.value,
        strength: strengthRef.value?.value,
        genSteps: genStepsRef.value?.value,
        cfg: cfgRef.value?.value,
        imgPath: imgPathRef.value?.value,
        prompt: promptRef.value?.value,
      }
      await sendModelRequest(data)
      break
    case 'generate_image':
      data = { model: modelRef.value?.value, prompt: promptRef.value?.value, imgPath: 'no need' }
      await sendModelRequest(data)
      break
    case 'upscale':
      data = { model: modelRef.value?.value, imgPath: imgPathRef.value?.value }
      await sendModelRequest(data)
      break
    case 'delete':
      await deleteRequests()
      break
    default:
      console.error('invalid option')
  }
}
</script>

<template>
  <div class="container">
    <div class="buttons-container">
      <button
        v-if="store.updatable?.updatable"
        class="admin-button button-green"
        id="updatable_countries"
        @click="setUpdatable"
      >
        {{ $t('admin.votingOk') }}
      </button>
      <button
        v-else
        class="admin-button button-red"
        id="updatable_countries"
        @click="setUpdatable"
      >
        {{ $t('admin.votingNo') }}
      </button>

      <button
        v-if="store.updatable?.updatable_user"
        class="admin-button button-green"
        id="updatable_users"
        @click="setUpdatable"
      >
        {{ $t('admin.registrationOk') }}
      </button>
      <button
        v-else
        class="admin-button button-red"
        id="updatable_users"
        @click="setUpdatable"
      >
        {{ $t('admin.registrationNo') }}
      </button>

      <button
        v-if="store.updatable?.refresh_enabled"
        class="admin-button button-green"
        id="updatable_refresh_enabled"
        @click="setUpdatable"
      >
        {{ $t('admin.pointsOk') }}
      </button>
      <button
        v-else
        class="admin-button button-red"
        id="updatable_refresh_enabled"
        @click="setUpdatable"
      >
        {{ $t('admin.pointsNo') }}
      </button>

      <button
        class="admin-button button-blue"
        id="archive_results"
        @click="archiveResults"
      >
        {{ $t('admin.exportResults') }}
      </button>
    </div>
    <Collapsible :title="$t('admin.changePassword')">
      <Form
        :action="setUpdatable"
        :error="error"
        :submitValue="$t('admin.submit')"
        :showPassword="true"
        :fields="[
          {
            name: 'password',
            placeholder: $t('admin.passwordPlaceholder'),
            id: 'passwordField',
            type: 'password',
            ref: passRef,
          },
          {
            name: 'password',
            placeholder: $t('admin.repeatPasswordPlaceholder'),
            id: 'passwordTwoField',
            type: 'password',
            ref: passTwoRef,
          },
        ]"
      />
    </Collapsible>
    <div class="requests-container">
      <select ref="modelRef">
        <option value="clean">{{ $t('admin.cleanRequest') }}</option>
        <option value="image_to_video">{{ $t('admin.img2videoRequest') }}</option>
        <option value="anime_to_real">{{ $t('admin.animeToRealRequest') }}</option>
        <option value="generate_image">{{ $t('admin.generateImageRequest') }}</option>
        <option value="upscale">{{ $t('admin.upscaleRequest') }}</option>
        <option value="delete">{{ $t('admin.deleteRequest') }}</option>
      </select>
      <textarea :placeholder="$t('admin.promptPlaceholder')" ref="promptRef"></textarea>
      <Form
        :action="handleCreateRequest"
        :submitValue="$t('admin.submit')"
        :fields="[
          { name: 'imgPath', placeholder: 'imgPath', id: 'imgPath', type: 'text', ref: imgPathRef, required: false },
          { name: 'frames', placeholder: 'frames', id: 'frames', type: 'text', ref: framesRef, required: false },
          { name: 'strength', placeholder: 'strength', id: 'strength', type: 'text', ref: strengthRef, required: false },
          { name: 'genSteps', placeholder: 'genSteps', id: 'genSteps', type: 'text', ref: genStepsRef, required: false },
          { name: 'cfg', placeholder: 'cfg', id: 'cfg', type: 'text', ref: cfgRef, required: false },
          { name: 'endPercent', placeholder: 'endPercent', id: 'endPercent', type: 'text', ref: endPercentRef, required: false },
        ]"
      />
    </div>
  </div>
</template>

<style src="../../Views/AdminView/AdminView.componen.css"></style>
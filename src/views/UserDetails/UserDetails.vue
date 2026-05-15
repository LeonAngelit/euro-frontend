<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import CountryPicker from '../../components/CountryPicker/CountryPicker.vue'
import Collapsible from '../../components/Collapsible/Collapsible.vue'
import Form from '../../components/Form/Form.vue'
import axios from 'axios'
import { validateEmailRegex, validateRegex, validateUserNameRegex } from '../../utils/regexUtils'
import config from '../../config/config'
import useNavigateWithCallback from '../../composables/useNavigateWithCallback'
import useValidateToken from '../../composables/useValidateToken'
import useHandleCloseSession from '../../composables/useHandleCloseSession'

const store = useAppStore()
const router = useRouter()
const preview = ref<string | null>(null)
const error = ref<any>({})
const currentCollapsed = ref(false)
const passRef = ref<HTMLInputElement | null>(null)
const pass2Ref = ref<HTMLInputElement | null>(null)
const userNameRef = ref<HTMLInputElement | null>(null)
const emailRef = ref<HTMLInputElement | null>(null)
const colorRef = ref<HTMLInputElement | null>(null)
const imageRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  const isValidToken = await useValidateToken(store)
  if (!store.userLogged || !isValidToken) {
    useHandleCloseSession(store)
    if (window.location.pathname == '/join-room' || window.location.href.includes(config.confirmemailLink)) {
      useNavigateWithCallback(router, '/login?callback_url=' + window.location.href)
    } else {
      useNavigateWithCallback(router, '/login')
    }
  }
  if ((store.userLogged as any)?.email == null && !window.location.href.includes(config.confirmemailLink)) {
    useNavigateWithCallback(router, '/missing-email')
  }
})

function handleCollapsed() {
  currentCollapsed.value = !currentCollapsed.value
}

async function updateUserData(event: Event, data: any) {
  await axios
    .put(
      `${config.baseUrl}users/${(store.userLogged as any)?.id}`,
      data,
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
          message: 'Actualización correcta',
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 5000)
        store.setUserLogged(response.data)
      }
    })
    .catch((error) => {
      store.setModal({
        visible: true,
        message: error.response?.data?.message,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 5000)
    })
}

function updateUserName(event: Event) {
  event.preventDefault()
  if (
    !validateUserNameRegex(userNameRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: 'Nombre de usuario no válido, debe contener 5 a 25 caracteres, evita caracteres especiales',
      },
    )
  ) {
    return
  }
  updateUserData(event, { username: userNameRef.value?.value })
}

function updateEmail(event: Event) {
  event.preventDefault()
  if (
    !validateEmailRegex(emailRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: 'Correo electrónico no válido',
      },
    )
  ) {
    return
  }
  updateUserData(event, { email: emailRef.value?.value })
}

function updatePassword(event: Event) {
  event.preventDefault()
  if (passRef.value?.value != pass2Ref.value?.value) {
    error.value = { status: true, message: 'Las contraseñas no coinciden' }
    return
  }
  if (
    !validateRegex(passRef.value?.value || '', () =>
      error.value = {
        status: true,
        message: 'Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula',
      },
    )
  ) {
    return
  }
  updateUserData(event, { password: passRef.value!.value })
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    preview.value = URL.createObjectURL(target.files[0])
  }
}

async function updateImage(event: Event) {
  event.preventDefault()
  if (!imageRef.value?.files?.[0]) return
  const formData = new FormData()
  formData.append('image', imageRef.value.files[0])
  updateUserData(event, formData)
}

function onImageChange(event: Event) {
  handleImageChange(event)
}
</script>

<template>
  <div class="details-container">
    <div class="section-one">
      <Collapsible :title="'Países seleccionados'" :collapsed="currentCollapsed" @toggle="handleCollapsed">
        <CountryPicker :countries="store.songs" :additionalAction="handleCollapsed" />
      </Collapsible>
    </div>

    <div class="section-two">
      <button class="delete-user-button">Eliminar cuenta</button>
    </div>
  </div>
</template>

<style src="../../Views/UserDetails/UserDetails.Component.css"></style>
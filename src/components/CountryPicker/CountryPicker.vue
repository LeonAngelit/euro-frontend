<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { Icon } from '@iconify/vue'
import axios from 'axios'
import config from '../../config/config'

interface CountryPickerProps {
  modal?: boolean
  additionalAction?: () => void
}

const props = defineProps<CountryPickerProps>()
const { t } = useI18n()
const store = useAppStore()

const songs = computed(() => store.songs)
const targetCount = computed(() => (songs.value?.length > 5 ? 6 : 5))
const continuar = ref(false)

watch(
  () => store.selection.current.length,
  () => {
    continuar.value = store.selection.current.length == targetCount.value
  },
)

async function handleContinue() {
  if (store.selection.current.length == targetCount.value) {
    const data = {
      userId: (store.userLogged as any)?.id,
      selection: store.selection.current,
    }
    try {
      const response = await axios.post(
        `${config.baseUrl}users/bulk/add-country/`,
        data,
        {
          headers: {
            Accept: 'application/json',
            Bearer: store.xToken,
          },
        },
      )
      if (response.status == 201) {
        store.setModal({
          visible: true,
          message: t('layout.updateSuccess'),
          status: 'success',
          confirm: store.setModal({}),
        })
        setTimeout(() => {
          store.setModal({})
        }, 3000)
        store.setUserLogged({
          ...(store.userLogged as any),
          countries: store.selection.current,
        })
      }
    } catch (error: any) {
      store.setModal({
        visible: true,
        message: error.response?.data?.message,
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 3000)
    }
    if (props.additionalAction) {
      props.additionalAction()
    }
  } else {
    store.setModal({
      visible: true,
      message: t('countryPicker.mustChoose', { count: targetCount.value }),
      status: 'error',
      confirm: store.setModal({}),
    })
    setTimeout(() => {
      store.setModal({})
    }, 3000)
  }
}

function validateSelection() {
  const elements = Array.from(document.getElementsByTagName('input'))
  if (store.selection.current.length == targetCount.value) {
    continuar.value = true
    elements.forEach((element) => {
      if (!element.checked) {
        element.disabled = true
        element.parentElement?.parentElement?.classList.add('disabled')
      }
    })
    return false
  }
  continuar.value = false
  elements.forEach((element) => {
    element.disabled = false
    element.parentElement?.parentElement?.classList.remove('disabled')
  })
  return true
}

function handleSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedCountriesTemp = [...store.selection.current]
  if (target.checked) {
    if (validateSelection()) {
      selectedCountriesTemp.push(parseInt(target.id))
      store.setSelection({ current: selectedCountriesTemp })
    } else {
      store.setModal({
        visible: true,
        message: t('countryPicker.cantChooseMore', { count: targetCount.value }),
        status: 'error',
        confirm: store.setModal({}),
      })
      setTimeout(() => {
        store.setModal({})
      }, 3000)
    }
  } else {
    const index = selectedCountriesTemp.indexOf(parseInt(target.id))
    if (index > -1) {
      selectedCountriesTemp.splice(index, 1)
    }
    store.setSelection({ current: selectedCountriesTemp })
    validateSelection()
  }
}
</script>

<template>
  <div class="countries-container">
    <p>
      {{ $t('countryPicker.instructions', {
        targetCount,
        sixthText: targetCount == 6 ? $t('countryPicker.sixthText') : '',
        highlightText: targetCount == 6 ? $t('countryPicker.highlightSixth') : $t('countryPicker.highlightFifth')
      }) }}
    </p>
    <div class="selected-countries-container">
      <p>{{ $t('countryPicker.selectedCountries') }} </p>
      <div class="selected-countries">
        <p
          v-for="(countryId, index) in store.selection.current"
          :key="index"
          :class="index == 0 ? 'winner-country' : index == 5 ? 'last-country' : ''"
        >
          {{ songs && songs.find((element: any) => element.id == countryId)?.name }}
        </p>
      </div>
    </div>
    <div v-if="continuar" class="continue-container">
      <button type="button" @click="handleContinue">
        {{ $t('countryPicker.continue') }}
      </button>
    </div>
    <template v-if="songs">
      <article
        v-for="country in songs"
        :key="country.id"
        :class="
          store.selection.current.includes(country.id)
            ? 'country-container country-selected-card'
            : 'country-container'
        "
      >
        <label :for="country.id">
          <div class="country-info-container">
            <p>
              <span :class="`fi fi-${country.code} fis country-flag-select`"></span>
              {{ country.name }}
            </p>
            <div v-if="country.link" class="song-link-container">
              <p class="song-container">
                {{ country.song?.replace('amp;', '') }}
              </p>
              <a :href="country.link" target="_blank" rel="noopener">
                <div class="header-icon-container">
                  <Icon icon="mdi:play-circle" style="color: rgb(255, 248, 0); font-size: 20px;" />
                </div>
              </a>
            </div>
          </div>
          <input
            type="checkbox"
            class="country-checkbox"
            :name="country.name"
            :default-checked="store.selection.current.includes(country.id)"
            :id="country.id"
            @change="handleSelect"
          />
        </label>
      </article>
    </template>
  </div>
</template>

<style src="../../Components/CountryPicker/CountryPicker.Component.css"></style>
<style src="flag-icons/css/flag-icons.min.css"></style>
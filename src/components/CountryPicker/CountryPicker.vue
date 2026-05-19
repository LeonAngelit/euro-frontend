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
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20px"
                    width="20px" xmlns="http://www.w3.org/2000/svg" style="color: rgb(255, 248, 0);">
                    <path
                      d="M106.854 106.002a26.003 26.003 0 0 0-25.64 29.326c16 124 16 117.344 0 241.344a26.003 26.003 0 0 0 35.776 27.332l298-124a26.003 26.003 0 0 0 0-48.008l-298-124a26.003 26.003 0 0 0-10.136-1.994z">
                    </path>
                  </svg>
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

<style scoped>
.countries-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 0.2rem;
  width: 100%;
}

.countries-container > p {
  padding: 1rem;
  color: white;
}

.country-container {
  width: 48%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border: 1px solid var(--euro-gold);
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.06);
  color: white;
  transition: all 0.2s ease;
}

.country-container:hover {
  border-color: var(--euro-pink);
  box-shadow: 0 0 10px rgba(255, 0, 135, 0.2);
}

.country-selected-card {
  border: 2px solid var(--euro-pink);
  background-color: rgba(255, 0, 135, 0.15);
  box-shadow: 0 0 16px rgba(255, 0, 135, 0.3);
}

.country-container.disabled {
  background-color: rgb(0, 0, 0, 0.2);
}

.country-container.disabled * {
  opacity: 0.7;
}

.country-container label {
  width: 100%;
  height: 100%;
}

.song-container {
  width: 100%;
  font-size: 14px;
  overflow: hidden;
}

.country-checkbox {
  width: 0;
  height: 0;
}

.country-info-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.country-info-container > p {
  font-weight: bold;
}

.song-link-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
}

.selected-countries-container {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 0.2rem;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--euro-gold);
}

.selected-countries-container > p {
  color: white;
}

.selected-countries p {
  color: white;
}

.selected-countries {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.selected-countries p {
  margin-right: 0.2rem;
}

.winner-country {
  font-weight: bold;
  text-decoration: underline;
}

.last-country {
  font-weight: bold;
  text-decoration: underline;
  color: var(--euro-yellow);
}

.continue-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.continue-container > button {
  width: 50%;
  padding: 0.75rem;
  color: white;
  font-weight: bold;
  background: linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%);
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  box-shadow: 0 0 16px rgba(255, 0, 135, 0.4);
  transition: all 0.2s ease;
}

.continue-container > button:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 24px rgba(255, 0, 135, 0.6);
}

.country-container label:hover,
.continue-container > button {
  cursor: pointer;
}

.continue-container > button:active {
  color: var(--primary-color);
  background-color: whitesmoke;
}
</style>
<style src="flag-icons/css/flag-icons.min.css"></style>
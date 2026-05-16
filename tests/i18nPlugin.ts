import { createI18n } from 'vue-i18n'
import es from '../src/locales/es.json'
import en from '../src/locales/en.json'

export const testI18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es, en },
})

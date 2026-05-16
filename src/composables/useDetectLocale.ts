const SPANISH_SPEAKING_COUNTRIES = new Set([
  'ES', // Spain
  'MX', // Mexico
  'AR', // Argentina
  'CO', // Colombia
  'PE', // Peru
  'VE', // Venezuela
  'CL', // Chile
  'EC', // Ecuador
  'GT', // Guatemala
  'CU', // Cuba
  'BO', // Bolivia
  'DO', // Dominican Republic
  'HN', // Honduras
  'PY', // Paraguay
  'SV', // El Salvador
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panama
  'UY', // Uruguay
  'GQ', // Equatorial Guinea
])

const STORAGE_KEY = 'user-locale'

async function fetchCountryCode(): Promise<string | null> {
  // Primary: ipapi.co
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (response.ok) {
      const data = await response.json()
      if (data.country_code) return data.country_code
    }
  } catch {
    // Fall through to secondary
  }

  // Fallback: ip-api.com
  try {
    const response = await fetch('http://ip-api.com/json/')
    if (response.ok) {
      const data = await response.json()
      if (data.countryCode) return data.countryCode
    }
  } catch {
    // Fall through to default
  }

  return null
}

export async function useDetectLocale(): Promise<string> {
  // 1. Check localStorage for a previously saved preference
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'es' || saved === 'en') {
    return saved
  }

  // 2. Call IP geolocation
  const countryCode = await fetchCountryCode()

  // 3. Map country code to locale
  if (countryCode && SPANISH_SPEAKING_COUNTRIES.has(countryCode.toUpperCase())) {
    const locale = 'es'
    localStorage.setItem(STORAGE_KEY, locale)
    return locale
  }

  // 4. Default fallback to Spanish
  const locale = 'es'
  localStorage.setItem(STORAGE_KEY, locale)
  return locale
}

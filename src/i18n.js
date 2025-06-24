import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const supported_locales = [
  "en", // ENGLISH
  "es", // SPANISH
  "fr" // FRENCH
]

export const incomplete_locales = [
  "fr" // FRENCH
]

function loadLocaleMessages_webpack() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function getLocales() {
  const messages = {}
  const locales = import.meta.glob('./locales/*.json')
  Object.keys(locales).forEach(async k => {
    const matched = k.match(/([A-Za-z0-9_-]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      const locale_msgs = await locales[k]()
      messages[locale] = locale_msgs
    }
  })
  return messages
}

export default new VueI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: getLocales()
})

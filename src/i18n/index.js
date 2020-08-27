import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { STORAGE_LOCALE } from '@/const'

import en from './en.yml'
import fr from './fr.yml'
import es from './es.yml'
import ar from './ar.yml'

// We need to 'Vue.use' it before constructing our instance
Vue.use(VueI18n)

const messages = { en, fr, es, ar }

const devClone = (obj, chain = []) =>
  Object.entries(obj).reduce(
    (dev, [key, value]) =>
      Object.assign(dev, {
        [key]:
          typeof value === 'string'
            ? '{{' + [...chain, key].join('.') + '}}'
            : devClone(obj[key], [...chain, key])
      }),
    {}
  )

if (process.env.NODE_ENV === 'development') {
  messages.dev = devClone(en)
}

const chosenLocale = localStorage.getItem(STORAGE_LOCALE) ?? 'en'

const i18n = new VueI18n({
  fallbackLocale: 'en',
  messages
})

setLocale(chosenLocale)

export function setLocale(newLocale) {
  console.debug('setLocale', newLocale)

  i18n.locale = newLocale
  const newDir = newLocale === 'ar' ? 'rtl' : 'ltr'

  const html = document.documentElement
  html.setAttribute('lang', newLocale)
  html.setAttribute('dir', newDir)
}

export function overrideLocale(newLocale) {
  localStorage.setItem(STORAGE_LOCALE, newLocale)
  console.debug('overrideLocale', localStorage.getItem(STORAGE_LOCALE))
  setLocale(newLocale)
}

export default i18n

import Vue from 'vue'
import VueI18n from 'vue-i18n'

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
            ? [...chain, key].join('.')
            : devClone(obj[key], [...chain, key])
      }),
    {}
  )

if (process.env.NODE_ENV === 'development') {
  // messages.dev = {}
  console.log(JSON.stringify(devClone(en), null, 2))
}

const i18n = new VueI18n({
  locale: 'en',
  messages
})

i18n.messages

export default i18n

import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './en.yml'
import fr from './fr.yml'
import es from './es.yml'
import ar from './ar.yml'

// We need to 'Vue.use' it before constructing our instance
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'fr',
  messages: { en, fr, es, ar }
})

export default i18n

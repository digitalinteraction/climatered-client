import VueGtag from 'vue-gtag'

import { STORAGE_ANALYTICS } from '@/const'
import { getGaToken } from '@/utils'
import router from '@/router'

export default class VueAnalytics {
  static install(Vue) {
    const id = getGaToken()

    const params = {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
      allow_google_signals: false
    }

    const enabled =
      process.env.NODE_ENV === 'production' &&
      localStorage[STORAGE_ANALYTICS] === 'accept' &&
      id !== null &&
      id !== ''

    Vue.use(
      VueGtag,
      {
        config: { id, params },
        enabled
      },
      router
    )
  }
}

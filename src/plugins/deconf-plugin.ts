import _Vue from 'vue'
import { Session } from '@openlab/deconf-shared'
import { DeconfPlugin, MetricsEvent } from '@openlab/deconf-ui-toolkit'
import { env } from './env-plugin'

export class IfrcDeconfPlugin implements DeconfPlugin {
  static install(Vue: typeof _Vue): void {
    Vue.prototype.$deconf = new IfrcDeconfPlugin()
  }

  getCalendarLink(session: Session): string {
    const url = new URL(`schedule/${session.id}/ics`, env.SERVER_URL)
    return url.toString()
  }
  trackMetric(metric: MetricsEvent): void {
    console.log('TODO: metrics %o', metric)
  }
}

import { MetricsEvent } from '@openlab/deconf-ui-toolkit'
import _Vue from 'vue'

import { SocketIoPlugin } from './socketio-plugin'

export class MetricsPlugin {
  static install(Vue: typeof _Vue): void {
    Vue.prototype.$metrics = new MetricsPlugin()

    Vue.config.errorHandler = function (error, vm, info) {
      console.error(error)
      MetricsPlugin.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
        info: info,
      })
    }
  }

  static track(metric: MetricsEvent): void {
    console.debug('MetricsPlugin ', metric.eventName)
    SocketIoPlugin.sharedSocket?.emit(
      'trackMetric',
      metric.eventName,
      metric.payload
    )
  }

  static error(error: unknown): void {
    SocketIoPlugin.sharedSocket?.emit('trackError', error)
  }

  // Methods to do the metrics
  track(metric: MetricsEvent): void {
    MetricsPlugin.track(metric)
  }
}

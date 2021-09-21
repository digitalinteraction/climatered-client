import _Vue from 'vue'

// import { env } from './env-plugin'

export class MetricsPlugin {
  static install(Vue: typeof _Vue): void {
    Vue.prototype.$metrics = new MetricsPlugin()
  }

  // Methods to do the metrics
}

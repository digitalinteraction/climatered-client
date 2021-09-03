import {
  createMetricsStoreModule,
  MetricsModule,
} from '@openlab/deconf-ui-toolkit'

export function metricsModule(): MetricsModule {
  return {
    ...createMetricsStoreModule(),
    actions: {
      // ...
    },
  }
}

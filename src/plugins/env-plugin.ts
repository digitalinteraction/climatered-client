import _Vue from 'vue'

export type EnvRecord = Readonly<{
  SELF_URL: string
  SERVER_URL: string
  BUILD_NAME: string | null
}>

function normaliseUrl(input: string) {
  return input.replace(/\/*$/, '/')
}

interface WindowWithConfig {
  CONFIG?: Record<string, string | undefined>
}

const {
  SELF_URL = 'http://localhost:8080/',
  SERVER_URL = 'http://localhost:3000/',
  BUILD_NAME = null,
} = (window as WindowWithConfig).CONFIG || {}

export const env = Object.seal({
  SELF_URL: normaliseUrl(SELF_URL),
  SERVER_URL: normaliseUrl(SERVER_URL),
  BUILD_NAME,
})

export class EnvPlugin {
  static install(Vue: typeof _Vue): void {
    Vue.prototype.$env = env
  }
}

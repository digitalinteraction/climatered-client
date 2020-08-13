export default class Clock {
  updates = []
  timerId = null

  static install(Vue) {
    Vue.prototype.$clock = new Clock()
  }

  setup() {
    this.timerId = setInterval(async () => {
      for (const { owner, callback } of this.updates) {
        try {
          await callback()
        } catch (error) {
          console.error('Error running tick')
          console.error(owner)
          console.error(error)
        }
      }
    }, 1000)
  }
  teardown() {
    if (!this.timerId) return

    clearInterval(this.timerId)
    this.timerId = null
  }

  bind(owner, callback) {
    this.updates = this.updates
      .filter(u => u.owner !== owner)
      .concat([{ callback, owner }])

    if (this.timerId === null && this.updates.length > 0) this.setup()
  }
  unbind(owner) {
    this.updates = this.updates.filter(u => u.owner !== owner)
    if (this.timerId && this.updates.length === 0) this.teardown()
  }
}

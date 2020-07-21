//
// WIP ~ helpers for translated markdown files?
//

export default class Content {
  static install(Vue) {
    const content = new Content()

    Vue.prototype.$content = content
  }

  load(name, cb) {
    cb({
      en: '...',
      fr: '...',
      es: '...',
      ar: '...'
    })

    Promise.all([
      import('../content/' + name + '/en.md'),
      import('../content/' + name + '/fr.md'),
      import('../content/' + name + '/es.md'),
      import('../content/' + name + '/ar.md')
    ]).then(modules => {
      const [en, fr, es, ar] = modules.map(m => m.default)
      cb({ en, fr, es, ar })
    })
  }
}

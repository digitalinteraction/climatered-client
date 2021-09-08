import _Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//
// Import brands ~ https://fontawesome.com/icons?d=gallery&s=brands
//
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

//
// Import solids ~ https://fontawesome.com/icons?d=gallery&s=solid
//
import {
  faArrowRight,
  faArrowLeft,
  faUser,
  faChevronRight,
  faLeaf,
  faSync,
} from '@fortawesome/free-solid-svg-icons'

//
// Import regulars ~ https://fontawesome.com/icons?d=gallery&s=regular
//
// import {  } from '@fortawesome/free-regular-svg-icons'

//
// Apply icons
// prettier-ignore
//
library.add(faArrowRight, faArrowLeft, faUser, faTwitter, faChevronRight, faLeaf, faSync)

export class FontAwesomePlugin {
  static install(Vue: typeof _Vue): void {
    Vue.component('fa', FontAwesomeIcon)
  }
}

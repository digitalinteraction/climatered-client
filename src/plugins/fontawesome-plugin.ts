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
  faChevronLeft,
  faChevronRight,
  faLeaf,
  faSync,
  faTerminal,
  faCodeBranch,
  faTags,
  faGlobe,
  faSave,
  faCalendarPlus,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faClock,
  faSearch,
  faTimes,
  faVideo,
  faCircle as fasCircle,
  faExclamationTriangle,
  faFire,
  faUserPlus,
  faGamepad,
  faComments,
  faMicrophone,
  faObjectGroup,
  faMapMarkerAlt,
  faPodcast,
} from '@fortawesome/free-solid-svg-icons'

//
// Import regulars ~ https://fontawesome.com/icons?d=gallery&s=regular
//
// TODO: remove in future
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'

//
// Apply icons
// prettier-ignore
//
library.add(faArrowRight, faArrowLeft, faUser, faTwitter, faChevronLeft, faChevronRight, faLeaf, faSync, faTerminal, faCodeBranch, faTags, faGlobe, faSave, faCalendarPlus, farCircle, faLongArrowAltRight, faLongArrowAltLeft, faClock, faSearch, faTimes, faVideo, fasCircle, faExclamationTriangle, faFire, faUserPlus, faGamepad, faComments, faMicrophone, faObjectGroup, faMapMarkerAlt, faPodcast,)

export class FontAwesomePlugin {
  static install(Vue: typeof _Vue): void {
    Vue.component('fa', FontAwesomeIcon)
  }
}

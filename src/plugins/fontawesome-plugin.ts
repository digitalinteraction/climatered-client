import _Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//
// Import brands ~ https://fontawesome.com/icons?d=gallery&s=brands
//
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

//
// Import solids ~ https://fontawesome.com/icons?d=gallery&s=solid
//
import {
  faArrowLeft,
  faArrowRight,
  faBackward,
  faCalendarPlus,
  faChevronLeft,
  faChevronRight,
  faCircle as fasCircle,
  faCodeBranch,
  faComments,
  faEdit,
  faEnvelope,
  faExclamationTriangle,
  faFastBackward,
  faFastForward,
  faFire,
  faForward,
  faGamepad,
  faGlobe,
  faIdBadge,
  faLeaf,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMapMarkerAlt,
  faMicrophone,
  faObjectGroup,
  faPlay,
  faPodcast,
  faSave,
  faSearch,
  faStop,
  faSync,
  faTags,
  faTerminal,
  faTimes,
  faUser,
  faUserPlus,
  faUsers,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'

//
// Import regulars ~ https://fontawesome.com/icons?d=gallery&s=regular
//
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'

// We manually add the css in App.vue so it all gets bundled together
config.autoAddCss = false

//
// Apply icons
// prettier-ignore
//
library.add(faArrowRight, faArrowLeft, faUser, faTwitter, faChevronLeft, faChevronRight, faLeaf, faSync, faTerminal, faCodeBranch, faTags, faGlobe, faSave, faCalendarPlus, farCircle, faLongArrowAltRight, faLongArrowAltLeft, faSearch, faTimes, faVideo, fasCircle, faExclamationTriangle, faFire, faUserPlus, faGamepad, faComments, faMicrophone, faObjectGroup, faMapMarkerAlt, faPodcast,faFastBackward, faBackward, faStop, faPlay, faForward, faFastForward, faUsers, faEnvelope, faEdit, faIdBadge)

export class FontAwesomePlugin {
  static install(Vue: typeof _Vue): void {
    Vue.component('fa', FontAwesomeIcon)
  }
}

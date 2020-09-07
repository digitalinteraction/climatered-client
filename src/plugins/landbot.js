import { setLocale } from '@/i18n'
import store from '@/store'

//
// Adds things to window for landbot to use
//
window.setLocale = setLocale
window.getUser = () => store.state.api.user
window.getProfile = () => store.state.api.profile

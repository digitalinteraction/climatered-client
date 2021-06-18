import moment from 'moment'
import 'moment-timezone'

const {
  API_URL = 'http://localhost:3000/',
  CDN_URL = 'https://edit.climate.red/',
  IS_STATIC = false,
  GA_TOKEN = null,
  BUILD_NAME = null
} = window.CONFIG ?? {}

export function findLink(links, type, language) {
  const matches = links.filter(l => l.type === type)

  return (
    matches.find(l => l.language === language) ??
    matches.find(l => l.language === '*') ??
    matches[0]
  )
}

function isYoutubeDomain(url) {
  return (
    url.hostname.endsWith('youtube.com') ||
    url.hostname.endsWith('youtube-nocookie.com')
  )
}

// https://youtu.be/U3LFI2mI8Y0
// https://www.youtube.com/watch?v=U3LFI2mI8Y0
export function parseYouTubeLink(link) {
  let url = new URL(link.url)

  if (url.hostname === 'youtu.be') {
    return {
      url: link.url,
      id: url.pathname.slice(1)
    }
  }

  if (isYoutubeDomain(url) && url.searchParams.has('v')) {
    return {
      url: link.url,
      id: url.searchParams.get('v')
    }
  }

  return null
}

// https://www.youtube.com/embed/live_stream?channel=UC7v2Rs4f_UlIQNuNKUjmtgA
export function parseYouTubeChannel(link) {
  let url = new URL(link.url)

  if (
    isYoutubeDomain(url) &&
    url.pathname === '/embed/live_stream' &&
    url.searchParams.has('channel')
  ) {
    return {
      url: link.url,
      channel: url.searchParams.get('channel')
    }
  }

  return null
}

// https://app.sli.do/event/z4amyxli
export function parseSlidoLink(link) {
  let url = new URL(link.url)

  if (url.hostname === 'app.sli.do' && url.pathname.startsWith('/event/')) {
    return {
      url: link.url,
      id: url.pathname.replace('/event/', '')
    }
  }

  return null
}

// https://zoom.us/my/abcdef
export function parseZoomLink(link) {
  let url = new URL(link.url)

  if (url.hostname.endsWith('zoom.us') && url.pathname.startsWith('/my/')) {
    return {
      url: link.url,
      id: url.pathname.replace('/my/', '')
    }
  }

  return null
}

// https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzliMDhmNDUtZjAwNS00NjQ5LWJkYzMtNTE2NTNhOTY0ZTAw%40thread.v2/0?context=%7b%22Tid%22%3a%229c5012c9-b616-44c2-a917-66814fbe3e87%22%2c%22Oid%22%3a%22ce849a55-9a39-48ec-a3a5-c2371bbc5c68%22%7d
export function parseTeamsLink(link) {
  let url = new URL(link.url)

  if (url.hostname.endsWith('teams.microsoft.com')) {
    return {
      url: link.url
    }
  }

  return null
}

export function slotState(slot) {
  // dev hacks
  if (window.location.search.includes('force=active')) return 'active'
  if (window.location.search.includes('force=before')) return 'before'
  if (window.location.search.includes('force=after')) return 'after'

  const start = new Date(slot.start).getTime()
  const end = new Date(slot.end).getTime()
  const now = Date.now()

  if (now < start) return 'before'
  if (now > end) return 'after'
  return 'active'
}

const noTrailingSlash = str => str.replace(/\/*$/, '')

/** Get the url of the API to use, always has a trailing slash */
export function pickApi() {
  return noTrailingSlash(API_URL)
}

/** Get the url of the CDN to use, always has a trailing slash */
export function pickCdn() {
  return noTrailingSlash(CDN_URL)
}

export function isStaticSite() {
  return Boolean(IS_STATIC)
}

export function getApiUrl(path) {
  const url = new URL(path, pickApi())
  return url.toString() + (isStaticSite() ? '.json' : '')
}

export function getTranslation(translation, tryList) {
  for (let locale of tryList) {
    if (translation[locale]) return translation[locale]
  }
  return undefined
}

export function getTimeZone(abbr = false) {
  let tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (typeof tz === 'undefined') {
    tz = moment.tz.guess(true)
  }
  if (abbr) {
    return moment()
      .tz(tz)
      .zoneAbbr()
  }
  return tz
}

export function getGaToken() {
  return GA_TOKEN
}

export function getBuildName() {
  return BUILD_NAME ?? 'v' + process.env.VUE_APP_VERSION
}

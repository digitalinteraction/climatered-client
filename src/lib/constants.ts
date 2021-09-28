export enum StorageKey {
  AuthToken = 'authToken',
  WhatsOnFilters = 'whatsOnFilters',
  ScheduleFilters = 'scheduleFilters',
}

export const AUDIO_TRANSPORT_RATE = 16000
export const AUDIO_PLAYBACK_RATE = 22050
export const AUDIO_LOW_LEVEL = 8 // when to start playing after buffering
export const AUDIO_HIGH_LEVEL = 16 // when to discard old packets

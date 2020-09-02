<template>
  <AppWrapper>
    <div class="session" v-if="session">
      <!-- Navigation -->
      <div class="buttons">
        <router-link class="session-back" :to="scheduleRoute">
          <button class="button is-modern is-small is-coral">
            {{ $t('general.backTo', [$t('schedule.title')]) }}
          </button>
        </router-link>
      </div>
      <div class="session-wrapper">
        <div class="columns">
          <div class="column is-two-thirds">
            <div class="session-main">
              <!-- Locale warning -->
              <div
                v-if="
                  displayLanguageNotification && !languageNotificationDismissed
                "
                class="notification is-danger"
              >
                <span class="icon">
                  <fa :icon="['fas', 'globe']" class="fa-xs fa-fw" />
                </span>
                <span>{{ $t('session.sessionOnlyAvailableIn') }}</span>
                <span class="is-uppercase">
                  {{ session.hostLanguage.join('/') }}
                </span>
                <button
                  @click="languageNotificationDismissed = true"
                  class="delete"
                ></button>
              </div>

              <!-- Session view -->
              <!-- <component
                v-if="sessionComponent"
                :is="sessionComponent"
                :event="session"
                :session-slot="slot"
              /> -->

              <div class="session-headings">
                <SessionType :schedule-slot="slot" :session="session" />
                <h1 class="title">{{ localeTitle }}</h1>
              </div>

              <!-- Session abstract -->
              <div
                class="session-abstract"
                :class="{ 'hide-overflow': !readMore }"
              >
                <div class="content" v-html="localeContent"></div>
              </div>

              <!-- Session interaction -->
              <!-- <div class="buttons is-centered">
                <p class="button is-text" @click="readMore = !readMore">
                  <span
                    v-t="readMore ? 'session.seeLess' : 'session.seeMore'"
                  />
                </p>
              </div> -->

              <!-- Attributes -->
              <div id="session-attributes-wrapper">
                <SessionAttributes
                  :session="session"
                  @show-modal="$emit('show-modal')"
                />
              </div>
            </div>
          </div>
          <div class="column is-one-third">
            <div class="session-sidebar">
              <!-- Time and state for slot -->
              <section>
                <h4 class="section-title">
                  {{ $t('session.scheduleHeading') }}
                </h4>
                <ScheduleSlotTime
                  :current-time="currentTime"
                  :schedule-slot="slot"
                  :is-padded="false"
                  class="is-large"
                />
              </section>
              <!-- Cover image -->
              <section v-if="hasCoverImage">
                <img id="cover-image" :src="coverImageUrl" alt="Cover image" />
              </section>
              <!-- Speakers -->
              <section v-if="session.speakers && session.speakers.length > 0">
                <h4 class="section-title">
                  {{ $t('session.speakerHeading') }}
                </h4>
                <SessionSpeakers :session="session" :is-padded="false" />
              </section>
              <!-- Actions -->
              <section>
                <h4 class="section-title">
                  {{ $t('session.actionsHeading') }}
                </h4>
                <SessionActions
                  :schedule-slot="slot"
                  :session="session"
                  :session-state="sessionState"
                  :is-fullwidth="true"
                />
              </section>
              <!-- Spacer -->
              <div class="flex-spacer"></div>
              <!-- Host -->
              <section class="host-section">
                <h4 class="section-title">
                  {{ $t('session.hostedByHeading') }}
                </h4>
                <h5>
                  <strong>{{ session.hostName }}</strong>
                </h5>
                <p>
                  {{ localeHostOrganisation }}
                </p>
                <a :href="`mailto:${session.hostEmail}`">
                  <button
                    class="button is-modern is-small is-purple is-fullwidth mt-3"
                  >
                    {{ $t('session.contactHost') }}
                  </button>
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import marked from 'marked'
import { mapState } from 'vuex'
import { pickCdn } from '@/utils'

import { ROUTE_SCHEDULE } from '@/const'

// Components
import ScheduleSlotTime from '@/components/schedule/ScheduleSlotTime.vue'

import SessionType from '@/components/session/SessionType.vue'
import SessionAttributes from '@/components/session/SessionAttributes.vue'
import SessionSpeakers from '@/components/session/SessionSpeakers.vue'
import SessionActions from '@/components/session/SessionActions.vue'

import Countdown from '@/components/Countdown.vue'
import OneToMany from '@/components/OneToMany.vue'
import ManyToMany from '@/components/ManyToMany.vue'
import AppWrapper from '@/components/AppWrapper.vue'

const sessionComponents = {
  plenary: OneToMany,
  panel: OneToMany
}

export default {
  components: {
    ScheduleSlotTime,
    SessionType,
    SessionAttributes,
    SessionSpeakers,
    SessionActions,
    AppWrapper
  },
  props: {
    sessionSlug: { type: String, required: true }
  },
  data() {
    return {
      languageNotificationDismissed: false,
      currentTime: Date.now(),
      slotState: 'active',
      readMore: true,
      scheduleRoute: { name: ROUTE_SCHEDULE }
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'slots', 'speakers']),
    session() {
      return this.$store.getters['api/session'](this.sessionSlug)
    },
    slot() {
      return this.session && this.$store.getters['api/slot'](this.session.slot)
    },
    sessionType() {
      return this.session && this.$store.getters['api/type'](this.session.type)
    },
    localeTitle() {
      return this.session.title[this.$i18n.locale]
    },
    localeHostOrganisation() {
      return this.session.hostOrganisation[this.$i18n.locale]
    },
    localeContent() {
      if (this.$i18n.locale === 'dev') return '{{session.content}}'

      const content = this.session?.content?.[this.$i18n.locale]
      return content && marked(content)
    },
    sessionSpeakers() {
      return this.session?.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    },
    sessionComponent() {
      if (!this.session || !this.slotState) return null
      if (this.slotState === 'before') return Countdown
      return sessionComponents[this.session.type] ?? ManyToMany
    },
    sessionState() {
      const start = new Date(this.slot.start).getTime()
      const end = new Date(this.slot.end).getTime()

      if (this.currentTime < start) return 'future'
      if (this.currentTime > end) return 'past'

      return 'present'
    },
    hasCoverImage() {
      return this.coverImage && this.coverImage !== '/uploads/cover-default.jpg'
    },
    coverImageUrl() {
      return pickCdn() + this.session.coverImage
    },
    displayLanguageNotification() {
      return (
        this.session.hostLanguage.length < 4 &&
        !this.session.hostLanguage.includes(this.$i18n.locale)
      )
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      if (this.isDev && this.$route.query.time) {
        this.currentTime = parseInt(this.$route.query.time)
      } else {
        this.currentTime = Date.now()
      }
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  }
}
</script>

<style lang="scss" scoped>
.session {
  background-color: $cc-lightestgrey;
  min-height: 100vh;
  padding: 2em;
  .columns {
    margin-left: 0;
    margin-right: 0;
    .column {
      padding: 0;
    }
  }

  @include mobile {
    padding-top: 1.5em;
  }
  .session-wrapper {
    border-radius: $radius-large;
    background-color: white;
    max-width: 1600px;
    .session-main {
      padding: 1.5em;
    }
    .session-sidebar {
      display: flex;
      flex-direction: column;
      padding: 1.5em;

      .flex-spacer {
        flex-grow: 1;
      }
      section {
        align-self: flex-start;
        flex-shrink: 1;
        // border-bottom: 1px solid $border;
        margin-bottom: 3em;
        width: 100%;
        max-width: 400px;
        .section-title {
          color: $cc-bluegrey;
          font-size: 0.9em;
          font-weight: bold;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        &.host-section {
          p {
            color: $cc-bluegrey;
            font-size: 0.9em;
          }
        }
      }
    }
  }
}

.session-back {
  padding-inline-start: 0;
}
.session-abstract {
  color: $cc-bluegrey;
  font-size: 1em;
  margin-top: 0.75em;
}
.session-abstract.hide-overflow {
  max-height: 120px;
  overflow-y: hidden;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow: 0 -2em 1em -1em white inset;
  }
}

#session-attributes-wrapper {
  margin-top: 30px;
}

.notification {
  padding: 0.75rem 2.5rem 0.75rem 2.5rem !important;
  .icon {
    left: 0.5rem;
    position: absolute;
    top: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
  > .delete {
    top: 50%;
    transform: translateY(-50%);
  }
}

section#cover-image {
  img {
    max-height: 200px;
    max-width: 100%;
  }
}
</style>

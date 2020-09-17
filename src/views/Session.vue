<template>
  <AppWrapper>
    <div class="session" v-if="session && !redirecting">
      <!-- Modal for displaying detailed information about a speaker -->
      <SpeakerModal />

      <!-- Session navigation -->
      <div class="session-navigation is-clearfix">
        <div class="level is-mobile">
          <div class="level-item is-narrow">
            <!-- Back button -->
            <router-link
              class="button is-small is-white"
              id="back-button"
              :to="scheduleRoute"
            >
              <span class="icon">
                <fa :icon="['fas', 'arrow-left']" />
                <fa :icon="['fas', 'arrow-right']" />
              </span>
              <span>{{ $t('general.backTo', [$t('schedule.title')]) }}</span>
            </router-link>

            <!-- Cycle state -->
            <a
              v-if="isDev"
              @click="cycleStates()"
              class="button is-small is-white is-uppercase mx-3"
            >
              <span>{{ forcedState || 'auto' }}</span>
            </a>
          </div>

          <!-- Session state -->
          <span class="level-item is-narrow">
            <SessionStateTag
              :session-state="sessionState"
              :attendance="parseInt(session.attendance)"
            />
          </span>
        </div>
      </div>

      <!-- Session wrapper -->
      <div class="session-wrapper">
        <div class="columns">
          <!-- Main column -->
          <div class="column column-main">
            <!-- Cover image -->
            <section v-if="hasCoverImage" class="is-hidden-desktop">
              <img id="cover-image" :src="coverImageUrl" alt="Cover image" />
            </section>
            <div class="session-headings">
              <!-- Type -->
              <SessionType
                :schedule-slot="slot"
                :session="session"
                :session-state="sessionState"
              />
              <!-- Title -->
              <h1 class="title">{{ localeTitle }}</h1>
            </div>
            <div class="session-main">
              <!-- Locale warning -->
              <SessionLocaleWarning :session="session" />

              <!-- No auth component -->
              <PrivateSessionMessage v-if="loginRequired" :session="session" />

              <!-- Session component -->
              <div class="session-component" v-else-if="isPast || isPresent">
                <!-- Auditorium -->
                <div v-if="isAuditorium" class="auditorium">
                  <OneToMany :session="session" :session-slot="slot" />
                </div>

                <!-- Room -->
                <div v-if="isRoom" class="room">
                  <ManyToMany :session="session" :session-slot="slot" />
                </div>
              </div>

              <!-- Attributes -->
              <div id="session-attributes-wrapper">
                <SessionAttributes
                  :session="session"
                  @show-modal="$emit('show-modal')"
                />
              </div>

              <!-- Session abstract -->
              <div class="session-abstract">
                <div
                  v-if="session.content[$i18n.locale] === '-'"
                  class="content"
                >
                  <span>
                    {{ $t('session.sessionWillBeHostedIn') }}
                    <span class="is-uppercase">
                      {{ session.hostLanguage.join('/') }}
                    </span>
                  </span>
                </div>
                <div v-else class="content" v-html="localeContent"></div>
              </div>
            </div>
          </div>

          <!-- Side column -->
          <div class="column column-side">
            <div class="session-sidebar">
              <!-- Countdown -->
              <section v-if="sessionState === 'soon'">
                <h4 class="section-heading">
                  {{ $t('session.countdownHeading') }}
                </h4>
                <SessionCountdown :session="session" :schedule-slot="slot" />
              </section>

              <!-- Cover image -->
              <section v-if="hasCoverImage" class="is-hidden-touch">
                <img id="cover-image" :src="coverImageUrl" alt="Cover image" />
              </section>

              <!-- Interaction panel (Slido / Q&A) -->
              <section v-if="sessionState === 'present'" id="session-panel">
                <SessionInteractionPanel
                  :session="session"
                  :session-state="sessionState"
                />
              </section>

              <!-- Session Links -->
              <section v-if="!isPast && hasLinks">
                <h4 class="section-heading">
                  {{ $t('session.linksHeading') }}
                </h4>
                <SessionLinks v-if="showSessionLinks" :links="nonVideoLinks" />
                <div
                  v-else
                  class="has-text-danger has-text-weight-semibold is-size-6"
                >
                  {{ $t('session.linksWillBeAvailable') }}
                </div>
              </section>

              <!-- Time and state for slot -->
              <section>
                <h4 class="section-heading">
                  {{ $t('session.scheduleHeading') }}
                </h4>
                <ScheduleSlotTime
                  :current-time="currentTime"
                  :schedule-slot="slot"
                  :is-padded="false"
                  :force-active-session-state="sessionState === 'present'"
                  class="is-large"
                />
              </section>

              <!-- Speakers -->
              <section v-if="session.speakers && session.speakers.length > 0">
                <h4 class="section-heading">
                  {{ $t('session.speakerHeading') }}
                </h4>
                <SessionSpeakers
                  :session="session"
                  :is-padded="false"
                  :is-interactive="true"
                />
              </section>

              <!-- Actions -->
              <section v-if="showActions">
                <h4 class="section-heading">
                  {{ $t('session.actionsHeading') }}
                </h4>
                <SessionActions
                  :schedule-slot="slot"
                  :session="session"
                  :session-state="sessionState"
                  :session-layout="sessionLayout"
                  :is-fullwidth="true"
                  :enabled-actions="['calendar', 'register']"
                />
              </section>

              <!-- Spacer -->
              <div class="flex-spacer"></div>

              <!-- Host -->
              <section class="host-section">
                <h4 class="section-heading">
                  {{ $t('session.hostedByHeading') }}
                </h4>
                <h5>
                  <strong>{{ session.hostName }}</strong>
                </h5>
                <p>
                  {{ localeHostOrganisation }}
                </p>
                <div class="button-wrapper">
                  <a
                    :href="`mailto:${session.hostEmail}`"
                    class="button is-small is-fullwidth is-dark mt-3"
                  >
                    <span class="icon">
                      <fa :icon="['fas', 'envelope']" class="fa-fw fa-xs" />
                    </span>
                    <span>{{ $t('session.contactHost') }}</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="!session && !redirecting" class="session-not-found">
        <div class="buttons">
          <BackButton
            :to="scheduleRoute"
            :text="$t('general.backTo', [$t('schedule.title')])"
          />
        </div>
        <div class="box is-small">
          <div slot="content" class="content">
            <h1 v-t="'notFound.title'" />
            <p v-t="'notFound.info'" />
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

import { ROUTE_SCHEDULE, ROUTE_SESSION } from '@/const'

// Components
import AppWrapper from '@/components/AppWrapper.vue'

import ScheduleSlotTime from '@/components/schedule/ScheduleSlotTime.vue'
import SpeakerModal from '@/components/session/SpeakerModal.vue'
import SessionType from '@/components/session/SessionType.vue'
import SessionStateTag from '@/components/session/SessionStateTag.vue'
import SessionAttributes from '@/components/session/SessionAttributes.vue'
import SessionLinks from '@/components/session/SessionLinks.vue'
import SessionSpeakers from '@/components/session/SessionSpeakers.vue'
import SessionActions from '@/components/session/SessionActions.vue'
import SessionInteractionPanel from '@/components/session/SessionInteractionPanel.vue'
import SessionLocaleWarning from '@/components/session/SessionLocaleWarning.vue'
import SessionCountdown from '@/components/session/SessionCountdown.vue'
import PrivateSessionMessage from '@/components/session/PrivateSessionMessage.vue'

import OneToMany from '@/components/OneToMany.vue'
import ManyToMany from '@/components/ManyToMany.vue'
import BackButton from '@/components/BackButton.vue'

export default {
  components: {
    AppWrapper,
    ScheduleSlotTime,
    SpeakerModal,
    SessionType,
    SessionStateTag,
    SessionAttributes,
    SessionLinks,
    SessionSpeakers,
    SessionActions,
    SessionInteractionPanel,
    SessionLocaleWarning,
    SessionCountdown,
    PrivateSessionMessage,
    OneToMany,
    ManyToMany,
    BackButton
  },
  props: {
    sessionSlug: { type: String, required: true }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const proxyUrl = vm.session && vm.session.proxyUrl
      if (proxyUrl) {
        if (proxyUrl.startsWith('http')) {
          vm.redirecting = true
          document.location = proxyUrl
        } else {
          next({
            name: ROUTE_SESSION,
            params: { sessionSlug: proxyUrl },
            replace: true
          })
        }
      } else {
        vm.redirecting = false
      }
    })
  },
  data() {
    return {
      redirecting: false,
      forcedStateIndex: -1,
      availableStates: ['future', 'soon', 'present', 'past'],
      forceActiveSessionState: false,
      currentTime: Date.now(),
      scheduleRoute: { name: ROUTE_SCHEDULE }
    }
  },
  computed: {
    ...mapState('api', ['hasData', 'slots', 'speakers', 'user']),
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
    forcedState() {
      if (/test/i.test(this.sessionSlug)) return 'present'
      if (!this.isDev) return undefined
      return this.availableStates[this.forcedStateIndex]
    },
    hasLinks() {
      return this.isRoom || !!this.nonVideoLinks.length > 0
    },
    nonVideoLinks() {
      return this.session.links.filter(link => {
        return link.type !== 'video' && link.type !== 'poll'
      })
    },
    session() {
      return this.$store.getters['api/session'](this.sessionSlug)
    },
    slot() {
      let slot =
        this.session && this.$store.getters['api/slot'](this.session.slot)
      slot.start = this.$route.query.start || slot.start // ?start=2020-09-05T18:00:00.000Z
      slot.end = this.$route.query.end || slot.end // 2020-09-05T19:00:00.000Z
      return slot
    },
    sessionLayout() {
      return this.sessionType.layout
    },
    isAuditorium() {
      return this.sessionLayout === 'auditorium'
    },
    isRoom() {
      return this.sessionLayout === 'room'
    },
    isConnect() {
      return this.sessionLayout === 'connect'
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
    sessionState() {
      if (this.forcedState) return this.forcedState

      let start = new Date(this.slot.start).getTime()
      let end = new Date(this.slot.end).getTime()

      const offset = 3600000 // One hour

      if (this.currentTime < start && this.currentTime > start - offset)
        return 'soon'

      if (this.currentTime < start) return 'future'
      if (this.currentTime > end) return 'past'

      return 'present'
    },
    isFuture() {
      return this.sessionState === 'future'
    },
    isSoon() {
      return this.sessionState === 'soon'
    },
    isPresent() {
      return this.sessionState === 'present'
    },
    isPast() {
      return this.sessionState === 'past'
    },
    hasCoverImage() {
      return (
        this.session.coverImage &&
        this.session.coverImage !== '/uploads/cover-default.jpg'
      )
    },
    coverImageUrl() {
      return pickCdn() + this.session.coverImage
    },
    showActions() {
      return this.isFuture
    },
    showSessionLinks() {
      if (this.isPresent) return true

      const offset = 900000 // 15 minutes
      const start = new Date(this.slot.start).getTime()

      return this.isSoon && this.currentTime > start - offset
    },
    loginRequired() {
      return !this.user && this.session.isPublic !== true
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      this.currentTime = this.$route.query.time
        ? parseInt(this.$route.query.time)
        : Date.now()
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    cycleStates() {
      if (this.forcedStateIndex < this.availableStates.length - 1) {
        this.forcedStateIndex++
      } else {
        this.forcedStateIndex = -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$page-max-width: 1500px;

.session {
  background-color: $cc-lightestgrey;
  min-height: 100vh;
  padding: 2em;

  @include mobile {
    padding: 0em;

    .session-wrapper {
      border-radius: 0 !important;
    }
  }

  .session-navigation {
    margin: 0 auto;
    max-width: $page-max-width;
    margin-bottom: 1em;
    @include mobile {
      margin-bottom: 0em;
      padding: 1em;
    }
  }
  .columns {
    margin: 0;
    flex-wrap: wrap;
    .column {
      position: relative;
      padding: 0;
      &.column-main {
        flex-grow: 1;
        flex-basis: 440px;
      }
      &.column-side {
        border-inline-start: 1px solid $border;
        flex-basis: 360px;
        flex-grow: 0;
        flex-shrink: 1;
        position: relative;
        @include touch {
          flex-shrink: 0;
          flex-basis: 100%;
        }
      }
    }
  }

  .session-wrapper {
    background-color: white;
    border-radius: $radius-large;
    box-shadow: $box-shadow;
    max-width: $page-max-width;
    margin: 0 auto;
    .session-headings {
      padding: 1.5em;
      padding-bottom: 0;
      position: relative;
      h1.title {
        color: #222;
        max-width: 800px;
        font-size: $size-4;
        font-weight: 900;
        position: relative;
      }
    }

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
        width: 100%;

        &:not(#session-panel) {
          margin-bottom: 3em;
        }

        &.host-section {
          align-self: flex-end;
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

.notification {
  margin: 0 !important;

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

.column-main {
  #cover-image {
    max-height: 120px;
    max-width: 240px;
    padding: 1.5em 1.5em 0 1.5em;
  }
}

.session-component {
  .auditorium {
  }
  .room {
  }
  .connect {
  }
}

// RTL support
*[dir='ltr'] {
  #back-button {
    .icon .fa-arrow-left {
      display: inline-block;
    }
    .icon .fa-arrow-right {
      display: none;
    }
  }
}
*[dir='rtl'] {
  #back-button {
    .icon .fa-arrow-left {
      display: none;
    }
    .icon .fa-arrow-right {
      display: inline-block;
    }
  }
}

.session-not-found {
  background-color: $cc-lightestgrey;
  min-height: 100vh;
  padding: 2em;

  > .box {
    margin-top: 5em;
  }
}
</style>

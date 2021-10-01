<template>
  <IfrcAppLayout class="atriumView">
    <AtriumLayout v-if="settings">
      <BoxContent slot="left">
        <div class="atriumView-content">
          <!-- <div class="atriumView-brand">
            <img src="/img/full-brand.svg" width="253" height="64" />
          </div> -->
          <ApiContent :slug="contentSlug" />
        </div>
      </BoxContent>
      <Stack slot="right" direction="vertical" gap="medium" align="stretch">
        <template v-if="!user">
          <div @click="widgetAction($event, 'register')">
            <ColorWidget
              kind="custom"
              class="is-register"
              :title="$t('ifrc.register.title')"
              subtitle=""
              :icon="['fas', 'edit']"
              :href="registerHref"
            />
          </div>
          <div @click="widgetAction($event, 'login')">
            <ColorWidget
              kind="custom"
              class="is-login"
              :title="$t('deconf.login.title')"
              subtitle=""
              :icon="['fas', 'envelope']"
              :href="loginHref"
            />
          </div>
        </template>
        <ColorWidget
          kind="primary"
          v-if="showSiteVisitors"
          :title="`${siteVisitors === null ? '...' : siteVisitors}`"
          :subtitle="$t('ifrc.atrium.onlineNow')"
          :icon="['fas', 'user']"
        />
        <ColorWidget
          kind="secondary"
          :title="carbonNotEmitted"
          :subtitle="$t('ifrc.atrium.carbonSaved')"
          :icon="['fas', 'leaf']"
        />
        <div @click="widgetAction($event, 'twitter')">
          <ColorWidget
            kind="twitter"
            :title="$t('ifrc.atrium.twitterTitle')"
            :subtitle="$t('ifrc.atrium.twitterSubtitle')"
            :href="$t('ifrc.atrium.twitterUrl')"
            :icon="['fab', 'twitter']"
          />
        </div>
        <FeaturedSessions
          v-if="featuredSessions.length > 0"
          :featured="featuredSessions"
          :current-date="scheduleDate"
        />
      </Stack>
      <div slot="bottom">
        <div class="sponsorGrid">
          <SponsorGrid :groups="topSponsors" />
          <SponsorGrid :groups="sponsors" />
        </div>
      </div>
    </AtriumLayout>
  </IfrcAppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import IfrcAppLayout from '@/components/IfrcAppLayout.vue'
import {
  AtriumLayout,
  BoxContent,
  ColorWidget,
  createAtriumWidgetEvent,
  FeaturedSessions,
  mapApiState,
  mapMetricsState,
  Routes,
  Stack,
  SponsorGrid,
} from '@openlab/deconf-ui-toolkit'
import ApiContent from '@/components/ApiContent.vue'
import { ConferenceConfig, Session, SessionSlot } from '@openlab/deconf-shared'

import sponsorData from '@/data/sponsors.json'

// TODO: import type when available
interface SessionAndSlot {
  session: Session
  slot: SessionSlot
}

const topSponsors = [
  {
    title: 'IFRC',
    image: '/sponsor/ifrc.svg',
  },
  {
    title: 'ICRC',
    image: '/sponsor/icrc.svg',
  },
]

export default Vue.extend({
  components: {
    IfrcAppLayout,
    AtriumLayout,
    ColorWidget,
    BoxContent,
    ApiContent,
    FeaturedSessions,
    Stack,
    SponsorGrid,
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'carbon']),
    ...mapMetricsState('metrics', ['siteVisitors']),
    settings(): ConferenceConfig | null {
      return this.schedule?.settings ?? null
    },
    showSiteVisitors(): boolean {
      if (!this.settings) return false
      return !this.settings.isStatic
    },
    contentSlug(): string {
      return this.user ? 'atrium-active' : 'atrium-public'
    },
    carbonNotEmitted(): string {
      if (!this.carbon) return '...'
      return Math.floor(this.carbon.carbonNotEmitted / 1000)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    scheduleDate(): Date {
      return this.$dev.scheduleDate ?? this.$temporal.date
    },
    featuredSessions(): SessionAndSlot[] {
      if (!this.schedule) return []

      const now = this.scheduleDate.getTime()
      const inAWeek = now + 7 * 24 * 60 * 60 * 1000
      const slotMap = new Map(this.schedule.slots.map((s) => [s.id, s]))

      return this.schedule.sessions
        .filter((session) => Boolean(session.slot) && session.isFeatured)
        .map((session) => ({
          slot: slotMap.get(session.slot as string) as SessionSlot,
          session: session,
        }))
        .filter(
          (group) =>
            Boolean(group.slot) &&
            group.slot.end.getTime() > now &&
            group.slot.start.getTime() < inAWeek
        )
        .sort((a, b) => a.slot?.start.getTime() - b.slot?.start.getTime())
        .slice(0, 3)
    },
    loginHref(): string {
      return this.$router.resolve({ name: Routes.Login }).href
    },
    registerHref(): string {
      return this.$router.resolve({ name: Routes.Register }).href
    },
    topSponsors(): unknown[] {
      return [
        {
          size: 'large',
          title: this.$t('ifrc.atrium.sponsorHeading'),
          sponsors: topSponsors,
        },
      ]
    },
    sponsors(): unknown[] {
      return [
        {
          size: 'small',
          title: '',
          sponsors: sponsorData,
        },
      ]
    },
  },
  mounted() {
    this.$store.dispatch('api/fetchCarbon')
  },
  methods: {
    widgetAction(event: Event, kind: string) {
      event.preventDefault()

      this.$metrics.track(createAtriumWidgetEvent(kind))

      if (kind === 'twitter') {
        const url = this.$t('ifrc.atrium.twitterUrl') as string
        window.open(url, '_blank', 'noopener')
      }
      if (kind === 'login') {
        this.$router.push({ name: Routes.Login })
      }
      if (kind === 'register') {
        this.$router.push({ name: Routes.Register })
      }
    },
  },
})
</script>

<style lang="scss">
.atriumView {
  .atriumLayout {
    overflow-x: hidden;
  }
  @include mobile {
    .atriumLayout {
      padding-top: 3em;
    }
  }
  @include tablet {
    .atriumLayout {
      background-image: url(/img/background.png);
      background-size: contain;
      background-repeat: no-repeat;
      padding-top: 7em;
      flex: 1;
    }
  }
}
.atriumView-content {
  min-height: 500px;
}
.atriumView-brand {
  margin-bottom: 1.5rem;

  @include tablet {
    display: flex;
    justify-content: center;
  }

  // img {
  //   width: 100%;
  //   height: auto;
  // }
}
</style>

<template>
  <AppWrapper>
    <div class="sessions">
      <div class="tabs is-dark">
        <ul>
          <li v-for="item in tabs" :key="item.type" :class="tabClasses(item)">
            <a
              :href="item.href"
              v-t="item.titleKey"
              @click="updateActive(item)"
            />
          </li>
        </ul>
      </div>

      <div class="container">
        <section class="section is-small" v-if="currentContent">
          <div class="content" v-html="currentContent" />
        </section>
        <section
          v-for="item in tabs"
          :key="item.type"
          class="section is-small"
          :id="item.href.slice(1)"
        >
          <h2 class="title" v-t="item.titleKey" />
          <div class="columns is-multiline">
            <div
              v-for="session in tabSessions(item)"
              :key="session.id"
              class="column is-one-third-desktop is-one-half-tablet is-one"
            >
              <SessionCard :session="session" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import SessionCard from '@/components/SessionCard.vue'
import { mapState } from 'vuex'

import contentEN from '@/content/sessions/en.md'
import contentFR from '@/content/sessions/fr.md'
import contentES from '@/content/sessions/es.md'
import contentAR from '@/content/sessions/ar.md'

const content = {
  en: contentEN,
  fr: contentFR,
  es: contentES,
  ar: contentAR,
  dev: 'sessions.content'
}

const tabs = [
  {
    type: 'plenary',
    href: '#speakers',
    titleKey: 'sessions.tabs.plenary.title'
  },
  {
    type: 'panel',
    href: '#panels',
    titleKey: 'sessions.tabs.panel.title'
  },
  {
    type: 'sessions',
    href: '#sessions',
    titleKey: 'sessions.tabs.sessions.title'
  }
]

export default {
  components: { AppWrapper, SessionCard },
  data() {
    return {
      tabs,
      currentTab: window.location.hash || '#speakers'
    }
  },
  computed: {
    ...mapState('api', ['sessions']),
    currentContent() {
      return content[this.$i18n.locale]
    }
  },
  methods: {
    tabClasses(tab) {
      return {
        'is-active': tab.href === this.currentTab
      }
    },
    updateActive(tab) {
      this.currentTab = tab.href
    },
    tabSessions(tab) {
      // Pluck out plenary sessions
      if (tab.type === 'plenary') {
        return this.sessions.filter(s => s.type === 'plenary')
      }

      // Pluck out panel sessions
      if (tab.type === 'panel') {
        return this.sessions.filter(s => s.type === 'panel')
      }

      // Otherwise, return all sessions that aren't plenary or panels
      return this.sessions.filter(
        s => s.type !== 'plenary' && s.type !== 'panel'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.sessions {
  .tabs {
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
}
</style>

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
            class="column is-one-third"
          >
            <SessionCard :session="session" />
          </div>
        </div>
      </section>
    </div>
  </AppWrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
import SessionCard from '@/components/SessionCard.vue'
import { mapState } from 'vuex'

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
    ...mapState('api', ['sessions'])
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
  }
}
</style>

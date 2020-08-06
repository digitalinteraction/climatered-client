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
      <section class="section" id="speakers">
        <div class="content">
          <h2 class="title">Speakers</h2>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
        </div>
      </section>
      <section class="section" id="panels">
        <div class="content">
          <h2 class="title">Panels</h2>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
        </div>
      </section>
      <section class="section" id="sessions">
        <div class="content">
          <h2 class="title">Sessions</h2>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a
            pharetra augue. Vestibulum id ligula porta felis euismod semper.
          </p>
        </div>
      </section>
    </div>
  </AppWrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'

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
  components: { AppWrapper },
  data() {
    return {
      tabs,
      currentTab: window.location.hash
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

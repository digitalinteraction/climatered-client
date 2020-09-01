<template>
  <h3 class="session-tile-type">
    <p
      :class="['icon-and-text', 'is-official']"
      v-if="session.isOfficial"
      :title="localeType"
    >
      <span class="icon icon-small pull-right" v-if="session.isOfficial">
        <OfficialIcon />
      </span>
      <span class="text">
        Red Cross Red Crescent Members Only
      </span>
    </p>
    <p :class="['icon-and-text']" v-else>
      <span class="icon" v-if="typeIcon" :title="localeType">
        <component :is="typeIcon" class="session-icon" />
      </span>
      <span class="text"> {{ localeType }}</span>
    </p>
  </h3>
</template>

<script>
// Icons
import OfficialIcon from '@/icons/ifrc.svg'
import GamesIcon from '@/icons/types/games.svg'
import KeynoteIcon from '@/icons/types/keynote.svg'
import PanelIcon from '@/icons/types/panel.svg'
import VirtualIcon from '@/icons/types/virtual.svg'

const typeIcons = {
  'games.svg': GamesIcon,
  'keynote.svg': KeynoteIcon,
  'panel.svg': PanelIcon,
  'virtual.svg': VirtualIcon
}

export default {
  name: 'SessionTileType',
  components: {
    OfficialIcon
  },
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  computed: {
    sessionType() {
      return this.$store.getters['api/type'](this.session.type)
    },
    typeIcon() {
      return this.sessionType && typeIcons[this.sessionType.icon]
    },
    localeType() {
      return this.sessionType?.title[this.$i18n.locale]
    }
  }
}
</script>

<style lang="scss" scoped>
h3.session-tile-type {
  color: $grey;
  font-size: 0.9em;
  font-weight: $weight-semibold;
  letter-spacing: 0.05em;
  line-height: 1.25rem;
  margin: 0 -5px;
  position: relative;
  text-transform: uppercase;

  // Flex
  display: flex;
  align-content: center;
  justify-content: start;

  .icon-and-text {
    display: flex;
    align-items: center;
    &.is-official {
      color: red;
      .icon,
      .icon svg {
        margin-inline-end: 0;
        transform: scale(0.8);
      }
    }
    .icon {
      margin-inline-end: 8px;
      width: auto;
      svg {
        width: auto;
      }
    }
  }
}
</style>

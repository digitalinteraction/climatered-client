<template>
  <div
    v-if="sessionSpeakers.length > 0"
    :class="['session-speakers', { 'is-padded': isPadded }]"
  >
    <div
      class="speaker-wrapper"
      v-for="(speaker, i) in sessionSpeakers"
      :key="i"
    >
      <SpeakerRow
        :speaker="speaker"
        :is-interactive="isInteractive"
        @click="showSpeakerModal(speaker)"
      />
    </div>
    <!-- Placeholders for consistent widths of flex items -->
    <div class="speaker-wrapper placeholder"></div>
    <div class="speaker-wrapper placeholder"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

// Components
import SpeakerRow from '@/components/SpeakerRow.vue'

export default {
  name: 'SessionAttributes',
  components: {
    SpeakerRow
  },
  props: {
    session: {
      type: Object,
      required: true
    },
    isPadded: {
      type: Boolean,
      default: false
    },
    isInteractive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('api', ['speakers']),
    sessionSpeakers() {
      return this.session.speakers
        .map(slug => this.speakers.find(s => s.slug === slug))
        .filter(s => s)
    }
  },
  methods: {
    showSpeakerModal(speaker) {
      this.$store.dispatch('modals/showModal', {
        type: 'speaker',
        data: speaker
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// Speakers
.session-speakers {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  vertical-align: top;

  &.is-padded {
    padding: 0.75rem 0;
  }

  .speaker-wrapper {
    flex-basis: 280px;
    flex-grow: 1;
    padding-bottom: 15px;
    vertical-align: top;

    &.placeholder {
      padding-bottom: 0;
    }

    @include mobile {
      width: 100%;
    }
  }
}
</style>

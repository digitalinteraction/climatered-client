<template>
  <div v-if="sessions.length > 0" class="workshops">
    <div class="workshops-header">
      <h2 class="workshops-title">
        <span class="text">
          Interactive workshops
        </span>
      </h2>
      <p class="workshops-description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        accusamus tempora exercitationem sequi repellendus magni autem maxime
        ullam ex amet expedita obcaecati enim nesciunt, magnam quae quo
        corporis, animi soluta?
      </p>
    </div>
    <div :class="['workshops-wrapper', slotState, { expanded: isExpanded }]">
      <div class="workshops-info-wrapper">
        <h3>
          {{ sessions.length }}
          workshops
        </h3>
        <button
          v-if="!searchActive"
          @click="workshopsExpanded = !workshopsExpanded"
          :class="[
            'button',
            'is-modern',
            'is-small',
            {
              'is-coral': !workshopsExpanded,
              'is-danger': workshopsExpanded
            }
          ]"
        >
          {{ workshopsExpanded ? `Hide all` : `Show all` }}
        </button>
      </div>
      <transition name="fade">
        <div v-if="isExpanded">
          <SessionTile
            v-for="session in sessions"
            :key="session.id"
            :schedule-slot="scheduleSlot"
            :session="session"
            :session-state="slotState"
            :is-workshop="true"
            @show-modal="handlesShowModal(session)"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// Components
import SessionTile from '@/components/Schedule/SessionTile.vue'

export default {
  name: 'ScheduleWorkshops',
  components: {
    SessionTile
  },
  props: {
    sessions: {
      type: Array,
      required: true
    },
    slotState: {
      type: String,
      required: true
    },
    searchActive: {
      type: Boolean,
      default: false
    },
    scheduleSlot: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      workshopsExpanded: false
    }
  },
  computed: {
    isExpanded() {
      return this.searchActive == true || this.workshopsExpanded
    }
  },
  methods: {
    handlesShowModal() {}
  }
}
</script>

<style lang="scss" scoped>
.workshops {
  .workshops-header {
    padding: 20px 20px 0 20px;

    .workshops-title {
      color: #222;
      max-width: 800px;
      font-size: $size-5;
      font-weight: 900;
      line-height: 20px;
      position: relative;
      padding: 10px 0px;

      .text {
        font-weight: $weight-bold;
      }
      .icon {
        position: absolute;
        top: 0;
        left: -50px;
        height: 40px;
        width: 40px;
        svg.workshops-icon {
          height: 40px;
          width: 40px;
        }
      }

      &:hover .text {
        text-decoration: underline;
      }
    }

    .workshops-description {
      color: $cc-bluegrey;
      font-size: 0.9em;
      max-width: 800px;
      position: relative;
    }
  }
  .workshops-wrapper {
    transition: margin 0.3s ease;
    background-color: $cc-lightestgrey;
    border-radius: 8px;
    margin: 20px;
    position: relative;
    &.expanded {
      .workshops-info-wrapper {
        border-bottom: 1px solid $border;
      }
    }

    .workshops-info-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      text-align: left;
      &:dir(rtl) {
        text-align: right;
      }
      h3 {
        color: $cc-coral;
        flex-grow: 1;
        font-size: 0.9em;
        font-weight: bold;
        padding: 0 10px;
        text-transform: capitalize;
      }
    }
  }
}
</style>

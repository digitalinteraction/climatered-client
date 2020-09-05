<template>
  <div id="schedule-filters">
    <!-- Search & Filters -->
    <div class="level is-mobile" id="controls">
      <div class="level-left">
        <div id="search-wrapper" class="level-item is-narrow">
          <div class="field has-addons">
            <!-- Search input -->
            <input
              v-model="query"
              @change="updateSearchQuery"
              class="input is-small"
              type="text"
              :placeholder="`${$t(`schedule.search`)}`"
            />
            <!-- Search button -->
            <div class="control">
              <a class="button is-small is-modern is-dark">
                <fa :icon="['fas', 'search']" />
              </a>
            </div>
          </div>
        </div>
        <!-- Toggle filters -->
        <div class="level-item is-narrow control">
          <a :class="filterToggleClasses" @click="toggleFilters()">
            <span v-if="filtersVisible">
              {{ $t(`schedule.filters.clearFilters`) }}
            </span>
            <span v-else>
              {{ $t(`schedule.filters.showFilters`) }}
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <transition name="fade">
      <div v-if="filtersVisible" id="filters">
        <div class="field is-horizontal is-grouped">
          <div class="field-body">
            <!-- Date -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.date`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.date">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="9 September 2020">
                      {{ $t(`schedule.dates.ninth`) }}
                    </option>
                    <option value="10 September 2020">
                      {{ $t(`schedule.dates.tenth`) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Types -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  Type
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.type">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="ignite-talk">{{
                      $t(`data.type.ignite-talk`)
                    }}</option>
                    <option value="games">{{ $t(`data.type.games`) }}</option>
                    <option value="panel">{{ $t(`data.type.panel`) }}</option>
                    <option value="workshop">{{
                      $t(`data.type.workshop`)
                    }}</option>
                    <option value="virtual-tour">{{
                      $t(`data.type.virtual-tour`)
                    }}</option>
                    <option value="plenary">{{
                      $t(`data.type.plenary`)
                    }}</option>
                    <option value="speaker">{{
                      $t(`data.type.speaker`)
                    }}</option>
                    <option value="fishbowl">{{
                      $t(`data.type.fishbowl`)
                    }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tracks -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.track`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.track">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="act">{{ $t(`data.track.act`) }}</option>
                    <option value="influence">{{
                      $t(`data.track.influence`)
                    }}</option>
                    <option value="empower">{{
                      $t(`data.track.empower`)
                    }}</option>
                    <option value="transform">{{
                      $t(`data.track.transform`)
                    }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Interactivity -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.interactivity.interactivity`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.interactivity">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="interactive">{{
                      $t(`schedule.filters.interactivity.interactive`)
                    }}</option>
                    <option value="view">{{
                      $t(`schedule.filters.interactivity.nonInteractive`)
                    }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Platform -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.platform.platform`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.platform">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <!-- TODO: Add platforms -->
                  </select>
                </div>
              </div>
            </div>

            <!-- Device -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.device.device`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.device">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="desktop">{{
                      $t(`schedule.filters.device.desktopOnly`)
                    }}</option>
                    <option value="mobile">{{
                      $t(`schedule.filters.device.mobileOnly`)
                    }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Recorded -->
            <div class="field has-addons">
              <p class="control">
                <a class="button is-small is-static">
                  {{ $t(`schedule.filters.recorded.recorded`) }}
                </a>
              </p>
              <div class="control">
                <div class="select is-small">
                  <select v-model="filters.recorded">
                    <option value="All" selected>{{
                      $t(`schedule.filters.all`)
                    }}</option>
                    <option value="recorded">{{
                      $t(`schedule.filters.recorded.willBeRecorded`)
                    }}</option>
                    <option value="not-recorded">{{
                      $t(`schedule.filters.recorded.notRecorded`)
                    }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex-spacer"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ScheduleFilters',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeFilters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filtersVisible: false,
      query: undefined,
      filters: {
        query: undefined,
        date: 'All',
        type: 'All',
        track: 'All',
        interactivity: 'All',
        platform: 'All',
        device: 'All',
        recorded: 'All'
      },
      defaults: {}
    }
  },
  mounted() {
    this.defaults = { ...this.filters }
  },
  watch: {
    query: {
      handler() {
        this.$emit('update:searchQuery', this.query)
      },
      deep: true
    },
    filters: {
      handler() {
        this.$emit('update:activeFilters', this.filters)
      },
      deep: true
    }
  },
  computed: {
    filterToggleClasses() {
      let classes = ['button', 'is-small', 'is-modern']
      classes.push(this.filtersVisible ? 'is-danger' : 'is-light')
      return classes
    }
  },
  methods: {
    updateSearchQuery() {
      this.$emit('update:searchQuery', this.query)
    },
    toggleFilters() {
      if (this.filtersVisible) {
        this.filters = { ...this.defaults }
      }
      this.filtersVisible = !this.filtersVisible
    }
  }
}
</script>

<style lang="scss" scoped>
#schedule-filters {
  background-color: white;
  #controls {
    margin-bottom: 0;
    padding: 1.5rem;
    &.level {
      .level-item {
        margin: 0;
        margin-inline-end: 1em;
      }
    }
    .field.has-addons {
      input {
        border-radius: 0;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      .control:last-child:not(:only-child) * {
        border-radius: 0;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
  #filters {
    padding: 1.5rem;
    padding-top: 0;
  }

  width: 100%;
}
*[dir='rtl'] {
  #schedule-filters #controls {
    .field.has-addons {
      input {
        border-radius: 0;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      .control:last-child:not(:only-child) * {
        border-radius: 0;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
    }
  }
}
.field-body {
  flex-wrap: wrap;
  .field {
    margin-bottom: 10px;
    flex-grow: 0;
  }

  .flex-spacer {
    flex-grow: 1;
  }
}
#search-wrapper {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  input[type='text'] {
    box-shadow: none;
    padding: 1.4em 1em;
  }
}
</style>

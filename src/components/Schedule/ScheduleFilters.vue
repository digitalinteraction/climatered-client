<template>
  <div id="schedule-filters">
    <!-- Search -->
    <div class="field has-addons">
      <!-- Search input -->
      <div class="control">
        <input
          v-model="query"
          @change="updateSearchQuery"
          class="input is-small"
          type="text"
          placeholder="Search"
        />
      </div>

      <!-- Search button -->
      <div class="control">
        <a class="button is-small is-dark">
          {{ $t(`schedule.search`) }}
        </a>
      </div>

      <!-- Toggle filters -->
      <div class="control">
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

    <!-- Filters -->
    <div v-if="filtersVisible">
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
                  <option value="All" selected>All</option>
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
                  <option selected>All</option>
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
                  <option value="plenary">{{ $t(`data.type.plenary`) }}</option>
                  <option value="speaker">{{ $t(`data.type.speaker`) }}</option>
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
                Track
              </a>
            </p>
            <div class="control">
              <div class="select is-small">
                <select v-model="filters.track">
                  <option selected>All</option>
                  <option value="act">Act</option>
                  <option value="influence">Influence</option>
                  <option value="empower">Empower</option>
                  <option value="transform">Transform</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Interactivity -->
          <div class="field has-addons">
            <p class="control">
              <a class="button is-small is-static">
                Interactivity
              </a>
            </p>
            <div class="control">
              <div class="select is-small">
                <select v-model="filters.interactivity">
                  <option value="All" selected>All</option>
                  <option value="interactive">Interactive</option>
                  <option value="view">Non-interactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Platform -->
          <div class="field has-addons">
            <p class="control">
              <a class="button is-small is-static">
                Platform
              </a>
            </p>
            <div class="control">
              <div class="select is-small">
                <select v-model="filters.platform">
                  <option selected>All</option>
                  <!-- TODO: Add platforms -->
                </select>
              </div>
            </div>
          </div>

          <!-- Device -->
          <div class="field has-addons">
            <p class="control">
              <a class="button is-small is-static">
                Device
              </a>
            </p>
            <div class="control">
              <div class="select is-small">
                <select v-model="filters.device">
                  <option selected>All</option>
                  <option value="desktop">Desktop only</option>
                  <option value="mobile">Mobile only</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Recorded -->
          <div class="field has-addons">
            <p class="control">
              <a class="button is-small is-static">
                Recorded
              </a>
            </p>
            <div class="control">
              <div class="select is-small">
                <select v-model="filters.recorded">
                  <option selected>All</option>
                  <option value="recorded">Will be recorded</option>
                  <option value="not-recorded">Not recorded</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex-spacer"></div>
        </div>
      </div>
    </div>
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
      let classes = ['button', 'is-small', 'mx-3']
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
</style>

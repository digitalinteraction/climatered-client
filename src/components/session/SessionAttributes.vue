<template>
  <ul class="session-attributes" @click="$emit('show-modal')">
    <!-- Language -->
    <li class="session-attribute emphasise">
      <p class="icon-and-text">
        <span class="icon">
          <fa :icon="['fas', 'globe']" class="fa-xs fa-fw" />
        </span>
        <span class="session-card-language is-uppercase">
          {{ session.hostLanguage.join('/') }}
        </span>
      </p>
    </li>

    <!-- Track -->
    <!-- <li class="session-attribute" v-if="session.track">
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <fa :icon="['fas', 'folder']" class="fa-xs fa-fw" />
          </span>
        </span>
        {{ $t(`schedule.filters.tracks.${session.track}`) }}
      </p>
    </li> -->

    <!-- Platform -->
    <!-- TODO: Enable platform info -->
    <!-- <li class="session-attribute" v-if="session.links">
            <p class="icon-and-text">
              <span class="icon">
                <fa :icon="['fas', 'tv']" class="fa-xs fa-fw" />
              </span>
              Info Missing
            </p>
          </li> -->

    <!-- Devices -->
    <li class="session-attribute" v-if="session.attendeeDevices">
      <p class="icon-and-text">
        <span class="icon">
          <fa :icon="['fas', 'desktop']" class="fa-xs fa-fw" />
        </span>
        {{ $t(`data.devices.${session.attendeeDevices}`) }}
      </p>
    </li>

    <!-- Interactive -->
    <li
      class="session-attribute"
      v-if="session.attendeeInteraction === 'interactive'"
    >
      <p class="icon-and-text">
        <span class="icon">
          <fa :icon="['fas', 'hand-paper']" class="fa-xs fa-fw" />
        </span>
        {{ $t(`data.interaction.${session.attendeeInteraction}`) }}
      </p>
    </li>

    <!-- Recorded -->
    <li class="session-attribute" v-if="session.isRecorded">
      <p class="icon-and-text">
        <span class="icon">
          <fa :icon="['fas', 'save']" class="fa-xs fa-fw" />
        </span>
        {{ $t(`data.recorded.${session.isRecorded}`) }}
      </p>
    </li>

    <div class="clearfix"></div>
  </ul>
</template>

<script>
export default {
  name: 'SessionAttributes',
  props: {
    session: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// Attributes
ul.session-attributes {
  margin: 0 -10px;
  li.session-attribute {
    float: left;
    &:dir(rtl) {
      float: right;
    }
    font-size: 1em;
    padding: 0;
    margin: 10px;
    * {
      color: #999;
      fill: #999;
    }

    &.emphasise * {
      color: #444;
      fill: #444;
    }

    .icon-and-text {
      display: flex;
      align-items: center;
      font-size: 0.9em;
      font-weight: bold;

      .icon {
        margin-inline-end: 3px;
        width: auto;
        svg {
          width: auto;
        }
      }

      &.uppercase {
        text-transform: uppercase;
      }
    }
  }
}
</style>

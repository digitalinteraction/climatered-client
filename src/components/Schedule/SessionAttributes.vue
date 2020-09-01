<template>
  <ul class="session-attributes" @click="$emit('show-modal')">
    <!-- Language -->
    <li class="session-attribute emphasise">
      <p class="icon-and-text">
        <span class="icon">
          <GlobeIcon class="icon-size" />
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
                <span class="icon">
                  <PlatformIcon class="icon-size" />
                </span>
              </span>
              Info Missing
            </p>
          </li> -->

    <!-- Devices -->
    <li class="session-attribute" v-if="session.attendeeDevices">
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <DevicesIcon class="icon-size" />
          </span>
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
          <span class="icon">
            <InteractionIcon class="icon-size" />
          </span>
        </span>
        {{ $t(`data.interaction.${session.attendeeInteraction}`) }}
      </p>
    </li>

    <!-- Recorded -->
    <li class="session-attribute" v-if="session.isRecorded">
      <p class="icon-and-text">
        <span class="icon">
          <span class="icon">
            <RecordIcon class="icon-size" />
          </span>
        </span>
        {{ $t(`data.recorded.${session.isRecorded}`) }}
      </p>
    </li>

    <div class="clearfix"></div>
  </ul>
</template>

<script>
// Icons
import GlobeIcon from '@/icons/globe.svg'
import DevicesIcon from '@/icons/devices.svg'
import InteractionIcon from '@/icons/interaction.svg'
import RecordIcon from '@/icons/rec.svg'
// import PlatformIcon from '@/icons/platform.svg'

export default {
  name: 'SessionAttributes',
  components: {
    GlobeIcon,
    DevicesIcon,
    InteractionIcon,
    RecordIcon
    // PlatformIcon
  },
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

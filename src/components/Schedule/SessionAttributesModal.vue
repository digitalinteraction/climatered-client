<template>
  <div class="session-attributes-modal">
    <!-- Modal wrapper -->
    <div :class="['modal', { 'is-active': session }]">
      <!-- Modal background -->
      <div
        class="modal-background"
        @click="$emit('update:session', undefined)"
      ></div>

      <!-- Modal content -->
      <div class="modal-content" v-if="session">
        <div class="box">
          <h1 class="title">
            {{ $t(`schedule.attributes.sessionAttributes`) }}
          </h1>
          <ul class="session-attributes">
            <li
              class="session-attribute"
              @click="attributesModalVisible = true"
            >
              <p class="icon-and-text">
                <span class="icon">
                  <GlobeIcon class="icon-size" />
                </span>
                <span class="session-card-language is-uppercase">
                  {{ session.hostLanguage.join('/') }}
                </span>
              </p>
            </li>

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

          <!-- Inline close modal button -->
          <button
            @click="session = undefined"
            class="button is-small is-danger mt-5"
            aria-label="close"
          >
            {{ $t(`schedule.close`) }}
          </button>
        </div>

        <!-- Fixed close modal button -->
        <button
          @click="session = undefined"
          class="modal-close is-large"
          aria-label="close"
        >
          {{ $t(`schedule.close`) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Icons
import GlobeIcon from '@/icons/globe.svg'
import DevicesIcon from '@/icons/devices.svg'
import InteractionIcon from '@/icons/interaction.svg'
import RecordIcon from '@/icons/rec.svg'

export default {
  name: 'SessionAttributesModal',
  components: { GlobeIcon, DevicesIcon, InteractionIcon, RecordIcon },
  props: {
    session: {
      type: Object,
      required: false,
      default: () => {
        return undefined
      }
    }
  }
}
</script>

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
                  <fa :icon="['fas', 'globe']" class="fa-xs fa-fw" />
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
                <fa :icon="['fas', 'tv']" class="fa-xs fa-fw" />
                </span>
              </span>
              Info Missing
            </p>
          </li> -->

            <li class="session-attribute" v-if="session.attendeeDevices">
              <p class="icon-and-text">
                <span class="icon">
                  <fa :icon="['fas', 'desktop']" class="fa-xs fa-fw" />
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
                  <fa :icon="['fas', 'hand-paper']" class="fa-xs fa-fw" />
                </span>
                {{ $t(`data.interaction.${session.attendeeInteraction}`) }}
              </p>
            </li>

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
export default {
  name: 'SessionAttributesModal',
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

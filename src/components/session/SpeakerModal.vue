<template>
  <div id="speaker-modal">
    <!-- Modal wrapper -->
    <div :class="['modal', { 'is-active': speaker }]">
      <!-- Modal background -->
      <div
        class="modal-background"
        @click="$emit('update:speaker', undefined)"
      ></div>

      <!-- Modal content -->
      <div class="modal-content" v-if="speaker">
        <div class="card">
          <div class="card-content is-clearfix">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img
                    class="headshot"
                    :src="imageUrl"
                    alt="Speaker headshot"
                  />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ speaker.name }}</p>
                <p class="subtitle is-6">{{ localeRole }}</p>
              </div>
            </div>

            <div class="content">
              {{ localeBio }}
            </div>
            <a
              @click="$emit('update:speaker', undefined)"
              class="button is-danger is-small is-pulled-right"
              aria-label="close"
            >
              {{ $t(`schedule.close`) }}
            </a>
          </div>
        </div>

        <!-- Fixed close modal button -->
        <button
          @click="$emit('update:speaker', undefined)"
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
import { pickCdn } from '@/utils'
export default {
  name: 'SpeakerModal',
  props: {
    speaker: {
      type: Object,
      required: false,
      default: () => {
        return undefined
      }
    }
  },
  computed: {
    localeRole() {
      return this.speaker.role[this.$i18n.locale]
    },
    localeBio() {
      return this.speaker.bio[this.$i18n.locale]
    },
    imageUrl() {
      return pickCdn() + this.speaker.headshot
    }
  }
}
</script>

<style lang="scss" scoped>
#speaker-modal {
  .modal-content {
    border-radius: $radius;

    img.headshot {
      border-radius: 50%;
    }
  }
}
</style>

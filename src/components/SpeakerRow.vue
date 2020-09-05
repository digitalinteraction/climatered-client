<template>
  <div
    :class="['speaker-row', { 'is-interactive': isInteractive }]"
    @click="isInteractive ? $emit('click') : undefined"
  >
    <div class="speaker-headshot">
      <img :src="imageUrl" width="42" height="42" />
    </div>
    <div class="speaker-info">
      <p class="speaker-title">{{ speaker.name }}</p>
      <p class="speaker-role">{{ localeRole }}</p>
    </div>
  </div>
</template>

<script>
//
// A table-like row to show a speaker's headshot, name and role
//

import { pickCdn } from '@/utils'

export default {
  props: {
    speaker: { type: Object, required: true },
    isInteractive: { type: Boolean, default: false }
  },
  computed: {
    imageUrl() {
      return pickCdn() + this.speaker.headshot
    },
    localeRole() {
      return this.speaker.role[this.$i18n.locale]
    }
  }
}
</script>

.<style lang="scss" scoped>
$img-size: 42px;

.speaker-row {
  display: flex;
  &.is-interactive {
    &:hover {
      cursor: pointer;
      .speaker-title {
        text-decoration: underline;
      }
    }
  }
}

.speaker-headshot {
  padding-inline-end: 8px;
  img {
    border-radius: $img-size;
  }
}

.speaker-info {
  flex: 1;
  padding-inline-end: 2rem;
}

.speaker-title {
  min-height: 1.5em;
  margin-bottom: 0 !important;
  font-weight: bold;
}
.speaker-role {
  color: $grey;
  font-size: $size-7;
}
</style>

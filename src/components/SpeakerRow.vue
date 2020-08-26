<template>
  <div class="speaker-row" aria-label="speaker">
    <div class="speaker-headshot">
      <img :src="imageUrl" width="42" height="42" alt="headshot" />
    </div>
    <div class="speaker-info">
      <p class="speaker-title" aria-label="name">{{ speaker.name }}</p>
      <p class="speaker-role" aria-label="job role">{{ localeRole }}</p>
    </div>
  </div>
</template>

<script>
import { pickCdn } from '@/utils'

export default {
  props: {
    speaker: { type: Object, required: true }
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
}

.speaker-headshot {
  padding-inline-end: 8px;
  img {
    border-radius: $img-size;
  }
}

.speaker-info {
  flex: 1;
}

.speaker-title {
  font-weight: bold;
}
.speaker-role {
  color: $grey;
  font-size: $size-7;
}
</style>

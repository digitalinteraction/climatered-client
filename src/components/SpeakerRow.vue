<template>
  <div class="speaker-row">
    <img :src="imageUrl" width="42" height="42" class="speaker-headshot" />
    <div class="speaker-info">
      <p class="speaker-title">{{ speaker.name }}</p>
      <p class="speaker-role">{{ speaker.role }}</p>
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
    }
  }
}
</script>

.<style lang="scss" scoped>
$img-size: 42px;

.speaker-row {
  position: relative;
  padding-left: $img-size + 10px;
}

.speaker-headshot {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: $img-size;
}

.speaker-info {
}

.speaker-title {
  font-weight: bold;
}
.speaker-role {
  color: $grey;
}
</style>

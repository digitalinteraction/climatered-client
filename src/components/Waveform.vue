<template>
  <div class="waveform">
    <canvas class="audio-vis" :width="width" :height="height" ref="canvas" />
  </div>
</template>

<script>
// const maxStack = 24

export default {
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  data() {
    return {
      audioStack: []
    }
  },
  mounted() {
    this.$clock.bind(this, () => {
      // ...
    })
  },
  destroyed() {
    this.$clock.unbind(this)
  },
  methods: {
    pushData(arrayBuffer) {
      console.log(arrayBuffer)
    }
  }
}
</script>

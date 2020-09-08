<template>
  <div ref="anim"></div>
</template>

<script>
import lottie from 'lottie-web'

export default {
  props: {
    animationData: { type: Object, required: true },
    loop: { type: Boolean, default: false },
    autoPlay: { type: Boolean, default: true }
  },
  data() {
    return {
      anim: null
    }
  },
  mounted() {
    this.setupAnimation()
  },
  methods: {
    setupAnimation() {
      this.anim = lottie.loadAnimation({
        container: this.$refs.anim,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoPlay,
        animationData: this.animationData
      })

      this.anim.addEventListener('loopComplete', () => {
        this.$emit('loopComplete', this.anim)
      })

      this.anim.addEventListener('complete', () => {
        this.$emit('complete', this.anim)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}
</style>

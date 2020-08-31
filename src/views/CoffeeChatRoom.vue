<template>
  <AppWrapper>
    <div class="columns">
      <div
        class="column"
        v-for="(ms, user) in mediaStreams"
        :key="`media-${user}`"
      >
        <WebRTCVideo :media-stream="ms" />
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import { mapState } from 'vuex'
import AppWrapper from '@/components/AppWrapper.vue'
import WebRTCVideo from '@/components/WebRTCVideo.vue'
import CoffeeChatRoom from '../coffee-chat/coffee-chat-room'
export default {
  components: { AppWrapper, WebRTCVideo },
  props: {
    timeLimit: { type: Number, default: 0 }
  },
  computed: {
    ...mapState('api', ['user'])
  },
  data() {
    return {
      mediaStreams: {},
      userState: {}
    }
  },
  async mounted() {
    const mediaStream = await this.setupMedia()
    this.coffeeChat = new CoffeeChatRoom(
      this.$socket,
      mediaStream,
      this.user.iat,
      (fromUser, ms) => {
        this.$set(this.mediaStreams, fromUser, ms)
      },
      (fromUser, s) => {
        this.$set(this.mediaStreams, fromUser, s)
      }
    )
    const roomId = this.$route.params.room
    this.coffeeChat.joinRoom(roomId)
  },
  destroyed() {
    this.coffeeChat.destroy()
  },
  methods: {
    setupMedia() {
      return new Promise((resolve, reject) => {
        navigator.getUserMedia(
          {
            video: true,
            audio: {
              echoCancellation: true,
              autoGainControl: true,
              noiseSuppression: true
            }
          },
          stream => {
            resolve(stream)
          },
          error => {
            reject(error)
          }
        )
      })
    }
  }
}
</script>

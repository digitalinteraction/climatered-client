<template>
  <AppWrapper>
    <div class="columns">
      <div
        class="column"
        v-for="(ms, user) in remoteStreams"
        :key="`media-${user}`"
      >
        <WebRTCVideo :media-stream="ms" />
      </div>
      <div v-if="localMediaStream">
        <WebRTCVideo :media-stream="localMediaStream" :muted="true" />
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
      remoteStreams: {},
      userState: {},
      localMediaStream: null,
      muted: false
    }
  },
  async mounted() {
    this.localMediaStream = await this.setupMedia()
    this.coffeeChat = new CoffeeChatRoom(
      this.$socket,
      this.localMediaStream,
      this.user.iat,
      (fromUser, remoteTrack) => {
        let remoteStream
        if (!this.remoteStreams[fromUser]) {
          remoteStream = new MediaStream()
        } else {
          remoteStream = this.remoteStreams[fromUser]
        }
        remoteStream.addTrack(remoteTrack, remoteStream)
        this.$set(this.remoteStreams, fromUser, remoteStream)
      },
      (fromUser, s) => {
        this.$set(this.userState, fromUser, s)
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
    },
    toggleMute() {
      this.muted = !this.muted
    }
  }
}
</script>

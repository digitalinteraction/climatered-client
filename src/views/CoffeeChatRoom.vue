<template>
  <AppWrapper>
    <div class="wrapper">
      <div class="grid-container">
        <!-- <div class="grid-item" v-if="localMediaStream">
          <WebRTCVideo :media-stream="localMediaStream" :muted="true" />
        </div> -->
        <div
          class="grid-item"
          v-for="(ms, user) in remoteStreams"
          :key="`media-${user}`"
        >
          <WebRTCVideo class="remote-video" :media-stream="ms" />
        </div>
      </div>
      <div class="local-camera" v-if="localMediaStream">
        <WebRTCVideo :media-stream="localMediaStream" :muted="true" />
      </div>
      <div class="call-controls">
        <div class="level">
          <div class="level-item has-text-centered">
            <button class="button" @click="toggleMute">
              <i
                :class="
                  `fas ${muted ? 'fa-microphone-slash' : 'fa-microphone'}`
                "
              ></i>
            </button>
          </div>
          <div class="level-item has-text-centered">
            <button
              class="button"
              @click="shareContactDetails"
              :disabled="!contactDetails"
            >
              Share Contact Details
            </button>
          </div>
          <div class="level-item has-text-centered">
            <button class="button" @click="leave">Leave</button>
          </div>
        </div>
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
      muted: false,
      contactDetails: null
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
  beforeDestroy() {
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
              noiseSuppression: true,
              channelCount: 1
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
      this.sendStateToPeers()
    },
    shareContactDetails() {
      this.contactDetails = {
        email: 'test@test.com'
      }
      this.sendStateToPeers()
    },
    sendStateToPeers() {
      this.coffeeChat.sendUserData({
        muted: this.muted,
        contact: this.contactDetails
      })
    },
    leave() {
      this.$router.go(-100)
    }
  }
}
</script>
<style lang="scss">
.app-page {
  display: flex;
}
</style>
<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  position: relative;
}

.grid-container {
  flex: 1;
  display: grid;
  grid-gap: 10px;
  // grid-template-columns: 100px 100px 100px;
  // grid-template-rows: 100px 100px 100px;
}

.remote-video {
  min-width: 100% !important;
}

.local-camera {
  position: absolute;
  bottom: 50px;
  right: 50px;
  max-width: 20vw;
}

.call-controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
}
</style>

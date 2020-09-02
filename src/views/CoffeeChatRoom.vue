<template>
  <AppWrapper>
    <div class="wrapper">
      <div class="grid-container">
        <div
          class="grid-item"
          v-for="(remoteStream, user) in remoteStreams"
          :key="`media-${user}`"
        >
          <WebRTCVideo
            class="remote-video remote-video-1"
            :media-stream="remoteStream.mediaStream"
            :muted="remoteStream.muted"
          />
        </div>
      </div>
      <div class="local-camera" v-if="localMediaStream">
        <WebRTCVideo
          :media-stream="localMediaStream"
          muted
          :show-muted-icon="false"
          :is-local-video="true"
        />
      </div>
      <div class="call-controls">
        <div class="level">
          <div class="level-item has-text-centered">
            <button class="button" @click="toggleMute">
              <span class="icon is-small">
                <fa :icon="`${muted ? 'microphone-slash' : 'microphone'}`" />
              </span>
              <span v-if="muted">Unmute</span>
              <span v-else>Mute</span>
            </button>
          </div>
          <div class="level-item has-text-centered">
            <button
              class="button"
              @click="shareContactDetails"
              :disabled="contactDetails"
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
        let remoteStream = {}
        if (!this.remoteStreams[fromUser]) {
          remoteStream.mediaStream = new MediaStream()
          remoteStream.muted = false
        } else {
          remoteStream = this.remoteStreams[fromUser]
        }
        remoteStream.mediaStream.addTrack(remoteTrack, remoteStream.mediaStream)
        this.$set(this.remoteStreams, fromUser, remoteStream)
        console.log(remoteStream)
      },
      (fromUser, s) => {
        if (this.remoteStreams[fromUser]) {
          this.remoteStreams[fromUser].muted = s.muted
        }
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
      this.localMediaStream.getAudioTracks().forEach(t => {
        t.enabled = !this.muted
      })
      this.sendStateToPeers()
    },
    shareContactDetails() {
      this.contactDetails = {
        email: this.user.sub
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
body {
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: hidden;
}
.app-page {
  display: flex;
  flex: 1;
}
.remote-video {
  video {
    position: absolute;
    object-fit: cover;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  position: relative;
  background-color: $greyish;
}

.grid-container {
  flex: 1;
  display: grid;
  grid-gap: 10px;
  grid-area: auto;
  // grid-template-columns: 100px 100px 100px;
  // grid-template-rows: 100px 100px 100px;
}

.local-camera {
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  width: 16rem;
  height: 9rem;
}

.call-controls {
  position: fixed;
  left: 50%;
  bottom: 6rem;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
</style>

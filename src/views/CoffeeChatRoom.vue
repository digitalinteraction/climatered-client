<template>
  <AppWrapper>
    <div class="wrapper">
      <div
        class="joining-message"
        v-if="Object.keys(remoteStreams).length == 0"
      >
        <h1 class="title has-text-white">
          Waiting for your partner to join
        </h1>
      </div>
      <div class="grid-container">
        <transition name="pop-in">
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
        </transition>
      </div>
      <div class="share-box has-text-white">
        <div
          class="info-button has-text-centered"
          @click="joiningInfoWindowActive = !joiningInfoWindowActive"
        >
          <span class="icon">
            <fa icon="info-circle" class="info-circle-icon" />
          </span>
        </div>
        <div class="info-text" v-if="joiningInfoWindowActive">
          <h3 class="is-size-5 has-text-weight-semibold">Joining Info</h3>
          <p>{{ roomLink }}</p>
        </div>
      </div>
      <transition name="pop-in">
        <div class="local-camera" v-if="localMediaStream">
          <WebRTCVideo
            :media-stream="localMediaStream"
            :is-local-video="true"
          />
        </div>
      </transition>
      <div class="call-controls buttons" v-if="showControls">
        <button class="button" @click="toggleMute">
          <span class="icon is-small">
            <fa :icon="`${muted ? 'microphone-slash' : 'microphone'}`" />
          </span>
          <span v-if="muted">Unmute</span>
          <span v-else>Mute</span>
        </button>
        <button
          class="button"
          @click="shareContactDetails"
          :disabled="contactDetails"
        >
          Share Contact Details
        </button>

        <button class="button" @click="leave">Leave</button>
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
      contactDetails: null,
      showControls: false,
      coffeeChat: null,
      roomLink: window.location,
      joiningInfoWindowActive: false
    }
  },
  async mounted() {
    this.localMediaStream = await this.setupMedia()
    this.enterLocalVideo()
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
    if (this.coffeeChat !== null) {
      this.coffeeChat.destroy()
    }
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
    enterLocalVideo() {
      this.showControls = true
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
<style lang="scss" scoped>
.joining-message {
  width: 100%;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin-top: 12rem;
  padding: 1rem;
}

.share-box {
  position: absolute;
  left: 2rem;
  top: 2rem;
  background-color: rgba($color: #000000, $alpha: 0.4);
  padding: 1rem;
  border-radius: 0.75rem;
  max-width: 386px;

  @include mobile {
    top: 0.5rem;
    left: 0.5rem;
    margin-right: 0.5rem;
    max-width: 100%;
  }

  .info-button {
    width: 1.75rem;
    line-height: 0rem;
    display: inline-block;
    vertical-align: top;
    :hover {
      cursor: pointer;
    }
  }

  .info-text {
    padding-left: 1rem;
    width: 90%;
    display: inline-block;
  }

  .info-circle-icon {
    height: 1.5rem;
    width: 1.5rem;
  }
}

.wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $greyish;
}

.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  .grid-item {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
  }
}

.local-camera {
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  width: 16rem;
  height: 12rem;
}

.call-controls {
  position: fixed;
  left: 50%;
  bottom: 6rem;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}

.pop-in-enter-active {
  transition: transform 1s ease-in-out;
}
.pop-in-leave-active {
  transition: transform 1s ease-out;
}

.pop-in-enter,
.pop-in-leave-to {
  transform: scale(0.25);
}
</style>

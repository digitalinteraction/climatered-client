<template>
  <AppWrapper>
    <div class="wrapper">
      <div
        class="joining-message"
        v-if="Object.keys(remoteStreams).length == 0"
      >
        <h1 class="title has-text-white">
          {{ $t('coffeechatroom.waitingForPartner') }}
        </h1>
        <div v-if="userMediaError">
          <span class="icon is-small has-text-white">
            <fa :icon="'video-slash'" />
          </span>
          <h2 class="subtitle has-text-white">
            {{ $t('coffeechatroom.userMediaErrors.generalError') }}
            <span v-if="userMediaError !== 'PermissionDeniedError'">, </span>
            <span v-if="userMediaError == 'DevicesNotFoundError'">
              {{ $t('coffeechatroom.userMediaErrors.devicesNotFoundError') }}
            </span>
            <span v-if="userMediaError == 'TrackStartError'">
              {{ $t('coffeechatroom.userMediaErrors.devicesNotFoundError') }}
            </span>
            <span v-if="userMediaError == 'ConstraintNotSatisfiedError'">
              {{
                $t('coffeechatroom.userMediaErrors.constraintNotSatisfiedError')
              }}
            </span>
            <span
              v-if="
                userMediaError == 'TypeError' ||
                  userMediaError == 'UnknownError'
              "
            >
              {{ $t('coffeechatroom.userMediaErrors.TypeError') }}
            </span>
            <div v-if="userMediaError == 'PermissionDeniedError'">
              <div class="error-instruction-container">
                <div v-if="browserType == 'safari'">
                  <p>
                    {{
                      $t('coffeechatroom.userMediaErrors.instructions.safari')
                    }}
                  </p>
                </div>
                <div v-if="browserType == 'chrome'">
                  <p>
                    {{
                      $t('coffeechatroom.userMediaErrors.instructions.chrome')
                    }}
                  </p>
                </div>
                <div v-if="browserType == 'firefox'">
                  {{
                    $t('coffeechatroom.userMediaErrors.instructions.firefox')
                  }}
                </div>
                <div v-if="browserType == 'edge'">
                  {{ $t('coffeechatroom.userMediaErrors.instructions.edge') }}
                </div>
              </div>
            </div>
            <button
              class="button is-purple"
              @click="retryCamera"
              v-if="userMediaError !== 'PermissionDeniedError'"
            >
              Enable Camera & Mic
            </button>
          </h2>
        </div>
      </div>
      <div class="grid-container">
        <transition-group name="pop-in">
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
        </transition-group>
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
          <h3 class="is-size-5 has-text-weight-semibold">
            {{ $t('coffeechatroom.joiningInfo') }}
          </h3>
          <p>{{ roomLink }}</p>
        </div>
      </div>
      <div class="local-camera" v-if="localMediaStream">
        <transition name="pop-in">
          <WebRTCVideo
            :media-stream="localMediaStream"
            :muted="true"
            :is-local-video="true"
          />
        </transition>
        <button
          class="button share-button is-purple"
          @click="shareContactDetails"
          :disabled="contactDetails"
        >
          {{ $t('coffeechatroom.shareContactDetails') }}
        </button>
      </div>
      <div class="call-controls buttons" v-if="showControls">
        <button
          class="button"
          @click="toggleMute"
          :title="`${muted ? 'Unmute Mic' : 'Mute Mic'}`"
        >
          <span class="mute-button icon is-large has-text-white">
            <fa :icon="`${muted ? 'microphone-slash' : 'microphone'}`" />
          </span>
        </button>
        <button
          class="button"
          @click="toggleCamera"
          :title="`${videoEnabled ? 'Enable Video' : 'Disable Video'}`"
        >
          <span class="video-button icon is-large has-text-white">
            <fa :icon="`${videoEnabled ? 'video-slash' : 'video'}`" />
          </span>
        </button>
        <button class="button" @click="leave" title="Leave Chat">
          <span class="leave-button icon is-large has-text-white">
            <fa icon="phone" />
          </span>
        </button>
      </div>
    </div>
    <div
      class="notification share-popup has-text-light"
      v-if="showNotification"
    >
      <button class="delete"></button>
      {{ contactDetails.email }}
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
    ...mapState('api', ['user']),
    browserType() {
      return window.adapter.browserDetails.browser
    }
  },
  data() {
    return {
      remoteStreams: {},
      userState: {},
      localMediaStream: null,
      muted: false,
      videoEnabled: false,
      contactDetails: null,
      showControls: false,
      coffeeChat: null,
      roomLink: window.location,
      joiningInfoWindowActive: false,
      showNotification: false,
      userMediaError: null
    }
  },
  async mounted() {
    await this.setupMedia()
  },
  beforeDestroy() {
    if (this.coffeeChat !== null) {
      this.coffeeChat.destroy()
    }
  },
  methods: {
    async setupMedia() {
      try {
        this.localMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
      } catch (err) {
        //log to console first
        console.log(err) /* handle the error */
        if (err.name == 'NotFoundError' || err.name == 'DevicesNotFoundError') {
          //required track is missing
          this.userMediaError = 'DevicesNotFoundError'
        } else if (
          err.name == 'NotReadableError' ||
          err.name == 'TrackStartError'
        ) {
          //webcam or mic are already in use
          this.userMediaError = 'TrackStartError'
        } else if (
          err.name == 'OverconstrainedError' ||
          err.name == 'ConstraintNotSatisfiedError'
        ) {
          //constraints can not be satisfied by avb. devices
          this.userMediaError = 'ConstraintNotSatisfiedError'
        } else if (
          err.name == 'NotAllowedError' ||
          err.name == 'PermissionDeniedError'
        ) {
          //permission denied in browser
          this.userMediaError = 'PermissionDeniedError'
        } else if (err.name == 'TypeError' || err.name == 'TypeError') {
          //empty constraints object
          this.userMediaError = 'TypeError'
        } else {
          //other errors
          this.userMediaError = 'UnknownError'
        }
      }
      if (this.localMediaStream === null) {
        return
      }
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
          remoteStream.mediaStream.addTrack(
            remoteTrack,
            remoteStream.mediaStream
          )
          this.$set(this.remoteStreams, fromUser, remoteStream)
        },
        (fromUser, s) => {
          if (this.remoteStreams[fromUser]) {
            this.remoteStreams[fromUser].muted = s.muted
          }
          this.$set(this.userState, fromUser, s)
        },
        fromUser => {
          this.$delete(this.remoteStreams, fromUser)
          this.$delete(this.userState, fromUser)
        }
      )
      const roomId = this.$route.params.room
      this.coffeeChat.joinRoom(roomId)
    },
    async retryCamera() {
      await this.setupMedia()
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
    toggleCamera() {
      this.videoEnabled = !this.videoEnabled
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
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.joining-message {
  width: 100%;
  text-align: center;
  margin-top: 30vh;
  padding: 1rem;
}

.error-instruction-container {
  padding: 3rem;
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
    z-index: 1;
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
  overflow-y: hidden;
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
  // grid-template-columns: 50% 50%;
  // grid-template-rows: 100% 100%;
  .grid-item {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
  }
}

.local-camera {
  position: absolute;
  bottom: 4.75rem;
  right: 2rem;
  width: 16rem;
  height: 12rem;
  @include mobile {
    width: 35%;
    height: 30%;
    right: 0.5rem;
    top: 0.5rem;
    // width: 40vw;
    // height: 15vh;
    // top: 0.5rem;
    // right: 0.5rem;
    .share-button {
      display: none;
    }
  }
}

.share-button {
  margin-top: 0.5rem;
  width: 100%;
}

.call-controls {
  position: absolute;
  left: 50%;
  bottom: 1.75rem;
  // transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.4);
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 200px;
  margin-left: -100px;
  .button {
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 3.5rem;
    border-color: none;
    background-color: rgba($color: #000000, $alpha: 0);
    margin-bottom: 0;
    padding: 0;
  }
  .button:active {
    border-color: rgb(219, 219, 219);
  }
  .leave-button {
    svg {
      transform: rotate(226deg);
      transform-origin: center;
    }
  }
  @include mobile {
    min-width: 200px;
    left: 50%;
    margin-left: -100px;
    position: absolute;
    bottom: 0.5rem;
    padding: 0.5rem;
    transform: unset;
    .button {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 3.5rem;
      padding: 0.5rem;
    }
  }
}

.share-popup {
  background-color: $cc-purple;
  max-width: 35%;
  margin: auto;
  margin-top: 1.75rem;
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

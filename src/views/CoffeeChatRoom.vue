<template>
  <AppWrapper :show-footer="false">
    <div class="wrapper">
      <div
        class="joining-message"
        v-if="Object.keys(remoteStreams).length == 0"
      >
        <h1 class="title has-text-white">
          {{ $t('coffeechatroom.waitingForPartner') }}...
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
              {{ $t('coffeechatroom.userMediaErrors.retryButtonText') }}
            </button>
          </h2>
        </div>
      </div>
      <div
        :class="
          `grid-container grid-item-count-${
            remoteStreamsLength < 8 ? remoteStreamsLength : 8
          }`
        "
      >
        <div
          v-for="(remoteStream, user, i) in remoteStreams"
          :key="`media-${user}`"
          :class="`grid-item gi-${i}`"
        >
          <transition-group name="pop-in">
            <WebRTCVideo
              class="remote-video"
              :key="`rv-${i}`"
              :media-stream="remoteStream.mediaStream"
              :muted="remoteStream.muted"
            />
          </transition-group>
        </div>
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
          <button
            class="button is-outlined is-fullwidth"
            @click="copyToClipboard(roomLink)"
          >
            <span class="icon">
              <fa icon="copy" />
            </span>
            <span v-if="!showLinkCopied">{{
              $t('coffeechatroom.copyJoinText')
            }}</span>
            <span v-if="showLinkCopied">{{
              $t('coffeechatroom.copiedJoinInfo')
            }}</span>
          </button>
          <h3
            class="is-size-5 has-text-weight-semibold"
            v-if="peerContactDetails.length > 0"
          >
            <hr />
            {{ $t('coffeechatroom.contactDetails') }}
          </h3>
          <div
            class="columns is-multiline is-gapless"
            v-for="(c, i) in peerContactDetails"
            :key="`cd-${i}`"
          >
            <div class="column is-12">
              <h3 class="has-text-weight-semibold">
                {{ $t('register.name.label') }}:
              </h3>
              <p>{{ c.name }}</p>
            </div>
            <div class="column is-12">
              <h3 class="has-text-weight-semibold">
                {{ $t('login.email.label') }}:
              </h3>
              <a class="has-text-white" :href="`mailto:${c.email}`">{{
                c.email
              }}</a>
            </div>
          </div>
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
          <span class="share-button-text">
            {{
              sharedContactDetails
                ? $t('coffeechatroom.sharedContactDetails')
                : $t('coffeechatroom.shareContactDetails')
            }}
          </span>
          <span class="share-button-icon">
            <fa icon="envelope" class="fa-lg" v-if="!sharedContactDetails" />
            <span v-else>{{ $t('coffeechatroom.sharedContactDetails') }} </span>
          </span>
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
            <fa :icon="`${videoEnabled ? 'video' : 'video-slash'}`" />
          </span>
        </button>
        <button class="button" @click="leave" title="Leave Chat">
          <span class="leave-button icon is-large has-text-white">
            <fa icon="phone" />
          </span>
        </button>
      </div>
    </div>
    <a href="https://thinkactivelabs.co.uk" target="_blank">
      <img class="ta-logo" src="/img/poweredby-ta.svg" width="200" />
    </a>
    <div
      class="notification share-popup has-text-light"
      v-if="remoteStreamsLength > 8"
    >
      {{ $t('coffeechatroom.tooManyStreams') }}
    </div>
    <div
      class="loading-animation"
      v-if="Object.keys(remoteStreams).length == 0"
    >
      <LottieAnimation :animation-data="animationData" :loop="true" />
    </div>
  </AppWrapper>
</template>

<script>
import { mapState } from 'vuex'
import AppWrapper from '@/components/AppWrapper.vue'
import WebRTCVideo from '@/components/WebRTCVideo.vue'
import CoffeeChatRoom from '../coffee-chat/coffee-chat-room'
import { ROUTE_COFFEE_CHAT } from '../const'
import copy from 'copy-to-clipboard'
import LottieAnimation from '@/components/LottieAnimation.vue'
import loadingAnimationData from '@/icons/coffee-chat-loader.json'

export default {
  components: { AppWrapper, WebRTCVideo, LottieAnimation },
  props: {
    timeLimit: { type: Number, default: 0 }
  },
  computed: {
    ...mapState('api', ['user', 'profile']),
    browserType() {
      return window.adapter.browserDetails.browser
    },
    peerContactDetails() {
      return Object.keys(this.userState)
        .map(user => this.userState[user].contact)
        .filter(c => c)
    },
    remoteStreamsLength() {
      return Object.keys(this.remoteStreams).length
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
      userMediaError: null,
      showLinkCopied: false,
      animationData: loadingAnimationData,
      sharedContactDetails: false
    }
  },
  async mounted() {
    await this.setupMedia()
  },
  beforeDestroy() {
    if (this.coffeeChat !== null) {
      this.coffeeChat.destroy()
    }
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(t => {
        t.stop()
      })
    }
  },
  methods: {
    async setupMedia() {
      try {
        this.localMediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: 'user'
            }
          },
          audio: true
        })
        this.videoEnabled = true
      } catch (err) {
        //log to console first
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
          this.contactDetails = null
        },
        (fromUser, s) => {
          if (this.remoteStreams[fromUser]) {
            this.remoteStreams[fromUser].muted = s.muted
          }
          const oldLen = this.peerContactDetails.length
          this.$set(this.userState, fromUser, s)
          if (this.peerContactDetails.length > oldLen)
            this.joiningInfoWindowActive = true
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
      this.$gtag.event('started', {
        event_category: 'coffee-chat',
        event_label: 'User entered a coffee chat',
        value: 0
      })
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
      if (this.localMediaStream.active) {
        let track = null
        this.localMediaStream.getTracks().forEach(t => {
          if (t.readyState == 'live' && t.kind === 'video') {
            track = t
          }
        })
        track.enabled = this.videoEnabled
      }
    },
    shareContactDetails() {
      this.contactDetails = {
        email: this.user.sub,
        name: this.profile.name
      }
      this.$gtag.event('shared-contact', {
        event_category: 'coffee-chat',
        event_label: 'User shared contact details',
        value: 0
      })
      this.sendStateToPeers()
      this.sharedContactDetails = true

      setTimeout(() => {
        this.sharedContactDetails = false
      }, 1500)
    },
    sendStateToPeers() {
      this.coffeeChat.sendUserData({
        muted: this.muted,
        contact: this.contactDetails
      })
    },
    leave() {
      const msg = this.$i18n.t('coffeechatroom.confirmLeaveText')
      if (!confirm(msg)) return
      this.$router.push({ name: ROUTE_COFFEE_CHAT })
    },
    copyToClipboard(link) {
      copy(link)
      this.showLinkCopied = true
      setTimeout(() => {
        this.showLinkCopied = false
      }, 1000)
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
  @include mobile {
    margin-top: 15vh;
  }
}

.loading-animation {
  height: 45vh;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  @include mobile {
    height: 35vh;
  }
}

.error-instruction-container {
  padding: 3rem;
  @include mobile {
    padding: 1rem;
  }
}

.share-box {
  position: absolute;
  left: 2rem;
  top: 2rem;
  background-color: rgba($color: #000000, $alpha: 0.4);
  padding: 1rem;
  border-radius: 0.75rem;
  max-width: 386px;
  z-index: 10;

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
    padding: 0 1rem;
    display: inline-block;
    hr {
      height: 0.5px;
      margin: 1rem 0;
    }
    p {
      word-break: break-all;
    }
    .button {
      margin-top: 0.5rem;
      color: white;
      border-color: none;
      border: none;
      background-color: rgba($color: #000000, $alpha: 0);
      margin-bottom: 0;
      justify-content: start;
    }
    .button:active {
      background-color: rgba($color: #ffffff, $alpha: 0.25);
    }
    .button:hover {
      background-color: rgba($color: #ffffff, $alpha: 0.25);
    }
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
  background-image: url('/img/bg-pattern.svg');
  background-repeat: no-repeat;
  background-position: top;
}

.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto;
  &.grid-item-count-1 {
    grid-template-areas: 'gi-0';
  }
  &.grid-item-count-2 {
    grid-template-areas: 'gi-0 gi-1';
    @include mobile {
      grid-template-areas:
        'gi-0'
        'gi-1';
    }
  }
  &.grid-item-count-3 {
    grid-template-areas:
      'gi-0 gi-2'
      'gi-1 gi-2';
    @include mobile {
      grid-template-areas:
        'gi-2 gi-2'
        'gi-0 gi-1';
    }
  }
  &.grid-item-count-4 {
    grid-template-areas:
      'gi-0 gi-2'
      'gi-1 gi-3';
    @include mobile {
      grid-template-areas:
        'gi-0 gi-1'
        'gi-2 gi-3';
    }
  }
  &.grid-item-count-5 {
    grid-template-areas:
      'gi-0 gi-2 gi-4'
      'gi-1 gi-3 gi-4';
    @include mobile {
      grid-template-areas:
        'gi-0 gi-1'
        'gi-2 gi-3'
        'gi-4 gi-4';
    }
  }
  &.grid-item-count-6 {
    grid-template-areas:
      'gi-0 gi-2 gi-4'
      'gi-1 gi-3 gi-5';
    @include mobile {
      grid-template-areas:
        'gi-0 gi-1'
        'gi-2 gi-3'
        'gi-4 gi-5';
    }
  }
  &.grid-item-count-7 {
    grid-template-areas:
      'gi-0 gi-2 gi-4 gi-6'
      'gi-1 gi-3 gi-5 gi-6';
    @include mobile {
      grid-template-areas:
        'gi-0 gi-1'
        'gi-2 gi-3'
        'gi-4 gi-5'
        'gi-6 gi-6';
    }
  }
  &.grid-item-count-8 {
    grid-template-areas:
      'gi-0 gi-2 gi-4 gi-6'
      'gi-1 gi-3 gi-5 gi-7';
    @include mobile {
      grid-template-areas:
        'gi-0 gi-1'
        'gi-2 gi-3'
        'gi-4 gi-5'
        'gi-6 gi-7';
    }
  }
  .grid-item {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    &.gi-0 {
      grid-area: gi-0;
    }
    &.gi-1 {
      grid-area: gi-1;
    }
    &.gi-2 {
      grid-area: gi-2;
    }
    &.gi-3 {
      grid-area: gi-3;
    }
    &.gi-4 {
      grid-area: gi-4;
    }
    &.gi-5 {
      grid-area: gi-5;
    }
    &.gi-6 {
      grid-area: gi-6;
    }
    &.gi-7 {
      grid-area: gi-7;
    }
  }
}

.local-camera {
  position: absolute;
  bottom: 4.75rem;
  right: 2rem;
  width: 16rem;
  height: 12rem;
  .share-button {
    .share-button-icon {
      display: none;
    }
  }
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
      .share-button-text {
        display: none;
      }
      .share-button-icon {
        display: inline;
      }
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
  z-index: 2;
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
    background-color: rgba($color: #ffffff, $alpha: 0.25);
  }
  .button:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.25);
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
  z-index: 20;
  @include mobile {
    max-width: 80%;
  }
}

.pop-in-enter-active {
  transition: transform 1s ease-in-out;
}
.pop-in-leave-active {
  transition: transform 0.5s ease-out;
}

.pop-in-enter,
.pop-in-leave-to {
  transform: scale(0.25);
}

.ta-logo {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  max-width: 135px;
  z-index: 1;
}
</style>

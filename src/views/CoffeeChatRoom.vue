<template>
  <AppWrapper>
    <div class="columns">
      <div class="column" v-for="u in users" :key="`media-${u}`">
        <video :srcObject="mediaStreams[u]" />
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import { mapState } from 'vuex'
import AppWrapper from '@/components/AppWrapper.vue'
import CoffeeChatRoom from '../coffee-chat/coffee-chat-room'
export default {
  components: { AppWrapper },
  props: {
    timeLimit: { type: Number, default: 0 }
  },
  computed: {
    ...mapState('api', ['user']),
    users() {
      return Object.keys(this.mediaStreams)
    }
  },
  data() {
    return {
      mediaStreams: {},
      userState: {}
    }
  },
  mounted() {
    this.coffeeChat = new CoffeeChatRoom(
      this.$socket,
      this.user.iat,
      (fromUser, ms) => {
        this.mediaStreams[fromUser] = ms
      },
      (fromUser, s) => {
        this.userState[fromUser] = s
      }
    )
    const roomId = this.$route.params.room
    this.coffeeChat.joinRoom(roomId)
  },
  destroyed() {
    this.coffeeChat.destroy()
  }
}
</script>

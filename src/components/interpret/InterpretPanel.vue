<template>
  <div class="interpret-panel">
    <div class="interpret-panel-header">
      <p class="label" v-t="'interpret.onlineLabel'" />
      <div class="tags">
        <span
          class="tag is-info"
          v-for="user in users"
          :key="user.slug"
          v-text="tagMessage(user)"
        />
      </div>
    </div>
    <div class="interpret-panel-main">
      <p class="label" v-t="'interpret.messagesLabel'" />
      <div class="messagebox" ref="box">
        <div class="messagebox-inner">
          <div
            v-for="message in reversedMessages"
            :key="message.date.getTime()"
            class="messagebox-message"
          >
            <p class="messagebox-heading">
              <span class="messagebox-user">{{ message.user.name }}</span>
              <span class="messagebox-date">{{
                message.date | localeTime
              }}</span>
            </p>
            <p class="messagebox-body">
              {{ message.message }}
            </p>
          </div>
        </div>
      </div>
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input"
            v-model="newMessage"
            :placeholder="$t('interpret.sendMessage.placeholder')"
            @keyup.enter="sendMessage"
          />
        </div>
        <div class="control">
          <button
            class="button is-info"
            @click="sendMessage"
            v-t="'interpret.sendMessage.action'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      newMessage: ''
    }
  },
  computed: {
    ...mapState('interpret', ['users', 'messages']),
    ...mapState('api', ['user']),
    reversedMessages() {
      return Array.from(this.messages).reverse()
    }
  },
  mounted() {
    this.$socket.bindEvent(this, 'interpret-message', () => {
      Vue.nextTick(() => {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight
      })
    })
  },
  destroyed() {
    this.$socket.unbindOwner(this)
  },
  methods: {
    tagMessage(user) {
      const you = this.$t('interpret.isSelf')
      const suffix = user.email === this.user.sub ? ` ${you}` : ''
      return user.name + suffix
    },
    sendMessage() {
      if (!this.newMessage.trim()) return

      this.$store.dispatch('interpret/message', this.newMessage)
      this.newMessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.interpret-panel {
  padding: 1em;
  border: 2px dashed $border;
  border-radius: 6px;
  background-color: $white-bis;
}

.interpret-panel-header {
  border-block-end: 1px solid $border;
  padding-block-end: 1em;
  margin-block-end: 1em;
}

.interpret-panel-main {
  position: relative;
  padding-block-start: 2em;

  > .label {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
}

.messagebox {
  height: 500px;
  overflow-y: auto;
  position: relative;

  display: flex;
  flex-direction: column;
}
.messagebox-inner {
  flex: 1;

  display: flex;
  flex-direction: column-reverse;
}

.messagebox-message {
  margin-bottom: 1rem;
}

.messagebox-heading {
  line-height: 1;
}
.messagebox-user {
  font-weight: bold;
}
.messagebox-date {
  color: $grey;
  margin-inline-start: 0.3rem;
  font-size: $size-7;
}
</style>

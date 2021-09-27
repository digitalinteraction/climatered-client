<template>
  <div class="interpretPanel">
    <header class="interpretPanel-header">
      <p class="interpretPanel-label">
        {{ $t('ifrc.interpretPanel.onlineLabel') }}
      </p>
      <div class="tags">
        <span
          class="tag is-info"
          v-for="interpreter in interpreters"
          :key="interpreter.id"
        >
          {{ interpreter.name }}
        </span>
      </div>
    </header>
    <div class="interpretPanel-main">
      <p class="interpretPanel-label">
        {{ $t('ifrc.interpretPanel.messagesLabel') }}
      </p>
      <div class="interpretPanel-messages" ref="messageBox">
        <div class="messageBox">
          <div
            class="messageBox-message"
            v-for="message in reversedMessages"
            :key="message.date.getTime()"
          >
            <p class="messageBox-heading">
              <span class="messageBox-user">
                {{ message.user }}
              </span>
              <span class="messageBox-date">
                {{ getLocaleTime(message.date) }}
              </span>
            </p>
            <p class="messageBox-body">
              {{ message.body }}
            </p>
          </div>
        </div>
      </div>
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            type="text"
            class="input"
            v-model="newMessage"
            :placeholder="$t('ifrc.interpretPanel.messagePlaceholder')"
            @keyup.enter="submitMessage"
          />
        </div>
        <div class="control">
          <button class="button is-info" @click="submitMessage">
            {{ $t('ifrc.interpretPanel.messageAction') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Interpreter } from '@openlab/deconf-shared'
import { BoothMessage } from '@openlab/deconf-ui-toolkit'
import Vue, { PropType } from 'vue'

// interface Message {
//   date: Date
//   user: string
//   body: string
// }

interface Data {
  newMessage: string
}

export default Vue.extend({
  props: {
    messages: { type: Array as PropType<BoothMessage[]>, required: true },
    interpreters: { type: Array as PropType<Interpreter[]>, required: true },
  },
  data(): Data {
    return {
      newMessage: '',
    }
  },
  computed: {
    reversedMessages(): BoothMessage[] {
      return Array.from(this.messages).reverse()
    },
  },
  watch: {
    messages() {
      Vue.nextTick(() => {
        const box = this.$refs.messageBox as HTMLElement
        box.scrollTop = box.scrollHeight
      })
    },
  },
  methods: {
    getLocaleTime(date: Date) {
      return date.toLocaleTimeString()
    },
    submitMessage() {
      if (!this.newMessage.trim()) return
      this.$emit('message', this.newMessage)
      this.newMessage = ''
    },
  },
})
</script>

<style lang="scss">
.interpretPanel {
  padding: 1em;
  border: 2px dashed $border;
  border-radius: 6px;
  background-color: $white-bis;
}
.interpretPanel-header {
  border-block-end: 1px solid $border;
  padding-block-end: 1em;
  margin-block-end: 1em;
}
.interpretPanel-label {
  color: $black;
  font-weight: bold;
}
.interpretPanel-messages {
  height: 500px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

//
// Message Box
//
.messageBox {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
}
.messageBox-heading {
  line-height: 1;
}
.messageBox-user {
  font-weight: bold;
}
.messageBox-message {
  margin-bottom: 1rem;
}
.messageBox-date {
  color: $grey;
  margin-inline-start: 0.3rem;
  font-size: $size-7;
}
</style>

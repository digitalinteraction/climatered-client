<template>
  <AppWrapper :show-footer="false">
    <div class="coffee-chat">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-8 has-text-centered">
              <h3>
                <span class="online-dot"></span>{{ peers }}
                {{ $t('coffeechat.filterResults') }}
                {{ $t('coffeechat.readyBtn') }}
              </h3>
              <h1 class="title has-text-white">
                {{ $t('coffeechat.heading') }}
              </h1>
              <h3 class="is-size-5">
                {{ $t('coffeechat.body') }}
              </h3>
            </div>
          </div>
          <div class="columns is-centered">
            <div class="filter-results column is-4 is-12-mobile has-text-right">
              <p>
                {{ $t('coffeechat.filters.languageResults') }}:
                <span
                  class="has-text-weight-bold"
                  v-for="(option, index) in selectedLanguages"
                  :key="option.displayName"
                >
                  <span v-if="index != 0">, </span
                  >{{ $t(option.displayName) }}</span
                >
              </p>
            </div>
            <div class="filter-results column is-4 is-12-mobile has-text-left">
              <p>
                {{ $t('coffeechat.filters.themeResults') }}:
                <span
                  class="has-text-weight-bold"
                  v-for="(option, index) in selectedThemes"
                  :key="option.value"
                >
                  <span v-if="index != 0">, </span
                  >{{ option.translationObject.title[$i18n.locale] }}</span
                >
                <span
                  class="has-text-weight-bold"
                  v-if="selectedThemes.length == 0"
                  >{{ $t('coffeechat.filters.anyOption') }}</span
                >
              </p>
            </div>
          </div>
          <div class="columns is-centered is-multiline">
            <div class="column is-4">
              <div
                id="language-selector"
                class="dropdown has-text-left"
                :class="{ 'is-active': filters.languages.isActive }"
              >
                <div class="dropdown-trigger">
                  <button
                    class="button trigger-btn"
                    aria-haspopup="true"
                    aria-controls="language-dropdown-menu"
                    @click="languageDropDownSelect()"
                  >
                    <span class="text">{{
                      $t('coffeechat.filters.languageSelector')
                    }}</span>
                    <span
                      class="icon is-small"
                      v-if="!filters.languages.isActive"
                    >
                      <fa icon="angle-down" />
                    </span>
                    <span
                      class="icon is-small"
                      v-if="filters.languages.isActive"
                    >
                      <fa icon="angle-up" />
                    </span>
                  </button>
                </div>
                <div
                  class="dropdown-menu"
                  id="language-dropdown-menu"
                  role="menu"
                >
                  <div class="dropdown-content">
                    <div
                      v-for="(item, key) in filters.languages.options"
                      :key="item.displayName"
                    >
                      <label class="checkbox">
                        <div
                          class="dropdown-item"
                          :class="{
                            selected: filters.languages.options[key].selected
                          }"
                        >
                          <input
                            type="checkbox"
                            v-model="filters.languages.options[key].selected"
                          />
                          {{ $t(item.displayName) }}
                        </div>
                      </label>
                    </div>
                    <hr />
                    <div class="buttons">
                      <button
                        class="button is-outlined is-small is-rounded clear-button"
                        @click="clearSelectedLanguages()"
                      >
                        {{ $t('coffeechat.filters.clear') }}
                      </button>
                      <button
                        class="button is-primary is-small is-rounded save-button"
                        @click="savePreferences()"
                      >
                        {{ $t('coffeechat.filters.save') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div
                id="themes-selector"
                class="dropdown has-text-left"
                :class="{ 'is-active': filters.themes.isActive }"
              >
                <div class="dropdown-trigger">
                  <button
                    class="button trigger-btn"
                    aria-haspopup="true"
                    aria-controls="themes-dropdown-menu"
                    @click="themesDropDownSelect()"
                  >
                    <span class="text">{{
                      $t('coffeechat.filters.themeSelector')
                    }}</span>
                    <span class="icon is-small" v-if="!filters.themes.isActive">
                      <fa icon="angle-down" />
                    </span>
                    <span class="icon is-small" v-if="filters.themes.isActive">
                      <fa icon="angle-up" />
                    </span>
                  </button>
                </div>
                <div
                  class="dropdown-menu"
                  id="themes-dropdown-menu"
                  role="menu"
                >
                  <div class="dropdown-content">
                    <div class="scroll-container">
                      <div
                        v-for="(item, key) in filters.themes.options"
                        :key="item.value"
                      >
                        <label class="checkbox">
                          <div
                            class="dropdown-item"
                            :class="{
                              selected: filters.themes.options[key].selected
                            }"
                          >
                            <input
                              type="checkbox"
                              v-model="filters.themes.options[key].selected"
                            />
                            {{ item.translationObject.title[$i18n.locale] }}
                          </div>
                        </label>
                      </div>
                    </div>
                    <hr />
                    <div class="buttons">
                      <button
                        class="button is-outlined is-small is-rounded clear-button"
                        @click="clearSelectedThemes()"
                      >
                        {{ $t('coffeechat.filters.clear') }}
                      </button>
                      <button
                        class="button is-primary is-small is-rounded save-button"
                        @click="savePreferences()"
                      >
                        {{ $t('coffeechat.filters.save') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-12 has-text-centered ready-button-container">
              <button
                class="button is-primary is-info is-large"
                @click="leave"
                v-if="isWaiting"
              >
                <span class="icon rotate is-small">
                  <fa icon="globe" />
                </span>
                <span>{{ $t('coffeechat.waitingBtn') }}</span>
              </button>
              <button class="button is-primary is-large" @click="ready" v-else>
                {{ $t('coffeechat.readyBtn') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- <a href="https://thinkactivelabs.co.uk" target="_blank">
      <img class="ta-logo" src="/img/poweredby-ta.svg" width="200" />
    </a> -->
  </AppWrapper>
</template>

<script>
import { mapState } from 'vuex'
import AppWrapper from '@/components/AppWrapper.vue'
import CoffeeChatLobby from '../coffee-chat/coffee-chat-lobby'
import { ROUTE_COFFEE_CHAT_ROOM } from '../const'

export default {
  components: { AppWrapper },
  data() {
    return {
      peers: 0,
      isWaiting: false,
      filters: {
        languages: {
          isActive: false,
          options: [
            {
              displayName: 'coffeechat.filters.languages.EN',
              value: 'en',
              selected: true
            },
            {
              displayName: 'coffeechat.filters.languages.FR',
              value: 'fr',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.languages.ES',
              value: 'es',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.languages.AR',
              value: 'ar',
              selected: false
            }
          ]
        },
        themes: {
          isActive: false,
          options: []
        }
      }
    }
  },
  mounted() {
    this.coffeeChatLobby = new CoffeeChatLobby(this.$socket, roomId => {
      this.$router.push({
        name: ROUTE_COFFEE_CHAT_ROOM,
        params: { room: roomId }
      })
    })
    this.queryLobby(), this.loadThemes()
  },
  computed: {
    ...mapState('api', ['themes']),
    selectedLanguages() {
      return this.filters.languages.options.filter(o => o.selected == true)
    },
    selectedThemes() {
      return this.filters.themes.options.filter(o => o.selected == true)
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.queryLobby()
      }
    }
  },
  methods: {
    loadThemes() {
      this.themes.forEach(t => {
        this.filters.themes.options.push({
          value: t.slug,
          selected: false,
          translationObject: t
        })
      })
    },
    clearSelectedLanguages() {
      this.filters.languages.options.map(o => {
        o.selected = false
      })
    },
    clearSelectedThemes() {
      this.filters.themes.options.map(o => {
        o.selected = false
      })
    },
    languageDropDownSelect() {
      this.filters.themes.isActive = false
      this.filters.languages.isActive = !this.filters.languages.isActive
      return this.filters.languages.isActive
    },
    themesDropDownSelect() {
      this.filters.languages.isActive = false
      this.filters.themes.isActive = !this.filters.themes.isActive
      return this.filters.themes.isActive
    },
    savePreferences() {
      if (this.isWaiting) {
        this.leave()
      }
      if (this.filters.languages.isActive) {
        this.filters.languages.isActive = false
      }

      if (this.filters.themes.isActive) {
        this.filters.themes.isActive = false
      }
    },
    ready() {
      if (this.filters.languages.isActive || this.filters.themes.isActive) {
        return
      }
      this.coffeeChatLobby.joinLobby(this.getLanguages(), this.getThemes())
      this.isWaiting = true
    },
    leave() {
      this.coffeeChatLobby.leaveLobby()
      this.isWaiting = false
    },
    async queryLobby() {
      this.peers = await this.coffeeChatLobby.queryLobby(
        this.getLanguages(),
        this.getThemes()
      )
    },
    getLanguages() {
      const langPrefs = this.filters.languages.options
        .filter(l => l.selected)
        .map(l => l.value)
      return langPrefs.length > 0
        ? langPrefs
        : this.filters.languages.options.map(l => l.value)
    },
    getThemes() {
      const themePrefs = this.filters.themes.options
        .filter(t => t.selected)
        .map(t => t.value)
      return themePrefs.length > 0
        ? themePrefs
        : this.filters.themes.options.map(t => t.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.coffee-chat {
  @include appPageFlexFillChild;
  background-color: $greyish;
  color: #ffffff;
  padding-top: 15vh;
  background-image: url('/img/bg-pattern.svg');
  background-repeat: no-repeat;
  background-position: top;
  @include mobile {
    padding-top: 5vh;
  }
}

.online-dot {
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 50%;
  padding: 0.25rem;
  margin: 0 0.25rem;
  display: inline-block;
  background-color: #2bd145;
}

.dropdown {
  width: 100%;
  .dropdown-trigger {
    width: 100%;
    .trigger-btn {
      justify-content: flex-start;
    }
    .button {
      width: 100%;
      .text {
        width: 100%;
        text-align: start;
      }
    }
  }
  .dropdown-menu {
    width: 100%;
    padding-top: 0px;
    .dropdown-content {
      font-weight: bold;
      border-radius: 0px 0px 8px 8px;
      .scroll-container {
        max-height: 15vh;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .selected {
        color: $cc-coral;
      }
      hr {
        margin: 0.5rem 0rem;
      }
      .buttons {
        padding: 0rem 0.5rem;
        .button {
          width: calc(50% - 0.5rem);
        }
      }
      label.checkbox {
        margin-right: 0.5rem;
      }
    }
  }
}

.dropdown.is-active {
  span {
    color: $cc-coral;
  }
  .dropdown-trigger {
    button {
      border-radius: 8px 8px 0px 0px;
    }
  }
}

.dropdown:hover {
  span {
    color: $cc-coral;
  }
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  // color: #ffffff;
  color: $cc-coral;
}

.dropdown.is-active {
  .dropdown-menu {
    animation: navAnimOpen 0.2s ease-in-out;
  }
}

.dropdown-menu {
  label {
    width: 100%;
  }
  .clear-button {
    text-decoration: underline;
    opacity: 0.5;
  }
}

.ready-button-container {
  button {
    margin: auto;
    @include mobile {
      width: 100%;
    }
  }
}

.filter-results {
  text-align: left !important;
}

@keyframes navAnimOpen {
  0% {
    display: none;
    opacity: 0;
    max-height: 0;
  }
  10% {
    display: block;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.ta-logo {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  max-width: 135px;
}
</style>

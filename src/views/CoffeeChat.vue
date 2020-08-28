<template>
  <AppWrapper>
    <div class="coffee-chat">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8 has-text-centered">
            <h3>
              <span class="online-dot"></span>{{ peers }} Active Participants
            </h3>
            <h1 class="title has-text-white">Are you ready?</h1>
            <h3 class="is-size-5">
              We'll use the settings below to match you with another Climate:Red
              attendee. Click the button below to video chat with another
              attendee.
            </h3>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-4 has-text-right">
            <p>
              Language(s):
              <span
                v-for="(option, index) in selectedLanguages"
                :key="option.displayName"
              >
                <span v-if="index != 0">, </span
                >{{ $t(option.displayName) }}</span
              >
            </p>
          </div>
          <div class="column is-4 has-text-left">
            <p>
              Theme(s):
              <span
                v-for="(option, index) in selectedThemes"
                :key="option.displayName"
              >
                <span v-if="index != 0">, </span
                >{{ $t(option.displayName) }}</span
              >
              <span v-if="selectedThemes.length == 0">Any</span>
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
                  <span>Select languages</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
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
                      Clear
                    </button>
                    <button
                      class="button is-primary is-small is-rounded save-button"
                      @click="languageDropDownSelect()"
                    >
                      Save
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
                  <span>Select a theme (optional)</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="themes-dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <div
                    v-for="(item, key) in filters.themes.options"
                    :key="item.displayName"
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
                        {{ $t(item.displayName) }}
                      </div>
                    </label>
                  </div>
                  <hr />
                  <div class="buttons">
                    <button
                      class="button is-outlined is-small is-rounded clear-button"
                      @click="clearSelectedThemes()"
                    >
                      Clear
                    </button>
                    <button
                      class="button is-primary is-small is-rounded save-button"
                      @click="themesDropDownSelect()"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-12 has-text-centered">
            <button class="button is-primary is-large">
              {{ $t('coffeechat.readyBtn') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppWrapper>
</template>

<script>
import AppWrapper from '@/components/AppWrapper.vue'
export default {
  components: { AppWrapper },
  data() {
    return {
      peers: Math.ceil(Math.random() * 1000),
      filters: {
        languages: {
          isActive: false,
          options: [
            {
              displayName: 'coffeechat.filters.languages.EN',
              selected: true
            },
            {
              displayName: 'coffeechat.filters.languages.FR',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.languages.ES',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.languages.AR',
              selected: false
            }
          ]
        },
        themes: {
          isActive: false,
          options: [
            {
              displayName: 'coffeechat.filters.themes.earlyWarningEarlyAction',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.themes.conflict',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.themes.urban',
              selected: false
            },
            {
              displayName: 'coffeechat.filters.themes.climateSmartDdr',
              selected: false
            }
          ]
        }
      }
    }
  },
  computed: {
    selectedLanguages() {
      return this.filters.languages.options.filter(o => o.selected == true)
    },
    selectedThemes() {
      return this.filters.themes.options.filter(o => o.selected == true)
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.coffee-chat {
  // min-height: calc(100vh - calc(#{$navbar-height} - 4rem));
  min-height: 100vh;
  background-color: $greyish;
  color: #ffffff;
  padding-top: 15vh;
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
    }
  }
  .dropdown-menu {
    width: 100%;
    padding-top: 0px;
    .dropdown-content {
      font-weight: bold;
      border-radius: 0px 0px 4px 4px;
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
      border-radius: 4px 4px 0px 0px;
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
</style>

<template>
  <span id="session-links">
    <div v-for="(link, i) in links" :key="i" class="session-link">
      <a
        :href="link.url"
        target="_blank"
        class="session-link--header has-text-white is-clearfix"
      >
        <span class="is-pulled-left">
          {{ link.title }}
        </span>
        <span class="is-pulled-right">
          <fa :icon="['fas', 'external-link-alt']" />
        </span>
      </a>
      <div class="session-link--body">
        <div class="field has-addons">
          <p class="control is-expanded">
            <input
              v-model="link.url"
              class="input is-small"
              type="text"
              placeholder="Link"
            />
          </p>
          <p class="control">
            <a
              class="button is-small is-dark is-uppercase"
              @click="copyToClipboard(link)"
            >
              {{ $t('general.copy') }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  name: 'SessionLinks',
  props: {
    links: {
      type: Array,
      required: true
    }
  },
  methods: {
    copyToClipboard(link) {
      if (link.url) {
        copy(link.url)
        alert('Link copied!')
      } else {
        alert('Link not found')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#session-links {
  .session-link {
    &:not(:last-child) {
      margin-bottom: 1em;
    }
    a.session-link--header {
      background-color: $cc-coral;
      border-top-left-radius: $radius;
      border-top-right-radius: $radius;
      display: block;
      padding: 8px 15px;
      font-size: 0.9em;
      font-weight: bold;
      &:hover {
        background-color: darken($color: $cc-coral, $amount: 2);
        color: white !important;
        text-decoration: underline;
      }
    }
    .session-link--body {
      border: 1px solid $border;
      border-top: none;
      border-bottom-left-radius: $radius;
      border-bottom-right-radius: $radius;
      overflow: hidden;
      padding: 10px;
      input {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>

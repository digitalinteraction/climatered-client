<script lang="ts">
import Vue from 'vue'
import { delocalise, LocalisedContent } from '@/lib/module'

interface Data {
  content: LocalisedContent | undefined
}

export default Vue.extend({
  props: {
    slug: { type: String, required: true },
  },
  data(): Data {
    return {
      content: undefined,
    }
  },
  computed: {
    domContent(): HTMLDivElement {
      const html = document.createElement('div')
      if (this.content) {
        html.innerHTML = delocalise(this.content, this.$i18n.locale) ?? ''
      }
      return html
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.content = await this.$store.dispatch('api/fetchContent', this.slug)
    },

    /** Convert a HTML node to a Vue.js VNode */
    domToVue(node: Node): Vue.VNode | string {
      if (node instanceof Text) return node.textContent ?? ''

      return this.$createElement(
        node.nodeName,
        Array.from(node.childNodes).map((n) => this.domToVue(n))
      )
    },
  },
  render(createElement): Vue.VNode {
    // Create an root element
    const el = createElement('div', { staticClass: 'content' }, [])

    // Go through each child of the api content
    // if a <div id="xyz"> attempt to replace with a slot
    // otherwise, copy the dom node across
    for (const child of this.domContent.children) {
      const slot = this.$slots[child.id]
      if (child instanceof HTMLDivElement && slot) {
        el.children?.push(...slot)
      } else {
        el.children?.push(this.domToVue(child) as Vue.VNode)
      }
    }

    return el
  },
})
</script>

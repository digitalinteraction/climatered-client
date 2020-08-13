<template>
  <div class="util-wrapper">
    <div class="buttons">
      <slot name="back-button" />
    </div>
    <section class="section is-medium">
      <div class="container is-small">
        <div class="box is-centered">
          <slot name="content" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.util-wrapper {
  min-height: 100vh;
  background-color: $grey-lightest;

  .box {
    max-width: $tablet;
    margin: 0 auto;
  }
}
</style>

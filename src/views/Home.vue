<template>
  <div class="home">
    Welcome to Size Matters.
    <br />Here you can get a room with all your developer team and see who has
    the bigger size.<br />Or fight until you reach an agreement.
    <br />
  </div>
</template>

<style scoped lang="scss">
.home {
  text-align: left;
}
</style>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>

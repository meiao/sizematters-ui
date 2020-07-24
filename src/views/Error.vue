<template>
  <div class="error">
    <div v-if="$route.params.type === 'connection'">
      There was a problem connecting the websocket.<br />
      Go kick (with your fists) someone in your IT deparment and tell them it is
      a life or death situation.
    </div>
  </div>
</template>

<style scoped lang="scss">
.error {
  text-align: left;
}
</style>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Error extends Vue {}
</script>

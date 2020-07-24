<template>
  <div>
    <md-button class="md-raised md-primary" @click="connect">Enter</md-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import router from "@/router";

@Component
export default class NoMenu extends Vue {
  connect() {
    websocket.connect(
      () => router.push({ name: "main" }),
      () => router.push({ name: "error", params: { type: "connection" } })
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

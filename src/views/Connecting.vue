<template>
  <div class="home">
    Connecting....
    <br />
  </div>
</template>

<style scoped lang="scss">
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import router from "@/router";
@Component
export default class Home extends Vue {

  @Prop(String) roomName: string | undefined;
  @Prop(String) password: string | undefined;

  created() {
    websocket.connect(() => {
      if (this.roomName !== undefined && this.password !== undefined) {
        websocket.joinRoom(this.roomName, this.password, true);
      }
      router.push({ name: "main" });
    },
    () => {
      router.push({ name: "error", params: { type: "connection" } })
    });
  }

}
</script>

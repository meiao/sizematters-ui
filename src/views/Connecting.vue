<template>
  <div class="home">
    Connecting....
    <br />
  </div>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import router from "@/router";
@Component
export default class Home extends Vue {
  @Prop(String) roomName: string | undefined;
  @Prop(String) password: string | undefined;

  created() {
    websocket.connect(
      () => {
        this.postConnect();
      },
      () => {
        router.push({ name: "error", params: { type: "connection" } });
      }
    );
  }

  postConnect() {
    websocket.once("OwnData", () => {
      if (this.roomName !== undefined && this.password !== undefined) {
        websocket.joinRoom(this.roomName, this.password, true);
      }
      router.push({ name: "main" });
    });
    websocket.register();
  }
}
</script>

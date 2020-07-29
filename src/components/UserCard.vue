<template>
  <md-card class="user-card">
    <md-card-header>
      <div class="md-title">{{ userData.name }}</div>
    </md-card-header>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import { UserData } from "@/../api/data";

@Component
export default class UserCard extends Vue {
  @Prop(String) userId = "";
  userData: UserData | undefined;

  created() {
    this.userData = websocket.user(this.userId);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user-card {
  max-width: 25%;
  min-width: 20%;
  overflow: hidden;
}
</style>

<template>
  <md-card class="user-card">
    <md-card-header>
      <div class="md-title">{{ userData.name }}</div>
    </md-card-header>
    <md-card-media>
      <Gravatar v-bind:gravatar="userData.gravatar_id" />
    </md-card-media>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import { UserData } from "@/../api/data";
import Gravatar from "./Gravatar.vue";

@Component({ components: { Gravatar } })
export default class UserCard extends Vue {
  @Prop(String) userId: string;
  userData: UserData | undefined = websocket.user(this.userId);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user-card {
  width: 20%;
  overflow: hidden;
}
</style>

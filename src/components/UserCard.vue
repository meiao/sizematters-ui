<template>
  <md-card class="user-card" :class="{ 'has-voted': userVote.num != -1 }">
    <md-card-header>
      <div class="md-title">{{ userData.name }}</div>
    </md-card-header>
    <md-card-media>
      <Gravatar v-bind:gravatar="userData.gravatar_id" class="user-pic" />
      <div class="user-size">{{ userVote.num }}</div>
    </md-card-media>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserData } from "@/../api/data";
import voteStore from "@/../api/vote.store";
import userStore from "@/../api/user.store";
import Gravatar from "./Gravatar.vue";

@Component({ components: { Gravatar } })
export default class UserCard extends Vue {
  @Prop(String) userId: string;
  @Prop(String) roomName: string;

  userData: UserData | undefined = userStore.user(this.userId);
  userVote = voteStore.userVote(this.roomName, this.userId);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user-card {
  flex: 0 0 15%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .md-card-header {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user-pic {
    backface-visibility: hidden;
    transition: 1s ease-in-out;
  }

  .user-size {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: rotateY(180deg) translateZ(1px);
    backface-visibility: hidden;
    transform: rotateY(180deg);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 64px;
    transition: 1s ease-in-out;
  }

  &.has-voted.show-vote {
    .user-pic {
      transform: rotateY(900deg);
    }
    .user-size {
      transform: rotateY(1080deg);
    }
  }
}
</style>

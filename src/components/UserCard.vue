<template>
  <md-card
    class="user-card"
    :class="{ 'has-voted': userVote.hasVoted }"
    :style="{ order: this.calculateOrder(this.userData.name) }"
  >
    <md-card-header>
      <div class="md-title">
        <span class="name">{{ userData.name }}</span>
        <span class="vote-badge">
          <md-icon class="voted">check</md-icon>
          <md-icon class="not-voted">help</md-icon>
        </span>
      </div>
    </md-card-header>
    <md-card-media>
      <Gravatar v-bind:gravatar="userData.gravatar_id" class="user-pic" />
      <div class="user-size">{{ userVote.value }}</div>
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

  /*
   * Hack to set the order in flex. Uses the "ASCII" representation of the number
   * normalized so a = 11 and names with less letters are padded with trailing 10s.
   * Can use at most 4 characters because of the limit on the max number for order.
   */
  calculateOrder(name: string) {
    const baseCharCode = "a".charCodeAt(0);
    const nameToUse =
      name.length > 4
        ? name.toLowerCase().substring(0, 4)
        : name.toLowerCase().padEnd(4, String.fromCharCode(baseCharCode - 1));
    return nameToUse
      .split("")
      .map((c) => c.charCodeAt(0) - baseCharCode + 11)
      .map((n) => n.toString())
      .join("");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user-card {
  flex: 0 0 150px;
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

  .vote-badge i {
    display: none;
    position: absolute;
    top: 0;
    right: 0;

    &.voted {
      color: green;
    }

    &.not-voted {
      color: red;
    }
  }

  &.has-voted .vote-badge .voted {
    display: block;
  }

  &:not(.has-voted) .vote-badge .not-voted {
    display: block;
  }
}
</style>

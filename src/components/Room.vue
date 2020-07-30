<template>
  <md-card class="room">
    <md-card-header class="header">
      <div class="md-title">{{ roomName }}</div>
    </md-card-header>
    <md-card-content class="user-space">
      <UserCard
        v-for="user in roomStatus.users"
        :key="user.user_id"
        :userId="user.user_id"
        class="user"
      />
    </md-card-content>
    <md-card-actions md-alignment="space-between">
      <md-button
        class="md-icon-button md-raised vote-button"
        v-for="num in numbers"
        :key="num"
        :class="{ 'md-accent': vote == num, 'md-primary': vote != num }"
        @click="castVote(num)"
      >
        {{ num }}
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import { RoomStatus } from "@/../api/data";
import UserCard from "./UserCard.vue";

@Component({ components: { UserCard } })
export default class Room extends Vue {
  @Prop(String) readonly roomName: string;

  roomStatus: RoomStatus | undefined;
  vote = -1;

  numbers: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

  created() {
    // hack to cast a String to a string
    this.roomStatus = websocket.room("" + this.roomName);
  }

  castVote(value) {
    this.vote = value;
    websocket.vote(this.roomName, value);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  color: white;
  background-color: black;
}

.room + .room {
  margin-top: 16px;
}

.md-card-actions {
  justify-content: center;
}

.room {
  .user-space {
    display: flex;
    flex-wrap: wrap;
    padding-top: 16px;
    justify-content: space-evenly;

    .user {
      margin: 16px 16px;
    }
  }

  .vote-button {
    height: 60px;
    width: 60px;
    font-size: 22px;
  }
}
</style>

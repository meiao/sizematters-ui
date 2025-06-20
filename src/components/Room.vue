<template>
  <md-card class="room">
    <md-card-header class="header">
      <div class="md-title">
        {{ roomName }} - https://{{ domain }}/room/{{ roomName }}/{{
          roomStatus.hashed_password
        }}
      </div>
    </md-card-header>
    <md-card-content class="user-space">
      <UserCard
        v-for="user in roomStatus.users"
        :key="user.user_id"
        :userId="user.user_id"
        :roomName="roomName"
        class="user"
        :class="{
          'show-vote': votingDone,
          'user-selected': selected == user.user_id,
        }"
      />
    </md-card-content>
    <md-card-actions md-alignment="space-between">
      <md-button
        class="md-icon-button md-raised vote-button"
        v-for="num in numbers"
        :key="num"
        :class="{
          'md-accent': vote.value == num,
          'md-primary': vote.value != num,
        }"
        @click="castVote(num)"
      >
        {{ num }}
      </md-button>
      <md-button
        class="md-accent md-raised"
        v-if="votingDone"
        @click="randomize"
      >
        Randomize
      </md-button>
      <md-button
        class="md-accent md-raised"
        v-if="votingDone"
        @click="requestNewVote"
      >
        New vote!
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import websocket from "@/../api/websocket";
import UserCard from "./UserCard.vue";
import { RoomData } from "../../api/data";
import roomStore from "@/../api/room.store";
import voteStore from "@/../api/vote.store";

@Component({ components: { UserCard } })
export default class Room extends Vue {
  @Prop(String) readonly roomName: string;

  roomStatus = roomStore.room(this.roomName);
  vote = voteStore.getOwnVote(this.roomName);
  selected = "";
  votingDone = false;
  domain = process.env.VUE_APP_DOMAIN;

  numbers: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

  onVotingResults(roomData: RoomData) {
    if (this.roomName == roomData.room_name) {
      this.votingDone = true;
    }
  }

  onNewVote(roomData: RoomData) {
    if (this.roomName == roomData.room_name) {
      this.votingDone = false;
      this.selected = "";
    }
  }

  onRandomized(roomData: RoomData) {
    if (this.roomName == roomData.room_name) {
      this.selected = roomData.selected_user_id;
      if ("speechSynthesis" in window) {
        this.roomStatus.users.forEach((user) => {
          if (user.user_id == this.selected) {
            const msg = new SpeechSynthesisUtterance();
            msg.text = "It is " + user.name;
            msg.lang = "en-US";
            window.speechSynthesis.speak(msg);
          }
        });
      }
    }
  }

  created() {
    websocket.on("VoteResults", this.onVotingResults);
    websocket.on("NewVote", this.onNewVote);
    websocket.on("Randomized", this.onRandomized);
  }

  castVote(value) {
    websocket.vote(this.roomName, value);
  }

  requestNewVote() {
    websocket.newVote(this.roomName);
  }

  randomize() {
    websocket.randomize(this.roomName);
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
      margin: 8px 8px;
    }
  }

  .vote-button {
    height: 60px;
    width: 60px;
    font-size: 22px;
  }

  .user-selected {
    border: 2px solid green;
    background-color: #77dd77;
  }
}
</style>

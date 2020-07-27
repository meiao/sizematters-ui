<template>
  <div>
    <md-dialog-prompt
      :md-active.sync="showNameDialog"
      @md-confirm="setName"
      md-title="What's your name?"
    />
    <md-dialog-prompt
      :md-active.sync="showEmailDialog"
      @md-confirm="setAvatar"
      md-title="Profile picture"
      md-content="I tried my best to create a profile picture for you.<br />
                      Since you didn't like it, you can use your Gravatar image.<br />
                      I will need your email for such.<br />
                      I promise I won't save/sell your email."
    />
    <md-card>
      <md-card-content id="user-tag">
        <md-avatar id="user-avatar" md-avatar-icon md-small md-primary>
          <img
            v-if="imgUrl != ''"
            :src="imgUrl"
            @click="showEmailDialog = true"
          />
          <span v-if="imgUrl == ''" @click="showEmailDialog = true">
            {{ name.substring(0, 1) }}
          </span>
        </md-avatar>
        <div id="user-name" @click="showNameDialog = true">{{ name }}</div>
      </md-card-content>
    </md-card>

    <div id="rooms">
      <header>
        Rooms
        <md-button
          @click="showRoomDialog = true"
          class="md-icon-button md-primary"
        >
          <md-icon>add</md-icon>
        </md-button>
      </header>
      <md-card v-if="rooms.length == 0">
        <md-card-content>
          You are not in any room.
          <br />Click the "+" to join one.
        </md-card-content>
      </md-card>
      <div id="room-list">
        <md-card v-for="room in rooms" :key="room.room_name">
          <md-card-header class="md-primary">
            <div class="md-title">{{ room.room_name }}</div>
          </md-card-header>
          <md-card-content>
            Voting: {{ room.votes_cast }}/{{ room.users.length }}
          </md-card-content>
          <md-card-actions>
            <md-button @click="leaveRoom(room.room_name)">Leave</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <div>
      <md-dialog id="show-room-dialog" :md-active.sync="showRoomDialog">
        <md-dialog-title>Join Room</md-dialog-title>
        <md-dialog-content>
          <md-field>
            <label>Room Name</label>
            <md-input v-model="roomName"></md-input>
          </md-field>
          <md-field>
            <label>Room Password</label>
            <md-input v-model="roomPassword"></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="showRoomDialog = false">Close</md-button>
          <md-button class="md-raised md-primary" @click="joinRoom"
            >Save
          </md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#user-tag {
  display: flex;
  align-items: center;

  #user-avatar {
    flex: 0 0 auto;
    margin-right: 8px;
  }

  #user-name {
    flex: 1 0 auto;
    margin-left: 8px;
  }
}

#rooms {
  margin-top: 24px;

  header {
    display: flex;
    align-items: center;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import websocket from "../../../api/websocket";
import { UserData, RoomStatus } from "../../../api/data";
@Component
export default class MenuMain extends Vue {
  showNameDialog = false;
  showEmailDialog = false;
  showRoomDialog = false;

  name = "not connected";
  imgUrl = "";

  providedName = "";
  providedUrl = "";

  roomName = "";
  roomPassword = "";

  rooms: RoomStatus[] = websocket.rooms();

  created() {
    websocket.on("YourData", this.personalDataReceived);
    // websocket.on("RoomJoined", this.roomJoined);
    websocket.register();
  }

  personalDataReceived(data) {
    const userData: UserData = data.user;
    this.name = userData.name;
    this.imgUrl =
      "https://www.gravatar.com/avatar/" + userData.gravatar_id + "?d=retro";
    this.providedName = userData.name;
    this.providedUrl = "";
  }

  setName(name) {
    websocket.setName(name);
  }

  setAvatar(email) {
    websocket.setAvatar(email);
  }

  joinRoom() {
    websocket.joinRoom(this.roomName, this.roomPassword);
    this.showRoomDialog = false;
    this.roomName = "";
    this.roomPassword = "";
  }

  leaveRoom(roomName: string) {
    websocket.leaveRoom(roomName);
  }
}
</script>

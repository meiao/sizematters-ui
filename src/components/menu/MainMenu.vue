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
      md-content="I tried my best to create a profile
    picture for you.<br />
    Since you didn't like it, you can use your
    <a target='_blank' href='https://www.gravatar.com'>Gravatar</a> image.<br />
    I will need your email for such.<br />
    I promise I won't save/sell your email."
    />
    <md-card md-with-hover>
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

    <div id="menu-rooms">
      <header>
        Rooms
        <md-button
          @click="showRoomDialog = true"
          class="md-icon-button md-primary"
        >
          <md-icon>add</md-icon>
        </md-button>
      </header>
      <md-card v-if="rooms.length == 0" md-with-hover>
        <md-card-content> Yes, the "+" over here </md-card-content>
      </md-card>
      <div id="room-list">
        <md-card v-for="room in rooms" :key="room.room_name" md-with-hover>
          <md-card-header class="md-primary">
            <div class="md-title">{{ room.room_name }}</div>
          </md-card-header>
          <md-card-content>
            Voting: {{ room.votes_cast }}/{{ room.users.length }}
            <md-field>
              <label for="selected_scale">Scale</label>
              <md-select
                v-model="room.selected_scale_name"
                name="scale"
                v-on="scaleChanged(room.room_name)"
              >
                <md-option
                  v-for="scale in room.scale_values"
                  :key="scale.name"
                  :value="scale.name"
                >
                  {{ scale.displayName }}</md-option
                >
              </md-select>
            </md-field>
          </md-card-content>
          <md-card-actions>
            <md-button @click="leaveRoom(room.room_name)">Leave</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>

    <div>
      <md-dialog id="show-room-dialog" :md-active.sync="showRoomDialog">
        <md-dialog-title>Create/Join Room</md-dialog-title>
        <md-dialog-content>
          <p>
            If someone gave you a room name/password combination, just enter it
            below to join that room.
          </p>
          <p>
            Or type a new name and select a password to create your own room.
            <br />
            Then share it with your cow-orkers in order to have a size battle.
          </p>
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

    <div id="thanks">
      <div @click="showThanksDialog = true">Thanks</div>
      <md-dialog id="thanks-dialog" :md-active.sync="showThanksDialog">
        <md-dialog-title>Thanks</md-dialog-title>
        <md-dialog-content>
          <p>
            Built with
            <a target="_blank" href="https://actix.rs/">Actix Web</a> and
            <a target="_blank" href="https://vuejs.org/">Vue</a>.
          </p>
          <p>
            Images provided by
            <a target="_blank" href="https://gravatar.com">Gravatar</a>.
          </p>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="showThanksDialog = false">Close</md-button>
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

#menu-rooms {
  margin-top: 24px;

  header {
    display: flex;
    align-items: center;
  }

  #room-list .md-card + .md-card {
    margin-top: 16px;
  }
}

#thanks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import websocket from "../../../api/websocket";
import { UserData, RoomStatus } from "../../../api/data";
import roomStore from "@/../api/room.store";

@Component
export default class MenuMain extends Vue {
  showNameDialog = false;
  showEmailDialog = false;
  showRoomDialog = false;
  showThanksDialog = false;

  name = "not connected";
  imgUrl = "";

  providedName = "";
  providedUrl = "";

  roomName = "";
  roomPassword = "";
  selectedScale = "";
  lastRoomSelected = "";

  rooms: RoomStatus[] = roomStore.rooms();

  created() {
    websocket.on("OwnData", this.personalDataReceived);
    websocket.on("ScaleChanged", this.scaleChangeReceived);
    websocket.on("RoomJoined", this.onRoomJoined);
    websocket.register();
  }

  onRoomJoined(data) {
    this.selectedScale = data.selected_scale_name;
  }

  personalDataReceived(data) {
    const userData: UserData = data.user;
    this.name = userData.name;
    this.imgUrl =
      "https://www.gravatar.com/avatar/" + userData.gravatar_id + "?d=retro";
    this.providedName = userData.name;
    this.providedUrl = "";
    this.selectedScale = data.selected_scale_name;
  }

  scaleChangeReceived(data) {
    if (data.selected_scale.name != this.selectedScale) {
      this.selectedScale = data.selected_scale.name;
    }
  }

  setName(name) {
    websocket.setName(name);
  }

  setAvatar(email) {
    websocket.setAvatar(email);
  }

  joinRoom() {
    websocket.joinRoom(this.roomName, this.roomPassword, false);
    this.showRoomDialog = false;
    this.roomName = "";
    this.roomPassword = "";
  }

  leaveRoom(roomName: string) {
    websocket.leaveRoom(roomName);
  }
  scaleChanged(roomName: string) {
    const room: RoomStatus = this.rooms.find(
      (room) => room.room_name == roomName
    )!;
    websocket.changeScale(roomName, room.selected_scale_name);
  }
}
</script>

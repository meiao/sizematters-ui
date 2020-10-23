<template>
  <div class="main">
    <md-card id="change-name-alert" v-if="!nameSet.value">
      <md-card-content>
        <md-icon>arrow_back</md-icon>
        <div>
          Hi <b>Shirtless Muppet</b>.<br />
          You can change your name by clicking it here to the left.
        </div>
      </md-card-content>
    </md-card>

    <div id="rooms">
      <Room
        v-for="room in rooms"
        v-bind:key="room.room_name"
        v-bind:roomName="room.room_name"
      />
      <md-empty-state
        v-if="rooms.length == 0"
        md-icon="new_releases"
        md-label="Join a room"
        md-description="To get the most of this website you should join a room, or create one. Do so by pressing the '+' over there."
        md-rounded
      >
      </md-empty-state>
    </div>
  </div>
</template>

<style lang="scss">
.main {
  position: relative;
}

#change-name-alert {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  z-index: 10;

  .md-card-content {
    display: flex;
    text-align: left;

    .md-icon {
      flex-grow: 0;
      margin-left: -8px;
      margin-right: 8px;
    }
  }
}

#participants {
  display: flex;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import roomStore from "@/../api/room.store";
import Room from "@/components/Room.vue";
import { BoxedValue, RoomStatus } from "@/../api/data";
import userStore from "@/../api/user.store";

@Component({ components: { Room } })
export default class Main extends Vue {
  rooms: RoomStatus[] = roomStore.rooms();
  nameSet: BoxedValue<boolean> = userStore.isNameSet();
}
</script>

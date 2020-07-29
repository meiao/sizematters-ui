<template>
  <div class="main">
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
        md-rounded="true"
      >
      </md-empty-state>
    </div>
  </div>
</template>

<style lang="scss">
#participants {
  display: flex;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import websocket from "../../api/websocket";
import Room from "@/components/Room.vue";
import { RoomStatus } from "@/../api/data";

@Component({ components: { Room } })
export default class Main extends Vue {
  rooms: RoomStatus[] = websocket.rooms();
}
</script>

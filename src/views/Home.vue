<template>
  <div class="home">
    This is the home.
    <md-button class="md-raised" md-primary v-on:click="sendData">
      Send Data
    </md-button>
  </div>
</template>

<script>
import websocket from "../../api/websocket";
export default {
  name: "Home",
  methods: {
    sendData: function() {
      websocket.joinRoom();
    },
  }
};
</script>

<template>
  <md-app id="app">
    <md-app-toolbar class="md-primary">
      Size Matters
    </md-app-toolbar>
    <md-app-drawer id="nav" md-permanent="clipped">
      <md-toolbar>
        <md-dialog-prompt
          :md-active.sync="showNameDialog"
          v-model="providedName"
          md-title="What's your name?"
        />
        <md-dialog-prompt
          :md-active.sync="showEmailDialog"
          v-model="providedUrl"
          md-title="Profile picture"
          md-content="I tried my best to create a profile picture for you.<br />
                      Since you didn't like it, you can use your Gravatar image.<br />
                      I will need your email for such.<br />
                      I promise I won't save/sell your email."
        />
        <md-avatar md-avatar-icon md-small md-primary>
          <img
            v-if="imgUrl != ''"
            :src="imgUrl"
            @click="showEmailDialog = true"
          />
          <span v-if="imgUrl == ''" @click="showEmailDialog = true">{{
            name.substring(0, 1)
          }}</span>
        </md-avatar>
        <div @click="showNameDialog = true">
          {{ name }}
        </div>
      </md-toolbar>
      <router-view name="menu" />
    </md-app-drawer>

    <md-app-content>
      <router-view />
    </md-app-content>
  </md-app>
</template>

<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  max-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script lang="ts">
import websocket from "../api/websocket";
import { UserData } from "../api/data";
import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class App extends Vue {
  name = "not connected";
  imgUrl = "";
  showNameDialog = false;
  showEmailDialog = false;

  created() {
    websocket.on("YourData", this.personalDataReceived);
  }

  personalDataReceived(data) {
    const userData: UserData = data.user;
    this.name = userData.name;
    this.imgUrl =
      "https://www.gravatar.com/avatar/" + userData.gravatar_id + "?d=retro";
  }

  set providedUrl(value) {
    websocket.setAvatar(value);
  }

  set providedName(value) {
    websocket.setName(value);
  }
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div id="participants">
      <md-card md-with-hover>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>

      <md-card>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>

      <md-card>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>

      <md-card>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>

      <md-card>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>

      <md-card>
        <md-card-header>Some Header</md-card-header>
        <md-card-content>Some Content</md-card-content>
      </md-card>
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
import router from "../router";
@Component
export default class Main extends Vue {
}
</script>

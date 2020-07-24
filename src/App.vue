<template>
  <md-app id="app">
    <md-app-toolbar class="md-primary">
      <h1>Size Matters</h1>
    </md-app-toolbar>
    <md-app-drawer id="nav" md-permanent="clipped">
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
import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class App extends Vue {}
</script>

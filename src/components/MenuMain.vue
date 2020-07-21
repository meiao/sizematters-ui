<template>
  <div>
    <router-link :to="{ name: 'Home' }">Home</router-link> <br />
    <router-link :to="{ name: 'About' }">About</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MenuMain extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

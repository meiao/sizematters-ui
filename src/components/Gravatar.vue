<template>
  <img v-if="imgUrl != ''" :src="imgUrl" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Gravatar extends Vue {
  @Prop(String) gravatar: string;

  get imgUrl() {
    if (this.gravatar == "") {
      return "";
    } else {
      return "https://www.gravatar.com/avatar/" + this.gravatar + "?d=retro";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

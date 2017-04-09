<template>
  <div>
    <app-header></app-header>
    <app-login></app-login>
    <app-sharer></app-sharer>
    <app-items></app-items>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sharer from './components/Sharer.vue';
import Items from './components/items/ItemContainer.vue';
import Login from './components/authentication/Login.vue';

export default {
  data () {
    return {
    }
  },
  components: {
    'appHeader': Header,
    'appSharer': Sharer,
    'appItems': Items,
    'appLogin': Login
  }
}
</script>

<style>

</style>

<template>
  <div>
    <app-header :sessionInfo="sessionInfo"></app-header>
    <app-login v-if="!loggedIn"></app-login>
    <div v-if="loggedIn">
      <app-sharer :sessionInfo="sessionInfo"></app-sharer>
      <app-items :sessionInfo="sessionInfo"></app-items>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sharer from './components/Sharer.vue';
import Items from './components/items/ItemContainer.vue';
import Login from './components/authentication/Login.vue';
import {EventBus} from './main.js';

export default {
  data() {
    return {
      sessionInfo: {}
    }
  },
  computed: {
    loggedIn() {
      return Object.keys(this.sessionInfo).length;
    }
  },
  components: {
    'appHeader': Header,
    'appSharer': Sharer,
    'appItems': Items,
    'appLogin': Login
  }, 
  created() {
    EventBus.$on('sessionCreated', (sessionInfo) => {
      this.sessionInfo = sessionInfo;
    });
    EventBus.$on('sessionDestroyed', () => {
      this.sessionInfo = {};
    });
  }
}
</script>

<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #F9F9F9;
    margin: 0;
    padding: 0;
  }

</style>

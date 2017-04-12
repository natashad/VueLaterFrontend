<template>
  <div>
    <app-header :sessionInfo="sessionInfo"></app-header>
    <app-login v-if="!loggedIn"></app-login>
    <div v-if="loggedIn">
      <app-sharer :sessionInfo="sessionInfo"></app-sharer>
      <div>
        <div class="sidebar">
          <app-sidebar></app-sidebar>
        </div>
        <div class="mainContent">
          <app-search-bar></app-search-bar>          
          <app-items :sessionInfo="sessionInfo" 
                     :durationFilter="durationFilter"
                     :typeFilter="typeFilter"
                     :friendFilter="friendFilter">
          </app-items>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sharer from './components/Sharer.vue';
import SearchBar from './components/SearchBar.vue';
import Items from './components/items/ItemContainer.vue';
import Login from './components/authentication/Login.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import {EventBus} from './main.js';
import Consts from './constants.js';

export default {
  data() {
    return {
      sessionInfo: {},
      durationFilter: [],
      typeFilter: [],
      friendFilter: ''
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
    'appLogin': Login,
    'appSidebar': Sidebar,
    'appSearchBar': SearchBar,
  }, 
  created() {

    if (this.$cookie.get('sessionToken')) {
      console.log("Setting session info from cookie!");
      this.sessionInfo = {
        token: this.$cookie.get('sessionToken'),
        fname: this.$cookie.get('fname')
      }
    }

    EventBus.$on(Consts.EVENT_SESSION_CREATED, (sessionInfo) => {
      this.sessionInfo = sessionInfo;
      this.$cookie.set('sessionToken', sessionInfo.token);
      this.$cookie.set('fname', sessionInfo.fname);
      
    });
    EventBus.$on(Consts.EVENT_SESSION_DESTROYED, () => {
      this.sessionInfo = {};
      this.$cookie.delete('sessionToken');
      this.$cookie.delete('fname');
    });
    EventBus.$on(Consts.EVENT_FILTERS_CHANGED_DURATION, (filters) => {
      this.durationFilter = filters;
    });
    EventBus.$on(Consts.EVENT_FILTERS_CHANGED_TYPE, (filters) => {
      this.typeFilter = filters;
    });
    EventBus.$on(Consts.EVENT_FILTERS_CHANGED_FRIEND, (filters) => {
      this.friendFilter = filters;
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

  .sidebar {
    width: 200px;
    float: left;
  }

  .mainContent {
    float: left;
    max-width: calc(100% - 200px);
    padding-left: 20px;
    box-sizing: border-box;

  }

</style>

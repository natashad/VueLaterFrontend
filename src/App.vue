<template>
  <div class="appContent">
    <app-header :sessionInfo="sessionInfo"></app-header>
    <app-login v-if="!loggedIn"></app-login>
    <div v-if="loggedIn">
      <app-sharer :sessionInfo="sessionInfo" :friends="friends"></app-sharer>
      <div>
        <div class="sidebar">
          <app-sidebar></app-sidebar>
        </div>
        <div class="mainContent">
          <app-search-bar></app-search-bar>
          <app-filter-display 
                     :durationFilter="durationFilter"
                     :typeFilter="typeFilter"
                     :friendFilter="friendFilter">
          </app-filter-display>
          <app-items :sessionInfo="sessionInfo" 
                     :durationFilter="durationFilter"
                     :typeFilter="typeFilter"
                     :friendFilter="friendFilter"
                     :friends="friends">
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
import FilterDisplay from './components/FiltersDisplay.vue';
import {EventBus} from './main.js';
import Consts from './constants.js';

export default {
  data() {
    return {
      sessionInfo: {},
      durationFilter: [],
      typeFilter: [],
      friendFilter: [],
      friends: [],
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
    'appFilterDisplay': FilterDisplay,
  }, 
  methods: {
    getFriends() {
      var options = {
        url: Consts.BASE_API_URL + "/" + Consts.FOLLOWING_ENDPOINT,
        method: 'GET',
        headers: 
        {
          Authorization: 'Basic ' + btoa(this.sessionInfo.token + ":" + "unused")
        }
      }
      this.$http(options).then(
        (response) => {
          this.friends = response.body;
        },
        (response) => {
          //error
          console.log("Error while getting friends");
        }
      );
    }
  },
  created() {

    if (this.$cookie.get('sessionToken')) {
      this.sessionInfo = {
        token: this.$cookie.get('sessionToken'),
        fname: this.$cookie.get('fname'),
        uid: this.$cookie.get('uid'),
      }
      this.getFriends();
    }

    EventBus.$on(Consts.EVENT_SESSION_CREATED, (sessionInfo) => {
      this.sessionInfo = sessionInfo;
      this.$cookie.set('sessionToken', sessionInfo.token);
      this.$cookie.set('fname', sessionInfo.fname);
      this.$cookie.set('uid', sessionInfo.fname);
      this.getFriends();
    });
    EventBus.$on(Consts.EVENT_SESSION_DESTROYED, () => {
      this.sessionInfo = {};
      this.$cookie.delete('sessionToken');
      this.$cookie.delete('fname');
      this.$cookie.delete('uid');
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
    EventBus.$on(Consts.EVENT_MODAL_IS_OPEN, (isOpen) => {
      var body = document.body;
      if (isOpen) {
        if (!body.classList.contains("noScroll")) {
          body.classList.add("noScroll");
        }
      } else {
        body.classList.remove("noScroll");
      }
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

  body.noScroll {
    overflow: hidden;
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

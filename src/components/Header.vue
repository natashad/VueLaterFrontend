<template>
    <div class="header">
        <h1 class="logo">NagBag</h1>
        
        <div v-if="sessionInfo.token" class="myAccount">
            Welcome {{sessionInfo.name}} <button class="logout" @click="logout">Log Out</button>      
        </div>
    </div>
</template>

<script>
import {EventBus} from '../main.js';
import Consts from '../constants.js';

export default {
    data() {
        return {
        }
    },
    props: {
        sessionInfo: Object,
    },
    methods: {
        logout(event) {
            event.preventDefault();
            EventBus.$emit(Consts.EVENT_SESSION_DESTROYED);
        }
    },
}
</script>

<style scoped>
    .header {
        border-bottom: 5px solid black;
        padding: 10px;
        padding-top: 0;
    }

    .logo {
        display: inline-block;
    }
    .myAccount {
        float: right;
    }
    .logout {
        background: linear-gradient(#00CC00, #00AA00);
        color: #FFF;
        border-top: none;
        border-radius: 5px;
        padding: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid #DDD;
        cursor: pointer;
        margin-left: 10px;
    }
</style>
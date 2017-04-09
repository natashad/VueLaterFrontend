<template>
    <div class="header">
        <h1 class="logo">NagBag</h1>
        
        <div v-if="sessionInfo.token" class="myAccount">
            Welcome {{sessionInfo.username}} <button @click="logout">Logout</button>      
        </div>
    </div>
</template>

<script>
import {EventBus} from '../main.js';

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
            EventBus.$emit('sessionDestroyed')
        }
    },
}
</script>

<style scoped>
    .header {
        border-bottom: 5px solid black;
        padding: 10px;
    }

    .logo {
        display: inline-block;
    }
    .myAccount {
        float: right;
    }
</style>
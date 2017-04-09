<template>
    <div>
        <h1>NagBag</h1>
        <div v-if="sessionInfo.token">
            Welcome {{sessionInfo.username}}, <button @click="logout">Logout</button>      
        </div>
        
    </div>
</template>

<script>
import {EventBus} from '../main.js';

export default {
    data() {
        return {
            sessionInfo: {}
        }
    },
    methods: {
        logout(event) {
            event.preventDefault();
            EventBus.$emit('sessionDestroyed')
        }
    },
    created() {
        EventBus.$on('sessionCreated', sessionInfo => {
            this.sessionInfo = sessionInfo;
        });
        EventBus.$on('sessionDestroyed', () => {
            this.sessionInfo = {};
        })
    }
}
</script>

<style>
</style>
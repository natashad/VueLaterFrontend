<template>
    <div v-if="sessionInfo.token" class="itemContainer">
        <app-item v-for="item in items" :key="item.id" :itemUrl="item.url"></app-item>
    </div>
</template>

<script>
import Consts from '../../constants.js';
import Item from './Item.vue';
import {EventBus} from '../../main.js';

export default{
    data() {
        return {
            items: [],
            sessionInfo: {},
        }
    },
    components: {
        appItem: Item
    },
    watch: {
        sessionInfo() {
            this.getItems();
        }
    },
    methods: {
        getItems() {
            console.log("getting items");
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.INBOX_ENDPOINT,
                method: 'GET',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.sessionInfo.token + ":unused")
                }
            }
            if (this.sessionInfo.token) {
                this.$http(options).then((response) => {
                    this.items = response.body;
                });
            }
        }
    },
    created() {

        this.getItems();

        EventBus.$on('sessionCreated', sessionInfo => {
            this.sessionInfo = sessionInfo;
        });
        EventBus.$on('sessionDestroyed', () => {
            this.sessionInfo = {}
        })
    }
}
</script>

<style>
.itemContainer {
    padding: 10px;
    border: 1px solid black;
    margin-top: 20px;
}
</style>
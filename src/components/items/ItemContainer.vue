<template>
    <div>
        INBOX:
        <div class="itemContainer">
            <app-item v-for="item in inboxItems" :key="item.id" :itemSender="item.sender" :itemUrl="item.url"></app-item>
        </div>
        
        <br />
        OUTBOX:
        <div class="itemContainer">
            <app-item v-for="item in outboxItems" :key="item.id" :itemOwner="item.owner" :itemUrl="item.url"></app-item>
        </div>
    </div>
</template>

<script>
import Consts from '../../constants.js';
import Item from './Item.vue';
import {EventBus} from '../../main.js';

export default{
    data() {
        return {
            inboxItems: [],
            outboxItems: []
        }
    },
    props: {
        sessionInfo: Object,
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
            console.log("getting inbox");
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
                    this.inboxItems = response.body;
                }, (response) => {
                    console.log("Error: Couldn't get inbox");
                });
            }
        },
        getOutbox() {
            console.log("getting outbox");
            var options = {
                url: Consts.BASE_API_URL + "/" + Consts.OUTBOX_ENDPOINT,
                method: 'GET',
                headers: 
                {
                    Authorization: 'Basic ' + btoa(this.sessionInfo.token + ":unused")
                }
            }
            if (this.sessionInfo.token) {
                this.$http(options).then((response) => {
                    this.outboxItems = response.body;
                }, (response) => {
                    console.log("Error: Couldn't get inbox");
                });
            }
        }
    },
    created() {
        this.getItems();
        this.getOutbox();
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
<template>
    <div>
        <div class="itemContainer" v-if="inboxSelected">
            <app-item v-for="item in inboxItems" :key="item.id" 
                :itemSender="item.sender" 
                :itemUrl="item.url"
                :itemDuration="item.duration"
                :itemNotes="item.note"
                :itemType="item.type">
            </app-item>
        </div>
        <div class="itemContainer" v-if="!inboxSelected">
            <app-item v-for="item in outboxItems" :key="item.id" 
                :itemOwner="item.owner" 
                :itemUrl="item.url"
                :itemDuration="item.duration"
                :itemNotes="item.note"
                :itemType="item.type">
            </app-item>
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
            outboxItems: [],
            inboxSelected: true,
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
            this.getnbox();
        }
    },
    methods: {
        getInbox() {
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
                    
                    if (response.status == 401) {
                        EventBus.$emit(Consts.EVENT_SESSION_DESTROYED);
                    }
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
                    console.log("Error: Couldn't get outbox: ");

                    if (response.status == 401) {
                        EventBus.$emit(Consts.EVENT_SESSION_DESTROYED);
                    }
                });
            }
        }
    },
    created() {
        this.getInbox();
        this.getOutbox();

        EventBus.$on(Consts.EVENT_ITEM_CREATED, () => {
            this.getInbox();
            this.getOutbox();
        });

        EventBus.$on(Consts.EVENT_INBOX_SELECTED, () => {
            this.inboxSelected=true;
        });

        EventBus.$on(Consts.EVENT_OUTBOX_SELECTED, () => {
            this.inboxSelected=false;
        });

    }
}
</script>

<style>
</style>
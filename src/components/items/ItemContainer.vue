<template>
    <div>
        <div class="itemContainer" v-if="inboxSelected">
            <app-item v-for="item in filteredInbox" :key="item.id" 
                :itemSender="getFullName(item.sender)" 
                :itemUrl="item.url"
                :itemDuration="item.duration"
                :itemNotes="item.note"
                :itemType="item.type">
            </app-item>
        </div>
        <div class="itemContainer" v-if="!inboxSelected">
            <app-item v-for="item in filteredOutbox" :key="item.id" 
                :itemOwner="getFullName(item.owner)" 
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
        durationFilter: Array,
        typeFilter: Array,
        friendFilter: Array,
        friends: Array
    },
    components: {
        appItem: Item
    },
    computed: {
        filteredInbox() {
            return this.inboxItems.filter((item) => {
                return ((!this.durationFilter.length || this.durationFilter.includes(item.duration)) &&
                    (!this.typeFilter.length || this.typeFilter.includes(item.type)) &&
                    (!this.friendFilter.length || (
                        this.friendFilter.some((filter) => {
                            return (
                                item.sender.includes(filter) || 
                                this.getFullName(item.sender).includes(filter))
                            })
                        )
                    )
                )
            });
        },
        filteredOutbox() {
            return this.outboxItems.filter((item) => {
                return ((!this.durationFilter.length || this.durationFilter.includes(item.duration)) &&
                    (!this.typeFilter.length || this.typeFilter.includes(item.type)) &&
                    (!this.friendFilter.length || (
                        this.friendFilter.some((filter) => {
                            return (
                                item.owner.includes(filter) || 
                                this.getFullName(item.owner).includes(filter))
                            })
                        )
                    )
                )
            });
        }
    },
    watch: {
        sessionInfo() {
            this.getnbox();
        },
    },
    methods: {
        getFullName(email) {
            var friend = this.friends.filter(friend => {
                return friend.email == email;
            });
            if (friend.length) {
                return friend[0].first_name + " " + friend[0].last_name;
            } else if (this.sessionInfo.email == email) {
                return this.sessionInfo.fname + " " + this.sessionInfo.lname;
            }
            return email;
        },
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

    },

}
</script>

<style>
</style>
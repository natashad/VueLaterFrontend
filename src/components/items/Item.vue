<template>
    <div class="item">
        <div class="itemHeader">
            <span v-if="itemSender">{{itemSender}}</span>
            <span v-else>{{itemOwner}}</span>
        </div>
        <div class="itemContent">
            <div v-if="itemDuration" class="duration">
                <i class="fa fa-clock-o" aria-hidden="true"></i> {{itemDuration}}
            </div>     
            <div v-if="itemType" class="type">
                <i class="fa fa-info-circle" aria-hidden="true"></i> {{itemType}}
            </div>                   
            <div><a :href="validUrl" target="__blank">{{validUrl}}</a></div>
            <div v-if="itemNotes" class="notes">
                <i class="fa fa-sticky-note-o" aria-hidden="true"></i> {{itemNotes}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        itemUrl: String,
        itemOwner: String,
        itemSender: String,
        itemType: String,
        itemDuration: String,
        itemNotes: String
    },
    computed: {
        validUrl() {
            if (!this.itemUrl.startsWith('http')) {
                return 'http://' + this.itemUrl;
            }
            return this.itemUrl;
        }
    }
}
</script>

<style scoped>
    .item {
        width: 300px;
        margin: 10px;
        float: left;
        border: 1px solid #EEE;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .itemHeader {
        background: #4da5ff;
        font-size: 12px;
        border-bottom: 1px solid #EEE;
        padding: 8px;
        font-weight: bold;
        text-align: center;
        color: white;
    }
    .itemContent {
        padding: 10px;
        color: #333;
        text-align: center;
    }
    .duration, .type {
        color: #555;
        font-size: 12px;
        display: inline-block;
        margin-right: 5px;
        margin-bottom: 5px;
    }
    .notes {
        margin-top: 10px;
        color: #555;
    }
</style>
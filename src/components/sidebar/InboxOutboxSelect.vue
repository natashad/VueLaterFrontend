<template>
    <div>
        <div class="sidetab" :class="{selected: inboxSelected}" @click="setInbox">Inbox</div>
        <div class="sidetab" :class="{selected: outboxSelected}" @click="setOutbox">Outbox</div>
    </div>
</template>

<script>
import {EventBus} from '../../main.js';
import Consts from '../../constants.js';

let INBOX = 'inbox';
let OUTBOX = 'outbox';

export default {
    data() {
        return {
            isSelected: INBOX,
        }
    },
    computed: {
        inboxSelected() {
            return this.isSelected === INBOX;
        },
        outboxSelected() {
            return this.isSelected === OUTBOX;
        }
    },
    methods: {
        setInbox() {
            this.isSelected = INBOX;
            EventBus.$emit(Consts.EVENT_INBOX_SELECTED);
        },
        setOutbox() {
            this.isSelected = OUTBOX;
            EventBus.$emit(Consts.EVENT_OUTBOX_SELECTED);
        }
    }
}
</script>

<style scoped>
    .sidetab {
        padding: 10px;
        border: 1px solid #EEE;
        background: #e9e9e9;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    .sidetab.selected {
        background: #add8e6;
        cursor: default;
    }
</style>
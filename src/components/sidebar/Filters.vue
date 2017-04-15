<template>
    <div class="filterContainer">
        <div class="heading">Filters:</div>
        <div class="filter">
            <div class="filterName">Type</div>
            <div>
                <input type="checkbox" value="watch" id="watchCheckbox" v-model="typeFilter" /> <label for="watchCheckbox">Watch</label>
            </div>
            <div>
                <input type="checkbox" value="read" id="readCheckbox" v-model="typeFilter" /> <label for="readCheckbox">Read</label>  
            </div>
            <div>
                <input type="checkbox" value="listen" id="listenCheckbox" v-model="typeFilter" /> <label for="listenCheckbox">Listen</label>  
            </div>
        </div>
        <div class="filter">
            <div class="filterName">Duration</div>
            <div>
                <input type="checkbox" value="short" id="shortCheckbox" v-model="durationFilter" /> <label for="shortCheckbox">Short</label>
            </div>
            <div>
                <input type="checkbox" value="medium" id="medCheckbox" v-model="durationFilter" /> <label for="medCheckbox">Medium</label>  
            </div>
            <div>
                <input type="checkbox" value="long" id="longCheckbox" v-model="durationFilter" /> <label for="longCheckbox">Long</label> 
            </div>
        </div>
        <div class="filter">
            <label class="filterName" for="friend">Friend: </label>
            <input id="friend" type="text" v-model="friendFilterSingle" @keyup.enter="addToFriendFilter()" />
        </div>
    </div>
</template>

<script>
import Consts from '../../constants.js';
import {EventBus} from '../../main.js';

export default {
    data() {
        return {
            durationFilter: [],
            typeFilter: [],
            friendFilterSingle: '',
            friendFilter: [],
        }
    },
    watch: {
        durationFilter: function(val) {
            EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_DURATION, val);
        },
        typeFilter: function(val) {
            EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_TYPE, val);
        },
        friendFilter: function(val) {
            EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_FRIEND, val);
        }
    },
    methods: {
        addToFriendFilter() {
            this.friendFilter.push(this.friendFilterSingle);
            this.friendFilterSingle = ''
        }
    }
}
</script>

<style scoped>
    .filterContainer {
        margin: 10px;
        margin-top: 20px;
    }
    .heading {
        font-weight: bold;
        text-align: center;
    }
    .filter {
        margin-top: 10px;
    }

    .filterName {
        text-decoration: underline;
        text-align: center;
        margin-bottom: 5px;
        display: block;
    }

    /*.filter input[type="checkbox"] {
        margin: 0;
    }*/

    .filter input[type="text"] {
        margin-top: 5px;
        width: 100%;
    }
</style>
<template>
    <div class="filterDisplay">
        <div @click="removeFilter(filter, 'typeFilter')" class="filterTag" v-for="filter in typeFilter">
            <span>x</span> {{filter}}
        </div>
        <div @click="removeFilter(filter, 'durationFilter')" class="filterTag" v-for="filter in durationFilter">
            <span>x</span> {{filter}}
        </div>
        <div @click="removeFilter(null, 'friendFilter')" class="filterTag" v-for="filter in friendFilter">
            <span>x</span> {{filter}}
        </div>
    </div>
</template>

<script>
import Consts from '../constants.js';
import {EventBus} from '../main.js';

export default {
    props: {
        durationFilter: Array,
        typeFilter: Array,
        friendFilter: Array
    },
    methods: {
        removeFilter(filterVal, filterType) {
            if (filterType === "friendFilter") {
                EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_FRIEND, 
                            this.friendFilter.splice(this.friendFilter.indexOf(filterVal),1))
            }
            if (filterType === "durationFilter") {
                EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_DURATION, 
                            this.durationFilter.splice(this.durationFilter.indexOf(filterVal),1));
            }
            if (filterType === "typeFilter") {
                EventBus.$emit(Consts.EVENT_FILTERS_CHANGED_TYPE, 
                            this.typeFilter.splice(this.typeFilter.indexOf(filterVal),1));
            }
        }
    }
    
    
}
</script>

<style>
    .filterDisplay {
        margin: 20px 0;
    }

    .filterTag {
        background: #cce5ff;
        padding: 5px 10px;
        margin: 5px;
        cursor: pointer;
        display: inline-block;
        font-weight: bold;        
    }

    .filterTag span {
        font-weight: normal;
        margin-right: 5px;
    }
</style>
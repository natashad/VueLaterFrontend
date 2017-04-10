<template>
    <div>
        <div class="searchBox" :class="{isFocus: searchFocused}">
            <i class="fa fa-search" aria-hidden="true"></i>
            <input type=text v-model="query" @focus="searchFocused=true" @blur="searchFocused=false" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            searchFocused: false,
        }
    }
}
</script>

<style scoped>
    .searchBox {
        margin: 10px 20px 10px 0;
        border: 1px solid #CCC;
        border-radius: 30px;
        text-align: left;
        background: white;
        padding: 0 10px; 
    }

    .searchBox.isFocus {
        border-color: #4D90FE;
        -webkit-box-shadow: 0px 0px 4px 0px #4D90FE;
        box-shadow: 0px 0px 4px 0px #4D90FE;
    }

    input {
        width: calc(100% - 50px);
        border: none;
        height: 100%;
        padding: 10px 5px;
        font-size: 15px;
    }
    input:focus {
        outline: none;
    }
    .fa-search {
        width: 20px;
        padding-left: 10px;
    }
</style>
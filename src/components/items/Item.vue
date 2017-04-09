<template>
    <div>
        {{itemUrl}} 
        <span v-if="itemSender">(from: {{itemSender}})</span>
        <span v-else>(to: {{itemOwner}})</span>
    </div>
</template>

<script>
export default {
    props: {
        itemUrl: String,
        itemOwner: String,
        itemSender: String,
    }
}
</script>

<style>
</style>
<template>
    <div>
        <app-inbox-toggle></app-inbox-toggle>
    </div>
</template>

<script>
import InboxOutboxSelect from './InboxOutboxSelect.vue';

export default {
    components: {
        'appInboxToggle': InboxOutboxSelect,
    }
}
</script>

<style>
</style>
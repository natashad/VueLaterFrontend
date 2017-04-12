<template>
    <div>
        <app-inbox-toggle></app-inbox-toggle>
        <app-filters></app-filters>
    </div>
</template>

<script>
import InboxOutboxSelect from './InboxOutboxSelect.vue';
import Filters from './Filters.vue';

export default {
    components: {
        'appInboxToggle': InboxOutboxSelect,
        'appFilters': Filters,
    }
}
</script>

<style>
</style>
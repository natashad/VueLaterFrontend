<template>
  <app-header></app-header>
  <app-sharer></app-sharer>
  <app-items></app-items>
</template>

<script>
import Header from './components/Header.vue';
import Sharer from './components/Sharer.vue';
import Header from './components/items/ItemContainer.vue';

export default {
  data () {
    return {
    }
  },
  components: {
    'appHeader': Header,
    'appSharer': Sharer,
    'appItems': Items,
  }
}
</script>

<style>

</style>

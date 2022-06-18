<template>
<v-container class="mt-4">
  <h1>{{ $t(viewTitle) }}</h1>
</v-container>
</template>

<script>
  export default {
    name: 'UsersView',
    props: {
      viewTitle: String,
      viewIndex: Number,
    }
  }
</script>
<style>
</style>

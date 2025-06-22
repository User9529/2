<script setup lang="ts">
import MenuIndex from './components/menu/MenuIndex.vue'
import Background1Index from '@/components/background1/Background1Index.vue';
</script>

<template>
  <div>
    <MenuIndex />
    <RouterView />
    <Background1Index />
  </div>
</template>
<style scoped>
body {
  margin: 0;
  display: flex;
}
</style>

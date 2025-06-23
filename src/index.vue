<script setup lang="ts">
import MenuIndex from './components/menu/MenuIndex.vue'
import  Breadcrumb from './components/menu/Breadcrumb.vue'
</script>

<template>
  <div>
    <MenuIndex  />
    <Breadcrumb />
    <RouterView />
  </div>
</template>
<style scoped>
body {
  margin: 0;
  display: flex;
}
</style>

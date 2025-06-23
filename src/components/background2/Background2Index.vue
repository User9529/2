<template>
  <div class="canvas-container">
    <canvas id="canvas-webgl" class="p-canvas-webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import initThree from './index/init.d.ts';

onMounted(() => {
  initThree();
});
</script>

<style scoped>
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2000px;
  overflow: hidden;
  z-index: -3; /* 确保背景处于最底层 */
  opacity: 1;
}

.p-canvas-webgl {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

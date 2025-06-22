<template>
  <div class="canvas-container">
    <canvas id="canvas-webgl" class="p-canvas-webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import initThree from './metal_cube/init.d.ts';

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
  height: 100%;
  overflow: hidden;
  z-index: -2; /* 确保背景处于最底层 */
  opacity: 0.5;
}

.p-canvas-webgl {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

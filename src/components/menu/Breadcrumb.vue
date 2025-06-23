<template>
  <div class="breadcrumb-container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="item.path">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const breadcrumbList = computed(() => {
  const matched = route.matched
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title
  }))
})
</script>

<style scoped>
.breadcrumb-container {
  padding: 10px;
  background-color: #f8f8f8;
  position:absolute;
  margin-left: 530px;
  margin-top: 20px;
}
</style>

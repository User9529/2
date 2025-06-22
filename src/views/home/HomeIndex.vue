<template>
  <div class="el-button-home">
  <el-button :plain="true" @click="open5">tttt</el-button>
  <el-button :plain="true" @click="open2">wwww</el-button>
  <el-button :plain="true" @click="open3">eeee</el-button>
  <el-button :plain="true" @click="open1">qqqq</el-button>
  <el-button :plain="true" @click="open4">rrrr</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage('1')
}
const open2 = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}
const open3 = () => {
  ElMessage({
    message: 'Warning, this is a warning message.',
    type: 'warning',
  })
}
const open4 = () => {
  ElMessage.error('Oops, this is a error message.')
}
const open5 = () => {
  ElMessage.primary('This is a primary message.')
}
</script>


<style lang="scss">
@use 'resources/style.scss';
</style>

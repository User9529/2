<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    position="absolute"
  >
    <el-menu-item index="0">
      <img
        @click="returnHome()"
        style="width: 60px; height: 60px"
        src="../../assets/shopping.png"
        alt="Element logo"
      />
    </el-menu-item>
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/login" class="login-link">请登录</a>
          <a href="/register" class="register-link">免费注册</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/login' }">切换主题</el-breadcrumb-item>
        <el-breadcrumb-item>我的法我</el-breadcrumb-item>
        <el-breadcrumb-item>厚礼谢厚</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-container">
      <el-autocomplete
        v-model="input2"
        style="width: 240px"
        placeholder="Type something"
        :fetch-suggestions="querySearch"
        @select="handleSelectSearch"
      >
        <template #prefix>
          <el-button type="primary" :icon="Search" @click="handleSearch" class="search-btn" />
        </template>
        <template #default="{ item }">
          <div class="autocomplete-item">
            <div>{{ item.value }}</div>
            <div class="autocomplete-subtitle">{{ item.subtitle }}</div>
          </div>
        </template>
      </el-autocomplete>
    </div>
    <el-menu-item index="1"><template #title>主页</template></el-menu-item>
    <el-sub-menu index="2">
      <template #title>产品</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">购物车</el-menu-item>
    <el-menu-item index="4">收藏夹</el-menu-item>

    <el-sub-menu index="5">
      <template #title>帮助中心</template>
      <el-menu-item index="5-1">官方客服</el-menu-item>
      <el-menu-item index="5-2">商家客服</el-menu-item>
      <el-menu-item index="5-3">消息中心</el-menu-item>
      <el-menu-item index="5-3">意见反馈</el-menu-item>
      <el-menu-item index="5-3">举报中心</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="5">用户中心</el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const input2 = ref('')
const router = useRouter()
let activeIndex = ref('1')

const handleSelect = (key: string, keyPath: string) => {
  activeIndex = ref(keyPath[keyPath.length - 1])
  if (activeIndex.value === '1') {
    router.push('/')
  }else if (activeIndex.value === '3'){
    router.push('/buycar')

  }
}

function returnHome() {
  router.push('/')
}

// 模拟下拉框数据
const restaurants = ref([
  { value: 'Option 1', subtitle: 'Subtitle 1' },
  { value: 'Option 2', subtitle: 'Subtitle 2' },
  { value: 'Option 3', subtitle: 'Subtitle 3' },
  { value: 'Option 4', subtitle: 'Subtitle 4' },
  { value: 'Option 5', subtitle: 'Subtitle 5' }
])

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter((item) =>
      item.value.toLowerCase().includes(queryString.toLowerCase())
    )
    : restaurants.value
  cb(results)
}

const handleSelectSearch = (item: any) => {
  console.log( item)
}

// 搜索框按钮点击事件
const handleSearch = () => {
  console.log('Search button clicked, input value:', input2.value)
  // 在这里添加搜索逻辑
}
</script>

<style lang="scss" scoped>
@use 'resources/style.scss';

</style>

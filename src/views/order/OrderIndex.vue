<template>
  <transition name="page-fade">
    <div v-if="isComponentMounted" class="common-layout">
      <div class="card-header">
        <span class="dingdan">我的订单</span>
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">

            <el-checkbox v-model="selectAll" @change="handleSelectAllChange" size="large">全选</el-checkbox>
            <el-pagination
              background
              :page-size="pageSize"
              :total="filteredTotal"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
            />
          </div>

        <el-input placeholder="搜索订单" style="width: 200px;">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>

      <el-container>
        <el-container>
          <el-header class="header">
            <div>
              <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="全部订单" name="all"></el-tab-pane>
                <el-tab-pane label="待付款" name="unpaid"></el-tab-pane>
                <el-tab-pane label="待发货" name="unsent"></el-tab-pane>
                <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
                <el-tab-pane label="已完成" name="completed"></el-tab-pane>
              </el-tabs>
            </div>
          </el-header>
          <el-main class="main">
            <el-scrollbar class="scrollbar-roll">
              <!-- 使用筛选后的分页数据 -->
              <div v-for="(item, index) in pagedFilteredData" :key="item.id" class="scrollbar-demo-item">
                <el-checkbox v-model="filteredCheckboxStates[index + (currentPage - 1) * pageSize]" size="large"></el-checkbox>
                <div style="margin-left: 20px; display: flex; flex-direction: column;">
                  <div>{{ item.name }}</div>
                  <div>价格：{{ item.price }}</div>
                  <div>
                    <el-tag :type="statusType[item.status || 'all']">
                      {{ statusMap[item.status || 'all'] }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
      <!-- 底部服务承诺 -->
      <div class="service-promises">
        <div class="service-item">
          <div class="service-icon">多</div>
          <div class="service-text">品类齐全，轻松购物</div>
        </div>
        <div class="service-item">
          <div class="service-icon">快</div>
          <div class="service-text">多仓直发，极速配送</div>
        </div>
        <div class="service-item">
          <div class="service-icon">好</div>
          <div class="service-text">正品行货，精致服务</div>
        </div>
        <div class="service-item">
          <div class="service-icon">省</div>
          <div class="service-text">天天低价，畅选无忧</div>
        </div>
      </div>

    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'

const isComponentMounted = ref(false);

// 模拟的后端数据，为每个商品添加状态属性
const collectionData = [
  { id: 1, name: "商品 1", price: 100, image: "image1.jpg", status: "unpaid" },
  { id: 2, name: "商品 2", price: 200, image: "image2.jpg", status: "unsent" },
  { id: 3, name: "商品 3", price: 150, image: "image3.jpg", status: "shipped" },
  { id: 4, name: "商品 4", price: 250, image: "image4.jpg", status: "completed" },
  { id: 5, name: "商品 5", price: 300, image: "image5.jpg", status: "unpaid" },
  { id: 6, name: "商品 6", price: 120, image: "image6.jpg", status: "unsent" },
  { id: 7, name: "商品 7", price: 180, image: "image7.jpg", status: "shipped" },
  { id: 8, name: "商品 8", price: 220, image: "image8.jpg", status: "completed" },
  { id: 9, name: "商品 9", price: 280, image: "image9.jpg", status: "unpaid" },
  { id: 10, name: "商品 10", price: 160, image: "image10.jpg", status: "unsent" },
  { id: 11, name: "商品 11", price: 210, image: "image11.jpg", status: "shipped" },
  { id: 12, name: "商品 12", price: 260, image: "image12.jpg", status: "completed" },
  { id: 13, name: "商品 13", price: 320, image: "image13.jpg", status: "unpaid" },
  { id: 14, name: "商品 14", price: 170, image: "image14.jpg", status: "unsent" },
  { id: 15, name: "商品 15", price: 190, image: "image15.jpg", status: "shipped" },
  { id: 16, name: "商品 16", price: 240, image: "image16.jpg", status: "completed" },
  { id: 17, name: "商品 17", price: 310, image: "image17.jpg", status: "unpaid" },
  { id: 18, name: "商品 18", price: 140, image: "image18.jpg", status: "unsent" },
  { id: 19, name: "商品 19", price: 230, image: "image19.jpg", status: "shipped" },
  { id: 20, name: "商品 20", price: 290, image: "image20.jpg", status: "completed" },
  { id: 21, name: "商品 21", price: 390, image: "image210.jpg", status: "unpaid" },
  { id: 22, name: "商品 22", price: 490, image: "image220.jpg", status: "unsent" },
];

// 状态映射
const statusMap = {
  unpaid: '待付款',
  unsent: '待发货',
  shipped: '待收货',
  completed: '已完成',
  all: '全部订单'
}

const statusType = {
  unpaid: 'danger',
  unsent: 'warning',
  shipped: 'primary',
  completed: 'success',
  all: ''
}

const pageSize = ref(10); // 每页显示的商品数量
const currentPage = ref(1); // 当前页码
const activeTab = ref('all'); // 当前激活的标签页

// 计算筛选后的订单数据
const filteredData = computed(() => {
  return activeTab.value === 'all'
    ? collectionData
    : collectionData.filter(item => item.status === activeTab.value)
})

// 计算筛选后的总数量
const filteredTotal = computed(() => {
  return filteredData.value.length
})

// 计算当前页要展示的筛选后数据
const pagedFilteredData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredData.value.slice(startIndex, endIndex);
});

// 复选框状态数组（基于筛选后的数据）
const filteredCheckboxStates = computed({
  get() {
    // 确保checkboxStates长度与筛选后数据一致
    if (checkboxStates.value.length !== filteredData.value.length) {
      checkboxStates.value = new Array(filteredData.value.length).fill(false);
    }
    return checkboxStates.value;
  },
  set(val) {
    checkboxStates.value = val;
  }
})

const checkboxStates = ref(new Array(collectionData.length).fill(false)); // 原始复选框状态数组
const selectAll = ref(false); // 全选框状态

// 全选框状态改变时，更新所有复选框状态
const handleSelectAllChange = (val: boolean) => {
  // 只更新当前页的复选框状态
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  for (let i = startIndex; i < endIndex && i < filteredCheckboxStates.value.length; i++) {
    filteredCheckboxStates.value[i] = val;
  }
};

// 标签切换处理
const handleTabChange = (tabName: string) => {
  console.log('切换到标签:', tabName);
  // 切换标签时重置到第一页
  currentPage.value = 1;
};

onMounted(() => {
  isComponentMounted.value = true;
});

// 监听所有复选框的状态，更新全选框状态
watch(filteredCheckboxStates, (newVal) => {
  // 计算当前页是否全选
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  const currentPageItems = newVal.slice(startIndex, endIndex);
  selectAll.value = currentPageItems.every((item) => item);
}, { deep: true });

// 分页切换时的处理
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};
</script>

<style lang="scss">
@use 'resources/style.scss';
</style>

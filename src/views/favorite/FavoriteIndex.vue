<template>
  <transition name="page-fade">
    <div v-if="isComponentMounted" class="common-layout">
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

      <el-container>
        <el-aside class="aside">

          <div style="height: 400px; box-shadow: var(--el-border-color-light) 0px 0px 10px">
            <el-splitter layout="vertical">
              <el-splitter-panel>
                <div class="demo-panel">1号广告位</div>
              </el-splitter-panel>
              <el-splitter-panel>
                <div class="demo-panel">2号广告位</div>
              </el-splitter-panel>
              <el-splitter-panel>
                <div class="demo-panel">3号广告位</div>
              </el-splitter-panel>
            </el-splitter>
          </div>
        </el-aside>
        <el-container>
          <el-header class="header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <el-checkbox v-model="selectAll" @change="handleSelectAllChange" size="large">全选</el-checkbox>
              <div>
                <el-pagination
                  background
                  :page-size="pageSize"
                  :total="total"
                  :current-page="currentPage"
                  @current-change="handleCurrentChange"
                  layout="prev, pager, next"
                />
              </div>
            </div>
          </el-header>
          <el-main class="main">
            <el-scrollbar class="scrollbar-roll">
              <!-- 使用模拟的后端数据 -->
              <div v-for="(item, index) in pagedCollectionData" :key="item.id" class="scrollbar-demo-item">
                <el-checkbox v-model="checkboxStates[index + (currentPage - 1) * pageSize]" size="large"></el-checkbox>
                <div style="margin-left: 20px; display: flex; flex-direction: column;">
                  <div>{{ item.name }}</div>
                  <div>价格：{{ item.price }}</div>
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

const isComponentMounted = ref(false);
// 模拟的后端数据
const collectionData = [
  { id: 1, name: "商品 1", price: 100, image: "image1.jpg" },
  { id: 2, name: "商品 2", price: 200, image: "image2.jpg" },
  { id: 3, name: "商品 3", price: 150, image: "image3.jpg" },
  { id: 4, name: "商品 4", price: 250, image: "image4.jpg" },
  { id: 5, name: "商品 5", price: 300, image: "image5.jpg" },
  { id: 6, name: "商品 6", price: 120, image: "image6.jpg" },
  { id: 7, name: "商品 7", price: 180, image: "image7.jpg" },
  { id: 8, name: "商品 8", price: 220, image: "image8.jpg" },
  { id: 9, name: "商品 9", price: 280, image: "image9.jpg" },
  { id: 10, name: "商品 10", price: 160, image: "image10.jpg" },
  { id: 11, name: "商品 11", price: 210, image: "image11.jpg" },
  { id: 12, name: "商品 12", price: 260, image: "image12.jpg" },
  { id: 13, name: "商品 13", price: 320, image: "image13.jpg" },
  { id: 14, name: "商品 14", price: 170, image: "image14.jpg" },
  { id: 15, name: "商品 15", price: 190, image: "image15.jpg" },
  { id: 16, name: "商品 16", price: 240, image: "image16.jpg" },
  { id: 17, name: "商品 17", price: 310, image: "image17.jpg" },
  { id: 18, name: "商品 18", price: 140, image: "image18.jpg" },
  { id: 19, name: "商品 19", price: 230, image: "image19.jpg" },
  { id: 20, name: "商品 20", price: 290, image: "image20.jpg" },
  { id: 21, name: "商品 21", price: 390, image: "image210.jpg" },
  { id: 22, name: "商品 22", price: 490, image: "image220.jpg" },

  // 可以继续添加更多商品...
];

const pageSize = ref(10); // 每页显示的商品数量
const currentPage = ref(1); // 当前页码
const total = ref(collectionData.length); // 总商品数量
const checkboxStates = ref(new Array(collectionData.length).fill(false)); // 复选框状态数组
const selectAll = ref(false); // 全选框状态

// 计算当前页要展示的商品数据
const pagedCollectionData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return collectionData.slice(startIndex, endIndex);
});

// 全选框状态改变时，更新所有复选框状态
const handleSelectAllChange = (val: boolean) => {
  // 只更新当前页的复选框状态
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  for (let i = startIndex; i < endIndex && i < checkboxStates.value.length; i++) {
    checkboxStates.value[i] = val;
  }
};
onMounted(() => {
  isComponentMounted.value = true;
});

// 监听所有复选框的状态，更新全选框状态
watch(checkboxStates, (newVal) => {
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

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 调整为左对齐 */
  height: 170px;
  width: 715px;
  margin: 10px;
  text-align: left;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.common-layout {
  margin-top: 80px;
  width: 100%;
  border-radius: 10px 10px 10px 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-container {
  height: 680px;
  width: 1250px;
  display: flex;
}

.aside {
  height: 100%;
  width: 270px;
  background-color: skyblue;
  opacity: 0.7;
  color: white;
  border-radius: 10px 0 0 10px; /* 左上角和右上角为圆角，左下角和右下角为直角 */
  overflow: hidden;
}

.header {
  background-color: rgba(230, 230, 230, 0.4);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
}

.main {
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
}

.scrollbar-roll {
  width: 100%;
}

.scrollbar-demo-item {
  background-color: rgba(230, 230, 230, 1);
  width: 97%;
}
.el-checkbox {
  margin-left: 30px;
}
.el-pagination{
  margin-right: 30px;
}

/* 底部服务承诺样式 */
.service-promises {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24px 0;
  background-color: #f8f8f8;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 16px 0;
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.service-text {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 1;
}

.page-fade-enter-from,
.page-fade-enter-to,
.page-fade-leave-from,
.page-fade-leave-to {
  transition: opacity 1s ease;
}
</style>

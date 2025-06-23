<template>
  <div class="home-page">
    <!-- 返回顶部按钮 -->
    <el-backtop :right="100" :bottom="100" />
    <!-- 空白顶部导航栏用于美观-->
    <el-header class="header"></el-header>
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 搜索框 -->
      <!--el-autocomplete：Element Plus的自动完成组件  v-model：双向绑定搜索输入值
       :fetch-suggestions：指定获取建议的方法
        @select：选择建议项时触发的事件
        插槽：#prefix：在输入框前添加搜索按钮  #default：自定义建议项的显示方式（主标题+副标题）-->
      <div class="search-container">
        <el-autocomplete
          v-model="input2"
          class="custom-search"
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
      <div class="banner-content" style="display: flex; gap: 35px; margin-top: 30px; margin-bottom: 30px;">
        <div class="banner" style="width: 800px; height: 400px; overflow: hidden;">
          <img
            src="@/assets/bg.jpg"
            alt="618大促"
            class="banner-image"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div class="banner" style="width: 450px; height: 400px; overflow: hidden; background-color: #f5f5f5;">
          <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #666;">
            右侧区域
          </div>
        </div>
      </div>
      <!-- 分类按钮区 - 9个按钮(8分类+全部) -->
      <!--v-for循环渲染分类按钮（包括"全部"选项）
      :key：必须的唯一标识，帮助Vue高效更新DOM
      :class：动态类名，当前选中分类的按钮会有特殊样式
      @click：点击时更新activeCategory
      动态图标：component :is：动态组件，根据cat.icon渲染对应的图标组件-->
      <div class="category-buttons">
        <div class="container">
          <div class="button-row">
            <div
              v-for="cat in [{ name: '全部', id: 'all', icon: 'Menu' }, ...categories]"
              :key="cat.id"
              class="category-button"
              :class="{ active: activeCategory === cat.name }"
              @click="activeCategory = cat.name"
            >
              <el-icon :size="20">
                <component :is="cat.icon" />
              </el-icon>
              <span>{{ cat.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品展示区 -->
      <div class="product-section">
        <h2 class="section-title">
          {{ activeCategory === '全部' ? '618热销商品' : `${activeCategory}专区` }}
          <span v-if="activeCategory === '特惠'" class="special-tag">限时特惠</span>
        </h2>

        <el-row :gutter="20" justify="center">
          <el-col
            v-for="product in displayedProducts"
            :key="product.id"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
          >
            <el-card class="product-card" shadow="hover">
              <!--商品卡片内容-->
              <div class="discount-tag">{{ product.discount }}% OFF</div>
              <div v-if="product.isSpecial" class="special-badge">特惠</div>
              <el-image :src="product.img" fit="cover" class="product-image" />
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="price-section">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="category-tag">{{ product.category }}</div>
                <el-button type="danger" size="small" class="buy-btn"> 立即抢购 </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 分页组件 -->
        <el-pagination
          v-if="activeCategory === '全部'"
          class="pagination"
          layout="prev, pager, next"
          :total="products.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          hide-on-single-page
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Monitor,
  Scissor,
  ShoppingCart,
  Document,
  Camera,
  Phone,
  CoffeeCup,
  Present,
} from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue' // 1.ref：创建响应式数据，2. computed：定义计算属性3. watch：监听数据变化
import { Search } from '@element-plus/icons-vue' //从Element Plus图标库引入搜索图标
// 搜索框值（创建一个响应式变量input2，初始值为空字符串这个变量会绑定到搜索框的输入值）
//通过v-model="input2"与输入框(div)双向绑定
const input2 = ref('')
// 模拟搜索建议数据(创建一个响应式数组)
const searchSuggestions = ref([
  { value: '手机', subtitle: '热门电子产品' },
  { value: '笔记本电脑', subtitle: '办公学习必备' },
  { value: '618特惠商品', subtitle: '限时折扣' },
  { value: '夏季服装', subtitle: '新款上市' },
  { value: '家用电器', subtitle: '品质生活' },
])

// 搜索建议查询方法
type SuggestionItem = { value: string } // 定义建议项的类型
// 根据用户输入的内容，从预定义的搜索建议列表中筛选出匹配的结果
//cb：回调函数，用于将筛选后的结果返回给 el-autocomplete 组件（Element Plus 的自动完成组件）
const querySearch = (
  queryString: string, //queryString：用户在搜索框中输入的文本。
  cb: (results: SuggestionItem[]) => void, // 指定回调函数的参数和返回值类型
) => {
  const results = queryString
    ? searchSuggestions.value.filter((item) =>
      item.value.toLowerCase().includes(queryString.toLowerCase()),
    )
    : searchSuggestions.value
  cb(results)
}

// 选择搜索建议时的处理,参数item是被选中的建议项,当前只是打印到控制台，实际项目中通常会跳转到搜索结果页
const handleSelectSearch = (item: unknown) => {
  console.log('选择了搜索建议:', item)
}

// 搜索按钮点击处理,实际项目中会调用搜索API或跳转到搜索结果页
const handleSearch = () => {
  console.log('执行搜索，搜索内容:', input2.value)
}

// 分类数据,icon：对应的Element Plus图标组件名
const categories = [
  { id: 1, name: '电器', icon: Monitor },
  { id: 2, name: '服装', icon: Scissor },
  { id: 3, name: '箱包', icon: ShoppingCart },
  { id: 4, name: '图书', icon: Document },
  { id: 5, name: '数码', icon: Camera },
  { id: 6, name: '手机', icon: Phone },
  { id: 7, name: '酒水', icon: CoffeeCup },
  { id: 8, name: '特惠', icon: Present },
]

// 定义生成商品数据（如果有后端数据表，需要替换这个本地模拟数据生成函数，改为从后端 API 获取数据）
const generateProducts = () => {
  const allProducts: Array<{
    id: number
    name: string
    price: string
    originalPrice: string
    discount: number
    category: string
    img: string
    isSpecial: boolean
  }> = []
  let globalId = 1

  // 定义类型
  type ProductTemplates = {
    电器: string[]
    服装: string[]
    箱包: string[]
    图书: string[]
    数码: string[]
    手机: string[]
    酒水: string[]
    特惠: string[]
  }

  // 使用类型断言productTemplates，为每个分类定义12个商品名称模板
  const productTemplates: ProductTemplates = {
    电器: [
      '智能冰箱',
      '变频空调',
      '滚筒洗衣机',
      '微波炉',
      '电饭煲',
      '空气净化器',
      '电风扇',
      '电热水器',
      '电烤箱',
      '榨汁机',
      '电磁炉',
      '电水壶',
    ],
    服装: [
      '男士T恤',
      '女士连衣裙',
      '牛仔裤',
      '羽绒服',
      '卫衣',
      '衬衫',
      '休闲裤',
      '风衣',
      '运动套装',
      '毛衣',
      '夹克',
      '西装',
    ],
    箱包: [
      '双肩背包',
      '手提包',
      '旅行箱',
      '钱包',
      '电脑包',
      '斜挎包',
      '登山包',
      '公文包',
      '腰包',
      '胸包',
      '拉杆箱',
      '化妆包',
    ],
    图书: [
      'JavaScript高级编程',
      'Vue.js实战',
      'React入门',
      'Python基础',
      'Java编程思想',
      '算法导论',
      '设计模式',
      '数据库原理',
      '计算机网络',
      '操作系统',
      '编译原理',
      '人工智能',
    ],
    数码: [
      '蓝牙耳机',
      '智能手表',
      '运动手环',
      '电子书阅读器',
      '平板电脑',
      '游戏手柄',
      '移动电源',
      'U盘',
      '硬盘',
      '路由器',
      '鼠标',
      '键盘',
    ],
    手机: [
      'iPhone 13',
      '华为P50',
      '小米12',
      'OPPO Find X5',
      'vivo X80',
      '荣耀Magic4',
      '三星S22',
      '一加10 Pro',
      'realme GT2',
      'iQOO 9',
      '红米K50',
      '魅族18',
    ],
    酒水: [
      '茅台',
      '五粮液',
      '泸州老窖',
      '洋河大曲',
      '青岛啤酒',
      '雪花啤酒',
      '张裕红酒',
      '长城干红',
      '威士忌',
      '伏特加',
      '白兰地',
      '朗姆酒',
    ],
    特惠: [
      '特惠商品1',
      '特惠商品2',
      '特惠商品3',
      '特惠商品4',
      '特惠商品5',
      '特惠商品6',
      '特惠商品7',
      '特惠商品8',
      '特惠商品9',
      '特惠商品10',
      '特惠商品11',
      '特惠商品12',
    ],
  }

  // 价格和折扣率实现（basePrice：现价，随机生成100-600之间的数  originalPrice：原价，在现价基础上增加100-400  discount：折扣率，计算公式：(原价-现价)/原价*100）
  categories.forEach((category) => {
    for (let i = 0; i < 12; i++) {
      const basePrice = Math.floor(Math.random() * 500) + 100
      const originalPrice = basePrice + Math.floor(Math.random() * 300) + 100
      const discount = Math.floor(((originalPrice - basePrice) / originalPrice) * 100)

      // 使用类型断言确保 category.name 是 ProductTemplates 的键
      const categoryName = category.name as keyof ProductTemplates

      allProducts.push({
        id: globalId++,
        name: productTemplates[categoryName][i],
        price: basePrice.toFixed(2),
        originalPrice: originalPrice.toFixed(2),
        discount: discount,
        category: category.name,
        img: `https://picsum.photos/300/300?product=${globalId}`, //使用picsum.photos服务的随机图片
        isSpecial: category.name === '特惠' || Math.random() > 0.8,
      })
    }
  })

  return allProducts
}
const products = generateProducts()
const activeCategory = ref('全部')

// 分页相关
const currentPage = ref(1)
const pageSize = 24 // 每页24个商品

// 计算当前显示的商品
const displayedProducts = computed(() => {
  const filtered = products.filter(
    (p) =>
      (activeCategory.value === '全部' || p.category === activeCategory.value) &&
      (activeCategory.value !== '特惠' || p.isSpecial),
  )

  if (activeCategory.value === '全部') {
    const start = (currentPage.value - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }
  return filtered
})
// 当切换分类时重置页码
watch(activeCategory, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 横栏 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 搜索框相关样式 */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-container :deep(.el-autocomplete) {
  width: 600px;
}
.search-container :deep(.el-input__wrapper) {
  padding: 0 15px; /* 内边距 */
  box-sizing: border-box;
}

.search-container :deep(.el-input__inner) {
  height: 100%;
}
/* 搜索按钮美化 */
.search-btn {
  height: 44px; /* 与输入框同高 */
  position: relative;
  left: -14px;
  background-color: #f01b1b !important;
  border-color: #faf6f6 !important;
}
.search-btn:hover {
  background-color: #e69500 !important;
  border-color: #e69500 !important;
}

/* 分类按钮区域 */
.category-buttons {
  padding: 15px 0;
  background-color: #f8f8f8;
  margin-bottom: 20px;
}
/* 分类按钮行 - flex布局 */
.button-row {
  display: flex;
  flex-wrap: nowrap; /* 禁止换行 */
  overflow-x: hidden;
  justify-content: space-around;
}
/* 单个分类按钮样式 */
.category-button {
  display: flex;
  flex-direction: column; /* 垂直排列图标和文字 */
  align-items: center;
  width: calc(100% / 9 - 20px);
  max-width: 100px;
  padding: 10px;
  margin: 0 10px;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s; /* 过渡效果 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
/* 分类按钮悬停效果 */
.category-button:hover {
  transform: translateY(-3px); /* 上浮效果 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 更大阴影 */
}
/* 当前选中分类按钮样式 */
.category-button.active {
  background-color: #ff4d4f;
  color: white;
}
/* 分类图标样式 */
.category-button .el-icon {
  margin-bottom: 5px; /* 与文字间距 */
}


/* 商品展示区 */

/* 商品区域容器 */
.product-section {
  padding: 30px 0;
}
/* 区域标题美化 */
.section-title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 22px;
  position: relative;
}
/* 特惠标签样式 */
.special-tag {
  background: #ff4d4f;
  color: white;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 10px;
}
/* 商品卡片容器 */
.product-card {
  margin-bottom: 20px;
  position: relative;
  transition: transform 0.3s;
  border: none;
}
/* 卡片悬停效果 */
.product-card:hover {
  transform: translateY(-5px); /* 上浮 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 折扣标签样式 */
.discount-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  z-index: 1; /* 在图片上方 */
}
/* 特惠徽章样式 */
.special-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #f5222d;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  z-index: 1;
}
/* 商品图片容器 */
.product-image {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}
/* 商品信息区域 */
.product-info {
  padding: 15px;
}
/* 商品名称样式 */
.product-name {
  font-size: 14px;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical; /* 垂直排列 */
}
/* 价格区域样式 */
.price-section {
  margin-bottom: 8px;
}
/* 当前价格样式 */
.current-price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: bold;
}
/* 原价样式 */
.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
  margin-left: 5px;
}
/* 分类标签样式 */
.category-tag {
  display: inline-block;
  background: #f5f5f5;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}
/* 购买按钮样式 */
.buy-btn {
  width: 100%;
  margin-top: 10px;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>

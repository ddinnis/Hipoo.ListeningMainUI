<template>
  <el-input placeholder="输入搜索内容" v-model="state.searchWord">
    <template #append>
      <el-button icon="el-icon-search" v-on:click="handleSearch()"></el-button>
    </template>
  </el-input>
  <div class="content">
    <el-row :gutter="10">
      <el-col :span="6" v-for="c in state.categories" v-bind:key="c.id">
        <router-link
          @click="handleClick(c)"
          :to="{
            path: 'Category',
            query: { id: c.id },
          }"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="c.coverUrl" class="image" />
            <div style="padding: 14px; display: flex; justify-content: center">
              <span>{{ c.name.chinese }}</span>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import { getCategories } from "@/api/index.js";
import { usebreadcrumbStore } from "@/store/store.js";

export default {
  name: "Index",
  setup() {
    const state = reactive({ categories: [], searchWord: "" });
    const router = useRouter();
    const store = usebreadcrumbStore();

    onMounted(async function () {
      getCategories().then((data) => {
        state.categories = data;
      });
    });
    const handleSearch = () => {
      router.push({ name: "Search", query: { word: state.searchWord } });
    };
    const handleClick = (data) => {
      store.breadcrumbOne = data.name.chinese;
      store.idOne = data.id;
    };
    return { state, handleSearch, handleClick };
  },
};
</script>
<style lang="less" scoped>
.content {
  margin: 20px 30px;
  .image {
    width: 100%;
    display: block;
  }
}
</style>

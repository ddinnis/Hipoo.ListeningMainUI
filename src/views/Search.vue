<template>
  <el-input placeholder="输入搜索内容" v-model="state.word">
    <template #append>
      <el-button icon="el-icon-search" v-on:click="handleSearch()"></el-button>
    </template>
  </el-input>
  <div class="suggestions">
    <el-row :gutter="10" v-for="e in state.episodes" v-bind:key="e.id">
      <router-link :to="{ path: 'Episode', query: { id: e.id } }">
        {{ e.cnName }}
      </router-link>
      <div v-html="e.plainSubtitle"></div>
      <el-divider></el-divider>
    </el-row>
    <el-pagination
      class="pagination"
      @current-change="currentPageChange"
      v-model:currentPage="state.currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="state.totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import { searchEpisodes } from "@/api/index.js";
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";

export default {
  name: "Search",
  setup() {
    const state = reactive({
      episodes: [],
      word: "",
      currentPage: 1,
      totalCount: 0,
    });
    const router = useRouter();
    var word = router.currentRoute.value.query.word;
    if (word && word.length > 0) {
      state.word = word;
    }
    onMounted(async function () {
      if (state.word && state.word.length > 0) {
        handleSearch();
      }
    });
    const handleSearch = async () => {
      // const word = state.word;
      // const pageIndex = state.currentPage;
      searchEpisodes(state).then((data) => {
        console.log("searchEpisodes", data);
        state.episodes = data.episodes;
        state.totalCount = data.totalCount;
      });
    };
    const currentPageChange = () => {
      handleSearch();
    };
    return { state, handleSearch, currentPageChange };
  },
};
</script>
<style lang="less" scoped>
:deep(em) {
  color: red;
}
.suggestions {
  margin: 20px;
  .pagination {
    display: flex;
    justify-content: center;
  }
}
</style>

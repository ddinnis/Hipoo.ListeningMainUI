<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Index' }">首页 </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'Category', query: { id: idOne } }">{{
          breadcrumbOne
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumbTwo }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10" v-for="e in state.episodes" v-bind:key="e.id">
      <router-link
        :to="{ path: 'Episode', query: { id: e.id } }"
        @click="handleClick(e)"
      >
        {{ e.name.chinese }}
      </router-link>
      <el-divider></el-divider>
    </el-row>
  </div>
</template>

<script>
import { getEpisodeById } from "@/api/index.js";
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import { usebreadcrumbStore } from "@/store/store.js";
import { storeToRefs } from "pinia";

export default {
  name: "Album",
  setup() {
    const state = reactive({ episodes: [] });
    const router = useRouter();
    const store = usebreadcrumbStore();
    const { breadcrumbOne, breadcrumbTwo, idOne } = storeToRefs(store);

    var id = router.currentRoute.value.query.id;
    onMounted(async function () {
      getEpisodeById(id).then((data) => {
        state.episodes = data;
      });
    });
    const handleClick = (data) => {
      store.breadcrumbThree = data.name.chinese;
    };
    return { state, handleClick, breadcrumbOne, idOne, breadcrumbTwo };
  },
};
</script>
<style lang="less" scoped>
.content {
  margin: 20px 30px;
  .breadcrumb {
    margin-bottom: 20px;
  }
}
</style>

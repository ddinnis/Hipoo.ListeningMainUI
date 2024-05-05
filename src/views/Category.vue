<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Index' }">首页 </el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumbOne }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10" v-for="a in state.albums" v-bind:key="a.id">
      <router-link
        :to="{ path: 'Album', query: { id: a.id } }"
        @click="handleClick(a)"
      >
        {{ a.name.chinese }}
      </router-link>
      <el-divider></el-divider>
    </el-row>
  </div>
</template>

<script>
import { getAlbumById } from "@/api/index.js";
import { useRouter, useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
import { usebreadcrumbStore } from "@/store/store";
import { storeToRefs } from "pinia";
export default {
  name: "Category",
  setup() {
    const state = reactive({ albums: [], cname: "", breadcrumbOne: "" });
    const router = useRouter();
    const route = useRoute();
    const store = usebreadcrumbStore();
    const { breadcrumbOne } = storeToRefs(store);
    const id = router.currentRoute.value.query.id;
    onMounted(async function () {
      getAlbumById(id)
        .then((data) => {
          console.log("getAlbumById", data);

          state.albums = data;
        })
        .catch((err) => {});
    });

    const handleNodeClick = () => {
      router.push({ name: "Search", query: { word: state.searchWord } });
    };
    const handleClick = (data) => {
      store.breadcrumbTwo = data.name.chinese;
      store.idTwo = data.id;
    };

    return { state, handleNodeClick, handleClick, breadcrumbOne };
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

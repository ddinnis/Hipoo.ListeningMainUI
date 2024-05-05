<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Index' }">首页 </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'Category', query: { id: idOne } }">{{
          breadcrumbOne
        }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'Album', query: { id: idTwo } }">{{
          breadcrumbTwo
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumbThree }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operationBtn">
      <el-button
        round
        size="small"
        style="background-color: #f2f2f2"
        @click="clearAllClick"
        >清除全部</el-button
      >
      <el-dropdown size="small" @command="changeLoop" style="margin: 0 10px">
        <span class="audio-speed">
          <el-button round size="small" style="background-color: #f2f2f2">{{
            state.loop
          }}</el-button>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in state.loopArray"
              :key="index"
              :command="item"
            >
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown size="small" @command="changeSpeed" style="margin: 0 10px">
        <span class="audio-speed">
          <el-button round size="small" style="background-color: #f2f2f2"
            >Speed: <b>{{ state.speed }} X</b></el-button
          >
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in state.speedArray"
              :key="index"
              :command="item"
            >
              {{ item }} X
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div v-if="state.episode">
      <div class="currentSentence">{{ state.currentSentence.value }}</div>
      <div class="audioPart">
        <audio
          :src="state.episode.audioUrl"
          style="width: 100%"
          controls
          ref="mainPlayer"
          autoplay
          v-on:timeupdate="updateCurrentSentence"
        />
      </div>
      <div>
        <el-button
          type="primary"
          style="width: 100%"
          v-on:click="addToSelectedSentences"
          >这句听不懂</el-button
        >
      </div>

      <div class="selectedWord">
        <el-row
          class="row"
          :gutter="10"
          v-for="(s, index) in state.selectedSentences"
          v-bind:key="index"
        >
          <span v-on:click="playSentence(s)" style="cursor: pointer">{{
            s.value
          }}</span>
          <el-icon :size="25" style="cursor: pointer" @click="moreClick(s)"
            ><More
          /></el-icon>
          <el-divider />
        </el-row>
      </div>
    </div>
    <div class="moreDialog">
      <el-dialog
        v-model="state.dialogVisible"
        title="操作"
        width="250px"
        :before-close="handleClose"
      >
        <el-button style="width: 100%" @click="deleteClick">删除</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, ref, onMounted, watch } from "vue";
import { usebreadcrumbStore } from "@/store/store.js";
import { storeToRefs } from "pinia";
import { getEpisode } from "@/api/index.js";

export default {
  name: "Album",
  setup() {
    const state = reactive({
      episode: {},
      selectedSentences: [],
      currentSentence: {},
      dialogVisible: false,
      speed: 1,
      speedLoop: [0.75, 1, 1.25, 1.5, 1.75],
      loop: "播放一遍",
      loopArray: ["播放一遍", "循环播放"],
      selectedRow: {},
    });
    const router = useRouter();
    const store = usebreadcrumbStore();
    const { breadcrumbOne, breadcrumbTwo, breadcrumbThree, idOne, idTwo } =
      storeToRefs(store);

    var id = router.currentRoute.value.query.id;

    const mainPlayer = ref(null);

    onMounted(async function () {
      getEpisode(id).then((data) => {
        state.episode = data;
      });
    });

    const querySentence = (position) => {
      const sentences = state.episode.sentences;
      for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i];
        if (position >= sentence.startTime && position <= sentence.endTime) {
          return sentence;
        }
      }
    };
    const sentenceEqual = function (s1, s2) {
      const floatEqual = function (n1, n2) {
        return Math.abs(n1 - n2) < 0.1;
      };
      return floatEqual(s1.startTime, s2.startTime) && s1.value == s2.value;
    };
    const exisitsInSelectedSentences = (itemToSearch) => {
      if (
        state.selectedSentences.find((e) =>
          sentenceEqual(e, state.currentSentence)
        ) >= 0
      ) {
        return true;
      }
      const selectedSentences = state.selectedSentences;
      for (var i = 0; i < selectedSentences.length; i++) {
        var item = selectedSentences[i];
        if (sentenceEqual(item, itemToSearch)) {
          return true;
        }
      }
      return false;
    };
    const addToSelectedSentences = () => {
      if (
        state.currentSentence &&
        !exisitsInSelectedSentences(state.currentSentence)
      ) {
        state.selectedSentences.push(state.currentSentence);
      }
    };
    const updateCurrentSentence = () => {
      let position = mainPlayer.value.currentTime;
      state.currentTime = position;
      let foundSentence = querySentence(position);
      if (
        foundSentence &&
        !sentenceEqual(foundSentence, state.currentSentence)
      ) {
        state.currentSentence = foundSentence;
      }
    };
    const playSentence = (sentence) => {
      mainPlayer.value.currentTime = sentence.startTime;
      mainPlayer.value.play();
    };

    // Space（空格键）控制音频播放

    document.addEventListener("keydown", function (e) {
      const isPaused = mainPlayer.value.paused;
      if (e.code === "Space") {
        console.log(isPaused);
        if (isPaused) {
          mainPlayer.value.play();
        } else {
          mainPlayer.value.pause();
        }
      }
    });

    // 调速
    const changeSpeed = (command) => {
      mainPlayer.value.playbackRate = command;
      state.speed = command;
    };
    const changeLoop = (command) => {
      if (command == "循环播放") {
        state.loop = command;
        mainPlayer.value.loop = true;
      }
    };

    // 更多按钮

    const moreClick = (command) => {
      console.log("moreClick", command);
      state.dialogVisible = true;
      state.selectedRow = command;
    };

    const deleteClick = () => {
      const index = state.selectedSentences.findIndex(
        (item) => item.value === state.selectedRow.value
      );

      if (index !== -1) {
        state.selectedSentences.splice(index, 1);
      }
      state.dialogVisible = false;
    };
    const handleClose = (done) => {
      done();
    };

    const clearAllClick = () => {
      state.selectedSentences = [];
    };
    return {
      state,
      mainPlayer,
      querySentence,
      sentenceEqual,
      exisitsInSelectedSentences,
      addToSelectedSentences,
      updateCurrentSentence,
      playSentence,
      breadcrumbOne,
      breadcrumbTwo,
      breadcrumbThree,
      idOne,
      idTwo,
      changeSpeed,
      moreClick,
      changeLoop,
      deleteClick,
      handleClose,
      clearAllClick,
    };
  },
};
</script>
<style scoped lang="less">
.content {
  margin: 20px 30px;
  .breadcrumb {
    margin-bottom: 20px;
  }
  .operationBtn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .currentSentence {
    margin: 10px 0;
  }

  .selectedWord {
    width: 100%;
    padding: 15px 5px;
    .row {
      justify-content: space-between;
    }
  }
}
</style>

<template>
  <div id="app">
    <music-player />
    <div id="guide">单击左侧唱片播放/暂停bgm、V键（重新）开始游戏 、S键躺下 、J键跳跃</div>
    <score ref="score" :score="score" :isGameOver="isGameOver" @update:score="updateScore" />
    <play-area ref="playArea":isGameOver="isGameOver" :startGame="startGame" />
    <game-over v-if="isGameOver" />
  </div>
</template>

<script>
import Score from './components/Score.vue';
import PlayArea from './components/PlayArea.vue';
import GameOver from './components/GameOver.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import { initializeGame, resetGame } from './utils/game.js';

export default {
  data() {
    return {
      score: 0,
      highScore: 0,
      isGameOver: true,
      
    };
  },
  components: {
    Score,
    PlayArea,
    GameOver,
    MusicPlayer,
  },
  methods: {
    updateGameStatus(status) {
      this.isGameOver = status;
    },
    updateScore(newScore) {
      this.score = newScore;
      if(newScore > this.highScore) {
        this.highScore = newScore
      }
    },
    startGame() {
      const playAreaComponents = this.$refs.playArea; // 获取 PlayArea组件
      const canvasElement = playAreaComponents.$refs.playAreaCanvas; // 获取 Canvas元素
      initializeGame(canvasElement, this.updateGameStatus, this.isGameOver); // 初始化游戏

      // 启动得分更新
      this.$refs.score.startScoreUpdate();
    },
    resetGame() {
      this.score = 0;
      this.isGameOver = false;
      resetGame();
      this.startGame();
    },
    handleKeydown(event) {
      if(event.key === 'v' && this.isGameOver) {
        this.resetGame();
      }
    }
  },
  mounted() {
    this.startGame(); // 在组件挂载后启动游戏
    window.addEventListener('keydown', this.handleKeydown);
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

#guide {
  font-size: 16px;
}
</style>